@echo off
if not exist "./Database/" cmd /c md Database
if not exist package-lock.json cmd /c npm i
node index.js