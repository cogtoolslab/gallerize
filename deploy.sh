#!/bin/sh
echo "restart"
rm -rf build
npm run build
npx serve -s build -l 8889
