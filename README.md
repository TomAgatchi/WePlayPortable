lettucePlayPortable
==================

![alt text](https://github.com/TomAgatchi/lettucePlayPortable/blob/master/screenshots/Screenshot_20180606-155649.png)
![alt text](https://github.com/TomAgatchi/lettucePlayPortable/blob/master/screenshots/Screenshot_20180606-155734.png)



Multiplayer GameBoy emulator using node.js, javascript, ejs, HTML5, socket.io, engine.io and express inspired by romualdr's githubplaysgameboy.
This is COMPLETELY portable and not at all taxing for any system. I can run the server and cheater from my phone and have serveral players controling the game at once from their phones.
  
Server tested on Windows 7 & 10, Mac OSX, and Android\Linux via Termux. Tested in firefox and chrome.

**DISCLAIMER**

You must own a legal .gb rom in order to use this.

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
