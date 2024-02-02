# Examples of ECharts

## Install

```shell
npm install
```

## Edit examples

### How

All test cases are in the `public/examples/ts` folder. The comment in the header

```js
/*
title: Area Pieces
titleCN: 折线图区域高亮
category: 'line, visualMap'
*/
```

describes the meta info of this example.

If you want to record a video to show the animation when genering screenshot. Use `videoStart` and `videoEnd`:

```js
/*
title: Bar Race
titleCN: 动态排序柱状图
category: bar
difficulty: 5
videoStart: 1000
videoEnd: 6000
*/
```

Most of examples are written in `TypeScript`. You need to compile it to `JavaScript` by using command:

```shell
npm run compile:example
```

### Some built-in features available in examples

#### Import third-party library

For example:

```js
$.when(
  $.getScript(ROOT_PATH + '/data/asset/js/xxxx.js'),
  $.getScript(
    'https://cdn.jsdelivr.net/npm/d3-contour@2.0.0/dist/d3-contour.jXs'
  )
).done(function () {
  // ...
});
```

#### Controller panel

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

#### Resize

```js
app.onresize = function () {
  // Do something.
};
```

#### Get width and height of the chart area

```js
var width = myChart.getWidth();
var height = myChart.getHeight();
```

## View and edit echarts-examples website

### Dev and view examples in website

```shell
npm run dev
```

### Use local echarts build

1. Update the URL of `localEChartsDir` & `localEChartsGLDir` in `src/common/config.js`
2. Add `local=1` in URL. For example:

- `editor.html?c=area-basic&local=1`

## Run e2e tests.

Run all the examples to test package publishing and install, module importing, minimal bundling and DTS correctness.

Before run the tests. you need to update the examples list.

```shell
npm run build:examplelist
```

If puppeteer has not been installed:

```shell
npm i puppeteer
```

If you want to save the log:

```shell
exe_something > 1.log 2>&1
```

### Run e2e test using local dependent repos

If you are testing a new version of echarts or zrender, which are not released in github yet, you need run e2e test with local dependent repos.

Firstly, make sure the dependent repos listed in `dir` attributes in `echarts-examples/e2e/config.js` existing and having release built.

Note: the commands below will execute `npm install` in these local directories.

```shell
# run e2e using local dependent repos and webpack.
npm run test:e2e:local > result.log 2>&1
# run e2e using local dependent repos and esbuild, which is much faster.
npm run test:e2e:esbuild:local > result.log 2>&1
```

### Run e2e test using remote dependent repos

Note: the commands below will download the repos listed in `echarts-examples/e2e/config.js` to a temporary folder.

```shell
# run e2e using remote dependent repos and webpack.
npm run test:e2e > result.log 2>&1
# run e2e using remote dependent repos and esbuild, which is much faster.
npm run test:e2e:esbuild > result.log 2>&1
```

### Check the test result

The test result is in:

- the `result.log`
- `echarts-examples/e2e/report.html`, the file should be opened in your own local http server.

### Run partial tests.

> Note: This can only be used when you run the whole e2e test at least once.

Skip specific stages.

```shell
node e2e/main.js --skip bundle
```

Specify matched tests.

```shell
node e2e/main.js --skip npm --tests bar3D*
```

## Release

1. Update example snapshots

```shell
npm run build:example

# Node: If only build for default theme:
node tool/build-example.js -t default
```

2. Build and copy all the build resources to `echarts-website`

```shell
npm run release

# Note: the config of the dir of echarts-website is in
# `echarts-examples/config/**`
```
