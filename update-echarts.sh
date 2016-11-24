#!/bin/bash
cd ../echarts/build

sh build.sh

cp ../dist/echarts.min.js ../../echarts-examples/public/vendors/echarts/echarts-all-3.js
cp ../dist/echarts.js ../../echarts-examples/public/vendors/echarts/echarts.js
rm -r ../../echarts-examples/public/vendors/echarts/extension
cp -r ../dist/extension ../../echarts-examples/public/vendors/echarts/
