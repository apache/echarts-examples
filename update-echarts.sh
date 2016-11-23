#!/bin/bash
cd ../echarts/build

sh build.sh

cp ../dist/echarts.min.js ../../echarts-playground-static/public/vendors/echarts/echarts-all-3.js
cp ../dist/echarts.js ../../echarts-playground-static/public/vendors/echarts/echarts.js
rm -r ../../echarts-playground-static/public/vendors/echarts/extension
cp -r ../dist/extension ../../echarts-playground-static/public/vendors/echarts/
