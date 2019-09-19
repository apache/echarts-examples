#!/bin/bash

ECHARTS_DIR="../echarts"

# ------------------------------------------------------------------------
# Usage:
#
# # Build echarts in ${ECHARTS_DIR} and copy the dist to this project
# sh update-echarts.sh
#
# # Just copy the dist to this project
# sh update-echarts.sh --only-copy-dist
# ------------------------------------------------------------------------

while [[ $# -gt 0 ]]; do
    case "$1" in
        --only-copy-dist) onlyCopyDist="$1"; shift ;;
        *) shift ;;
    esac
done

if [[ ! -n "${onlyCopyDist}" ]]; then
    node ${ECHARTS_DIR}/build/build.js
    node ${ECHARTS_DIR}/build/build.js --min
fi

cp ${ECHARTS_DIR}/dist/echarts.min.js ./public/vendors/echarts/echarts.min.js
cp ${ECHARTS_DIR}/dist/echarts.js ./public/vendors/echarts/echarts.js
cp -r ${ECHARTS_DIR}/dist/extension ./public/vendors/echarts/
rm -r ./public/vendors/echarts/map
cp -r ${ECHARTS_DIR}/map ./public/vendors/echarts/
ls -alF ./public/vendors/echarts/