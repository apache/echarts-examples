# Examples of ECharts

## Install

```shell
npm i --force
```

## Edit examples

### How

Add or edit example files in the `public/examples/ts` folder.
(Do NOT add or edit files in the `public/examples/js` folder!)

An example file in `public/examples/ts` folder can be `xxx.ts` or `xxx.js`.
After editing, you need to compile them to `JavaScript` using the following command:
```shell
# Compile all examples
npm run compile:example
# Compile a single example
npm run compile:example -- area-basic.ts
```

> Notice: if TypeScript errors thrown during this compilation and it is cuased by your local modification of echarts TypeScript interface, you need to change to depends on your local echarts to pass the compilation. For example:
> ```sh
> cd your/echarts-examples
> npm i --force ../your/local/echarts
> ```

Each example file should include the meta info at the top, formatted as a JS comment:
```js
/*
title: Area Pieces
titleCN: 折线图区域高亮
category: 'line, visualMap'
*/
```

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

Check the example in browser:
See "View and edit echarts-examples website" below.


### Some built-in features available in examples

#### Import third-party library

For example:

```js
$.when(
  $.getScript(ROOT_PATH + '/data/asset/js/xxxx.js'),
  $.getScript(
    'https://cdn.jsdelivr.net/npm/d3-contour@2.0.0/dist/d3-contour.js'
  )
).done(function () {
  // ...
});
```

#### Controller panel

Use this code to enable controller panel for a example:

```js
app.config = {
  aNameForTheSelectionWidget: 'This is the initial value'
  aNameForTheRangeWidget: 45,
  aNameForTheButtonWidget: function () {
    // Do something on button click.
  },
  onChange: function () {
    // Do something on SelectionWidget or RangeWidget changed.
    // Read the current value.
    console.log(app.config.aNameForTheRangeWidget)
    console.log(app.config.aNameForTheSelectionWidget)
  }
};
app.configParameters = {
  // The keys below must exist in `app.config`.
  aNameForTheSelectionWidget: {
    options: [
      'This is the initial value',
      'This is another value',
      'This is the third value'
      333,   // value other than string is supported.
      false, // value other than string is supported.
    ]
    // // options can also be:
    // options: {
    ///    // `text`: to display.
    //     // `value`: write to `app.config` when option is switched.
    //     text1: value1,
    //     text2: value2,
    //     text3: 333,   // value other than string is supported.
    //     text3: false, // value other than string is supported.
    // }
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

1. Create a local config file in `echarts-examples/config/config.local.js`, including the content like:
  ```js
  exports.SCRIPT_URLS = {
    // This is your own web server to visit the echarts dist files.
    localEChartsDir: 'http://localhost:8001/echarts',
    localEChartsGLDir: 'http://localhost:8001/echarts-gl',
    // Then the echarts will be fetched by URL
    //  http://localhost:8001/echarts/dist/echarts.js
    // (if `local=1` exists in the entry URL)
  };
  ```
  > Note: The local URL is internally defined in `localEChartsDir` & `localEChartsGLDir` in `src/common/config.js`
2. Add `local=1` to the entry URL.
  - For example: `http://127.0.0.1:3002/en/editor.html?c=line-simple&local=1`

## Run e2e tests.

Run all the examples to test package publishing and install, module importing, minimal bundling and DTS correctness.

Before run the tests. you need to update the examples list.

```shell
npm run build:examplelist
```

If puppeteer has not been installed:

```shell
npm i puppeteer -D
```

If you want to save the log:

```shell
exe_something > 1.log 2>&1
```

### Run e2e test using local dependent repos

If you are testing a new version of echarts or zrender, which are not released in github yet, you need run e2e test with local dependent repos.

1. Make sure the dependent repos listed in `dir` attributes in `echarts-examples/e2e/config.js` existing. (If using `npm run test:e2e:local` or `npm run test:e2e:esbuild:local`, the local repo will be fetched from the `dir` attributes. Otherwise, download the remote repo from the `git` attributes.)
2. Make sure the local repos have release build, typically, `npm run release` has been performed.

3. Start e2e test:
```shell
# Notice: the commands below will execute `npm install` in these local directories.

# run e2e using local dependent repos and webpack.
npm run test:e2e:local > result.log 2>&1
# run e2e using local dependent repos and esbuild, which is much faster.
npm run test:e2e:esbuild:local > result.log 2>&1
```

### Run e2e test using remote dependent repos

```shell
# Notice: the commands below will download the repos listed in `echarts-examples/e2e/config.js` to a temporary folder.

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
