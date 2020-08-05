# Examples of ECharts

[http://ecomfe.github.io/echarts-examples/public/](http://ecomfe.github.io/echarts-examples/public/)

## Install

```shell
npm install
```

## Build

Git clone [echarts-www](https://github.com/ecomfe/echarts-www) and put it on the same level as `echarts-examples`.

```shell
npm run dev
```

## Update example snapshots

```shell
node tool/build-example.js
```

Only for default theme

```shell
node tool/build-example.js -t default
```