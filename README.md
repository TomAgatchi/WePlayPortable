lettucePlayPortable
==================
Let us (lettuce) all try to control the same GameBoy game at once from our own devices. This can act as a personal version of the famous Twitch Plays Pokemon where your family and friends can work together (or against one another) trying to play the same instance of a game all at once. Similarly, you can flood the emulator with random inputs (or design an input pattern) and just watch the computer do a horrible job playing the game for some laughs. Perhaps the best way to use lettucePlay is to just leave the server running on your home network, and every time you sit down to take a dump, just log in as a player to pick up where you left off in your favorite GameBoy or GameBoy Color game.

This is a COMPLETELY portable multiplayer GameBoy emulator using node.js, javascript, ejs, HTML5, socket.io, engine.io and express inspired by romualdr's githubplaysgameboy. Currently, I'm working on adding a Nintendo 64 component to this project, and at some point I would like to add a machine-learning piece to replace the random inputs option.

![alt text](https://github.com/TomAgatchi/lettucePlayPortable/blob/master/screenshots/Screenshot_20180606-155649.png)
![alt text](https://github.com/TomAgatchi/lettucePlayPortable/blob/master/screenshots/Screenshot_20180606-155734.png)
![alt text](https://github.com/TomAgatchi/lettucePlayPortable/blob/master/screenshots/cheater.PNG)
![alt text](https://github.com/TomAgatchi/lettucePlayPortable/blob/master/screenshots/pkmnblue1.PNG)
![alt text](https://github.com/TomAgatchi/lettucePlayPortable/blob/master/screenshots/pkmnblue2.PNG)
![alt text](https://github.com/TomAgatchi/lettucePlayPortable/blob/master/screenshots/wof3.PNG)
![alt text](https://github.com/TomAgatchi/lettucePlayPortable/blob/master/screenshots/wof2.PNG)


I have run the server and cheater from my phone Pixel 2XL and had serveral players controling the game at once from their phones with no issues. The screen update for the players does miss a frame or two every now and then if you have the cheater flooding the master with inputs, but it's still playable.
  
Server tested on Windows 7 & 10, Mac OSX, and Android\Linux via Termux. Tested in firefox and chrome.

I only used ROMS of games in which I purchased a physical game cart for the actual Gameboy color system. Sadly we live in a day where Nintendo has made using something like this more difficult. But make your own ROMS if you still have those old games and have some fun anyways.

How to use
----------

Edit *config.json* to set the port, cheater password, and rom to play. This makes use of enhanced javascript (ejs).
* title: Displays this text on the master
* port: Port number for the server (default: 3000)
* allowed_inputs: Specify which inputs are allowed. (default: basic GameBoy inputs)
* rom: File name for your GameBoy or GameBoy Color rom. Relative path (default: 'rom.gb')
* cheatsalt: Salt used in cheater.ejs
* cheatpwd: Password to enter for cheater screen

1. Run RunServer.bat on windows or RunServer.sh on mac\linux
2. Start the master by going to '[serverIP]:[port]/master'
3. Connect one or more players by going to '[serverIP]:[port]' and selecting a user name.
4. [optional] Troll everyone playing by connecting to cheater ('[serverIP]:[port]/cheats') and type in the password. This allows you to flood   the emulator with inputs, save state, load state, fast forward up to 33x normal speed, and edit specific memory addresses corresponding with a few good cheats if you're playing pokemon red or blue. The cheater does not display the screen and does not support holding buttons down, or pressing multiple buttons at once. Normal players do. You can add custom input modes for the cheater in master.ejs. 
  
Have fun!!!
