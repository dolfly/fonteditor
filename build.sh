#!/bin/bash
cd $(dirname $0)
[ -d ./dist ] && rm -r dist
nodeVersion=$(node -p "process.version.match(/v(\d+)\./)[1]")

if [ $nodeVersion -lt 17 ]; then
    npm run prod:node-old-version
else
    npm run prod
fi


cp -r dep dist
cp -r font dist
cp empty.html proxy.html dist
echo 'build to `dist` done'