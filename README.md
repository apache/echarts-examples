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


## Some built-in features available in examples


### Import third-party library

For example:
```js
$.when(
    $.getScript(ROOT_PATH + '/data/asset/js/myTransform.js'),
    $.getScript('https://cdn.jsdelivr.net/npm/d3-contour@2.0.0/dist/d3-contour.jXs'),
).done(function () {
    // ...
});
```



### Controller panel

Use this code to enable controller panel for a example:
```js
app.config = {
    aNameForTheSelectWidget: 'This is the initial value'
    aNameForTheRangeWidget: 45,
    aNameForTheButtonWidget: function () {
        // Do something.
    },
    onChange: function () {
        // Do something.
    }
};
app.configParameters = {
    aNameForTheSelectWidget: {
        options: [
            'This is the initial value',
            'This is another value',
            'This is the third value'
        ]
    },
    aNameForTheRangeWidget: {
        min: -90,
        max: 90
    }
};
```

### Resize

```js
app.onresize = function () {
    // Do something.
}
```

### Get width and height of the chart area

```js
var width = myChart.getWidth();
var height = myChart.getHeight();
```

