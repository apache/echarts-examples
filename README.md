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

It will copy all the build resources to echarts-website/next/examples

## Use local echarts build

1. Update the URL of localEChartsMinJS in `common/config.js`
2. Add `local=1` in URL. For example: `editor.html?c=area-basic&local=1`


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
    $.getScript(ROOT_PATH + '/data/asset/js/xxxx.js'),
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


## Update example snapshots

```shell
npm run build:example
```

Only for default theme

```shell
node tool/build-example.js -t default
```


## Run e2e tests.

Run all the examples to test package publishing and install, module importing, minimal bundling and DTS correctness.

Before run the tests. you need to update the examples.

```shell
npm run build:example
```

Then run the tests.
```shell
npm run test:e2e
```

You can change the testing branch or local dir, which is available when add `--local` in `e2e/config.js`

If you want to test with esbuild bundler. Which is much faster.
```shell
npm run test:e2e:esbuild
```

If you want use the packages in your local folder which is still in developing. Please update the `dir` path in `test/config.js` for all packages first. Then run the script directly with `--local` arg.

```shell
node e2e/main.js --bundler esbuild -m --local
node e2e/main.js --bundler webpack -m --local
```

#### Run partial tests.

> Note: This can only be used when you run the whole e2e test at least once.

Skip specific stages.

```shell
node e2e/main.js --skip bundle
```

Specify matched tests.

```shell
node e2e/main.js --skip npm --tests bar3D*
```


