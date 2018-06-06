const express = require('express');
var app = express();
const path = require('path')
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server)
  , fs = require('fs')
  , os = require( 'os' )

//rstr2hex(rstr_md5(str2rstr_utf16le("string")))
const sha256 = require( './public/js/sha256.js' );
const blockTEA = require( './public/js/blockTEA.js' );

var config = require('./config.json');

function stringToInteger( s )
{
	var result = 0;
	for (var i = 0; i < s.length; i++){
	   result += Math.pow(27, 12 - i - 1)*(1 + s.charCodeAt(i) - ' ');
	   result &= 2147483647;
	}
	return result;
}

function tox64Scrambled( d, s )
{
	return blockTEA.encrypt( "" + JSON.stringify( d ), s );
}

function fromx64Scrambled( d, s )
{
	return JSON.parse( blockTEA.decrypt( d, s ) );
}

function randomString( n )
{
	var R = "";
	var k = 0;
	while( k < n ){
		R += String.fromCharCode( Math.floor( 32 + Math.random()*94 ) );
		k += 1;
	}
	return R;
}

function getNetworkInterfaceList()
{
	var possibles = {};
	var ifaces = os.networkInterfaces();
	for( var k in ifaces ){
		
		var ifacelist = ifaces[ k ];
		
		var mimocount = 0;
		for( var j in ifacelist ){
			
			var iface =  ifacelist[ j ];
			
			if( iface.family != 'IPv4' || iface.internal ){
				
				continue;
			}
			
			/*
			iface.address;
			iface.netmask;
			iface.family;
			iface.mac;
			iface.internal	//true if ignoreCase
			iface.scopeid	//ipv6
			iface.cidr
			*/
			
			possibles[ k ] = iface.address;//iface.address
			mimocount += 1;
		}
	}
	
	return possibles;
}


//Automagic configuration and defaults
if( config.port != undefined ){ config.port = 3000; }
if( config.url != undefined ){
	config.url += ':' + config.port;
}else{
	var possiblenetworks = getNetworkInterfaceList();
	var myserverip = "localhost";
	
	//We DONT KNOW which one to USE (add to configuration?)
	for( k in possiblenetworks ){
		myserverip = possiblenetworks[ k ];
		break;
	}
	
	config.url = myserverip + ':' + config.port;
}

console.log( "Serving on : ", config.url );


var allowedInputs = (config.allowed_inputs || ["start", "select", "left", "right", "up", "down", "a", "b"]);
var rom = __dirname + '/' + (config.rom || 'rom.gb');

var curframe = { d:"" };
var lastSaveStates = {};

server.listen(process.env.PORT || (config.port || 3000));

app.set('view engine', 'ejs');
app.get('/', function(req, res) {
  res.render('index', config);
});
app.get('/master', function(req, res) {
  res.render('master', config);
});
app.get('/cheats', function(req, res) {
  res.render('cheats', config);
});
app.get('/currentFrame', function(req, res) {
	res.writeHead( 200, 'image/png' );
	res.end( curframe.d, 'binary' );
});
app.use(express.static(path.join(__dirname, 'public')));

var continuedSocketId = 1;
var currentlyConnectedMasters = {};	//Can keep track of whatever...

