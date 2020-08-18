# Examples of ECharts

## Install

```shell
npm install
```

## Dev

```shell
npm run dev
```

## Release

```shell
npm run release
```

It will copy all the build resources to incubator-echarts-website/next/examples

## Use local echarts build

1. Update the URL of localEChartsMinJS in `common/config.js`
2. Add `local=1` in URL. For example: `editor.html?c=area-basic&local=1`


## Update example snapshots

```shell
node tool/build-example.js
```

Only for default theme

```shell
node tool/build-example.js -t default
```

## Edit example

All test cases are in the `public/data` folder. The comment in the header

```js
/*
title: Area Pieces
titleCN: 折线图区域高亮
category: 'line, visualMap'
*/
```

describes the meta info of this example.