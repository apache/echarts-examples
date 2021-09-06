const nodePath = require('path');

module.exports = {
  packages: [
    // Handwritten topological sort by the rule of dependency.
    {
      name: 'zrender', // package name
      dir: nodePath.resolve(__dirname, '../../zrender'),
      git: 'ecomfe/zrender#release'
    },
    {
      name: 'echarts',
      dir: nodePath.resolve(__dirname, '../../echarts'),
      git: 'apache/echarts#release'
    },
    {
      name: 'echarts-gl',
      dir: nodePath.resolve(__dirname, '../../echarts-gl'),
      git: 'ecomfe/echarts-gl#master'
    },
    {
      name: 'echarts-wordcloud',
      dir: nodePath.resolve(__dirname, '../../echarts-wordcloud'),
      git: 'ecomfe/echarts-wordcloud#master'
    },
    {
      name: 'echarts-liquidfill',
      dir: nodePath.resolve(__dirname, '../../echarts-liquidfill'),
      git: 'ecomfe/echarts-liquidfill#master'
    }
  ]
};
