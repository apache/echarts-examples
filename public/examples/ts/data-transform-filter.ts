/*
title: Data Transform Filter
category: line
titleCN: 数据过滤
difficulty: 3
*/

$.get(
  ROOT_PATH + '/data/asset/data/life-expectancy-table.json',
  function (_rawData) {
    run(_rawData);
  }
);

function run(_rawData: any) {
  option = {
    dataset: [
      {
        id: 'dataset_raw',
        source: _rawData
      },
      {
        id: 'dataset_since_1950_of_germany',
        fromDatasetId: 'dataset_raw',
        transform: {
          type: 'filter',
          config: {
            and: [
              { dimension: 'Year', gte: 1950 },
              { dimension: 'Country', '=': 'Germany' }
            ]
          }
        }
      },
      {
        id: 'dataset_since_1950_of_france',
        fromDatasetId: 'dataset_raw',
        transform: {
          type: 'filter',
          config: {
            and: [
              { dimension: 'Year', gte: 1950 },
              { dimension: 'Country', '=': 'France' }
            ]
          }
        }
      }
    ],
    title: {
      text: 'Income of Germany and France since 1950'
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      nameLocation: 'middle'
    },
    yAxis: {
      name: 'Income'
    },
    series: [
      {
        type: 'line',
        datasetId: 'dataset_since_1950_of_germany',
        showSymbol: false,
        encode: {
          x: 'Year',
          y: 'Income',
          itemName: 'Year',
          tooltip: ['Income']
        }
      },
      {
        type: 'line',
        datasetId: 'dataset_since_1950_of_france',
        showSymbol: false,
        encode: {
          x: 'Year',
          y: 'Income',
          itemName: 'Year',
          tooltip: ['Income']
        }
      }
    ]
  };

  myChart.setOption<echarts.EChartsOption>(option);
}

export {};
