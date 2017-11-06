#!/bin/bash

ECHARTS_DIR="../echarts"

node ${ECHARTS_DIR}/build/build.js --min

cp ${ECHARTS_DIR}/dist/echarts.min.js ./public/vendors/echarts/echarts-all-3.js
cp ${ECHARTS_DIR}/dist/echarts.js ./public/vendors/echarts/echarts.js
rm -r ./public/vendors/echarts/extension
cp -r ${ECHARTS_DIR}/dist/extension ./public/vendors/echarts/
rm -r ./public/vendors/echarts/map
cp -r ${ECHARTS_DIR}/map ./public/vendors/echarts/

