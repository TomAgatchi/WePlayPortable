lettucePlayPortable
==================

Multiplayer GameBoy emulator using node.js, javascript, ejs, HTML5, socket.io, engine.io and express inspired by romualdr's githubplaysgameboy.

  
Server tested on Windows 7 & 10, Mac OSX, and Android\Linux via Termux. This is COMPLETELY portable.

**DISCLAIMER**

You must own a legal .gb rom in order to use this.

How to use
----------

Edit *config.json* to set the port, cheater password, and rom to play. This makes use of enhanced javascript (ejs).
* title: Displays this text on the master
* port: Port number for the server (default: 3000)
* allowed_inputs: Specify wich inputs are allowed. (default: basic GameBoy inputs)
* rom: File name for your GameBoy or GameBoy Color rom. Relative path (default: 'rom.gb')
* cheatsalt: salt used in cheater.ejs
* cheatpwd: password to enter for cheater screen

1. Run RunServer.bat on windows or RunServer.sh on mac\linux
2. Start the master by going to <serverIP>:<port>/master
3. Connect one or more players by going to <serverIP>:<port> and selecting a user name.
4. [optional] Troll everyone playing by connecting to cheater (<serverIP>:<port>/cheats) and type in the password. This allows you to flood   the emulator with inputs, save state, load state, fast forward up to 33x normal speed, and edit specific memory addresses corresponding with a few good cheats if you're playing pokemon red or blue. The cheater does not display the screen and does not support holding buttons down, or pressing multiple buttons at once. Normal players do.

Screenshots
----------
![alt text](http://url/to/img.png)
