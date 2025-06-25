/*
title: Correlation Matrix (Heatmap)
category: matrix
titleCN: 相关矩阵（热力图）
difficulty: 2
*/

const xCnt = 8;
const yCnt = xCnt;
const xData = [];
const yData = [];
for (let i = 0; i < xCnt; ++i) {
  xData.push({
    value: 'X' + (i + 1)
  });
}

for (let i = 0; i < yCnt; ++i) {
  yData.push({
    value: 'Y' + (i + 1)
  });
}

const data = [];
for (let i = 1; i <= xCnt; ++i) {
  for (let j = 1; j <= yCnt; ++j) {
    if (i >= j) {
      data.push([
        'X' + i,
        'Y' + j,
        i === j ? 1 : Math.random() * 2 - 1
      ]);
    }
  }
}

option = {
  matrix: {
    x: {
      data: xData
    },
    y: {
      data: yData
    },
    top: 80
  },
  visualMap: {
    type: 'continuous',
    min: -1,
    max: 1,
    dimension: 2,
    calculable: true,
    orient: 'horizontal',
    top: 5,
    left: 'center'
  },
  series: {
    type: 'heatmap',
    coordinateSystem: 'matrix',
    data,
    label: {
      show: true,
      formatter: params => params.value[2].toFixed(2)
    }
  }
};
