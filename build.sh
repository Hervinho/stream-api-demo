#! /bin/sh

# 1. Server
npm install
tsc

# 2. Prepare deployment artifact in a .zip file
zip -r deploy server/dist node_modules scripts