io.sockets.on('connection', function (socket) {

	socket.cciduid = continuedSocketId; continuedSocketId += 1;	//Hm.

	socket.on('disconnect', function (data) {
		if( currentlyConnectedMasters.hasOwnProperty( socket.cciduid ) ){
			delete currentlyConnectedMasters[ socket.cciduid ];
		}
		//console.log( "someone left ", socket.handshake.address );
		//console.log( "clients: ", Object.keys( currentlyConnectedMasters ) );
	});

	socket.on('master:ready', function (data) {

		currentlyConnectedMasters[ socket.cciduid ] = socket;

		fs.readFile(rom, function(err, original_data){
		    var rom = original_data.toString('base64');
		    socket.emit('master:loadgame', {
		    	file: rom
		    });
		});
	});

	socket.on('keypress', function (data) {
		
		if (allowedInputs.indexOf(data.key) <= -1)
			return socket.disconnect();
		
		if ( socket.username == undefined ) {
			
			return socket.disconnect();
		}else{
			socket.broadcast.emit('master:push', {name: socket.username, key: data.key});
		}
	});
	
	socket.on('master:uploadframe', function ( data ) {
		curframe = {"d":data.d};	//data.d;
		socket.emit( 'master:gotframe', {} );
	} )
	
	socket.on('master:uploadstate', function ( data ) {
		
		lastSaveStates[ config.rom ] = data;

		//Save to a FILE so we can reload it from.. whatever.
		fs.writeFile( config.rom + '.gbs', JSON.stringify( data ), (err) => {
		  if (err) { console.log( err ); }
		  else{
			  console.log('The file has been saved!');
			}
		});

		socket.emit( 'master:gotstate', {} );
	} )

	socket.on('master:downloadstate', function ( data ) {

		if( lastSaveStates.hasOwnProperty( config.rom ) ){
			socket.emit( 'master:gotstate', lastSaveStates[ config.rom ] );
		}else{

			fs.readFile(config.rom + '.gbs', (err, datafs) => {
			  if (err){ 
			  	console.log( "No state exists ", err );
			  	socket.emit( 'master:gotstate', {} );
			  }else{
			  		var jsstr = datafs.toString('ascii');
			  		lastSaveStates[ config.rom ] = JSON.parse( jsstr );
			  		socket.emit( 'master:gotstate', lastSaveStates[ config.rom ] );
			   }
			});
		}
	});

	//socket.on('master:setSpeed', function ( data ) {
	//	console.log('fast forward speed', data);
	//	socket.emit( 'master:gotspeed', data );
	//});

	//socket.on('getframe', function (data) {		
	//	socket.emit( 'io:gotframe', curframe );
	//} )

	//Map each socket client <--> initialization value rv

	socket.ivrv = randomString( 24 );
	socket.svrv = "";

	socket.emit( 'cheats:begin', { rv:socket.ivrv } );

	socket.on('cheats:submitpasshash', function (data) {

		//console.log( data.data, " = ", sha256.hash( "apples" + socket.ivrv + config.cheatsalt ) )

		if( data.data == sha256.hash( config.cheatpwd + socket.ivrv + config.cheatsalt ) ){
		//if( data.data == sha256.hash( socket.ivrv + ("apples" + config.cheatsalt) ) ){

			socket.svrv = randomString( 64 );	//1 / 94 ^ 64

			socket.username = "Cheater";

			//var sendme = tox64Scrambled( { sv:socket.svrv }, socket.ivrv );

			//console.log( "sent: ", sendme );

			//var checkme = fromx64Scrambled( sendme, socket.ivrv );

			//console.log( "shouldbe: ", checkme );

			socket.emit( 'cheats:accepted', { data:tox64Scrambled( { sv:socket.svrv }, socket.ivrv ) } );	//{ sv:socket.svrv } );

		}else{
			socket.disconnect();
		}
	} );

	socket.on('cheats:action', function (data) {

		//assume data has encrypted information based on the sockets socket.svrv.
		if( socket.svrv.length > 62 ){

			var dodis = null;
			try{

				dodis = fromx64Scrambled( data.data, socket.svrv );

			}catch(e){

				//Disconnect cheating client
				socket.disconnect();
				console.log( "Hacking attempt intercepted for: ", socket.handshake.address, " e: ", e );
				
				return;
			}

			//
			//ADD STUFF FOR COMMANDS HERE
			//could improve this lol
			//
			//Decide how to send/convert this to the master socket stuff...

			// for( var mk in currentlyConnectedMasters ){
			// 	currentlyConnectedMasters[ mk ].emit( 'master:command', { dothis:dodis.action } )
			// }

			var sendThisthing = { dothis:dodis.action };
			if( dodis.value != undefined ){ sendThisthing.value = dodis.value; }

			for( var mk in currentlyConnectedMasters ){

				currentlyConnectedMasters[ mk ].emit( 'master:command', sendThisthing )
			}
			
			/*
			if( dodis.action == "enableRandomInputs" ){
				console.log( "Enable random inputs ");

				for( var mk in currentlyConnectedMasters ){
					currentlyConnectedMasters[ mk ].emit( 'master:command', { dothis:"toggleAutoplay" } )
				}

			}
			*/


		}else{
			//Disconnect cheating client
			console.log( "Hacking attempt intercepted for: ", socket );
			socket.disconnect();
		}
	});


	socket.emit('io:askusername', {});
	socket.on('io:username', function (data) {
		if (!data.name || !data.name.trim().length)
			return socket.disconnect();
		
		socket.username = data.name;
		
		socket.emit('io:launchPlay', {name: data.name, inputs: allowedInputs});
		
	})
});