setlocal 
@echo off

set PATH=%PATH%;%cd%\node;
set NODE_PATH=%cd%\node

echo %NODE_PATH%

cd node\master

node app.js

endlocal