/*
title: Mini Bars and Geo in Matrix
category: matrix, bar, geo
titleCN: 矩阵坐标系下的微型条形图和地图
difficulty: 6
since: 6.0.0
*/

var _colHeaders = ['Region and Time', 'Data A', 'Data B', 'Location'];
var _regionColIdx = 0;
var _geoColIdx = 3;
type DataSourceList = {name: string; data: (number | string)[][];}[];
var _dataSourceList: DataSourceList = [
  {
    name: '2021',
    data: [
      // 'Region', 'Data A', 'Data B'
      ['Valais', 1212, 2321],
      ['Ticino', 7181, 2114],
      ['Graubünden', 2763, 4212],
      ['Uri', 6122, 2942],
      ['Lucerne', 4221, 3411],
      ['Neuchâtel', 7221, 5121],
      ['Jura', 5121, 4121],
      ['Vaud', 6121, 3121],
      ['Thurgau', 7121, 2121],
      ['Schwyz', 8121, 1121],
    ]
  },
  {
    name: '2020',
    data: [
      // 'Region', 'Data A', 'Data B'
      ['Valais', 1010, 2221],
      ['Ticino', 7040, 1810],
      ['Graubünden', 2313, 4011],
      ['Uri', 6011, 2749],
      ['Lucerne', 3329, 3015],
      ['Neuchâtel', 7116, 4822],
      ['Jura', 4968, 3820],
      ['Vaud', 6027, 2928],
      ['Thurgau', 7011, 1725],
      ['Schwyz', 7311, 825],
    ]
  }
];

var _colorList = [
    '#ffd10a',
    '#0ca8df',
    '#b6d634',
    '#3fbe95',
    '#5070dd',
    '#ff994d',
    '#505372',
    '#fb628b',
    '#785db0',
];

function createChart() {
  option = {
    matrix: {
      x: {
        levelSize: 40,
        data: _colHeaders.map(function (item, colIdx) {
          return {
            value: item,
            size: colIdx === _geoColIdx ? '15%'
              : colIdx === _regionColIdx ? 120
              : undefined
          };
        }),
        itemStyle: {color: '#f0f8ff'},
        label: { fontWeight: 'bold' }
      },
      y: {
        data: _dataSourceList[0].data.map(function () {
          return '_'; // Any value is fine here, as we will not use it.
        }),
        show: false,
      },
      body: {
        data: []
      },
      top: 25
    },
    legend: {},
    tooltip: {},
    grid: [],
    xAxis: [],
    yAxis: [],
    geo: [],
    series: []
  };

  // Assume every dataSourceList[i] has the same length; just for simplicity in this demo.
  var rowCount = _dataSourceList[0].data.length;

  for (var dataColIdx = 0; dataColIdx < _colHeaders.length; ++dataColIdx) {
    var dataExtentOnCol = (dataColIdx === _regionColIdx || dataColIdx === _geoColIdx)
      ? null
      : calculateDataExtentOnCol(_dataSourceList, dataColIdx);
    for (var dataRowIdx = 0; dataRowIdx < rowCount; ++dataRowIdx) {
      if (dataColIdx === _regionColIdx) {
        addCellPlainText(
          option, _dataSourceList, dataColIdx, dataRowIdx
        );
      }
      else if (dataColIdx === _geoColIdx) {
        addCellMiniGeo(
          option, _dataSourceList, dataColIdx, dataRowIdx
        );
      }
      else {
        addCellMiniBar(
          option, _dataSourceList, dataColIdx, dataRowIdx, dataExtentOnCol
        );
      }
    }
  }

  myChart.setOption(option);
}

function calculateDataExtentOnCol(dataSourceList: DataSourceList, colIdx: number): number[] {
  var min = Infinity;
  var max = -Infinity;
  dataSourceList.forEach(dataSource => {
    dataSource.data.forEach(dataRow => {
      var val = dataRow[colIdx] as number;
      if (val < min) { min = val; }
      if (val > max) { max = val; }
    });
  });
  return [min, max];
}

function addCellPlainText(
  option: echarts.EChartsOption,
  dataSourceList: DataSourceList,
  dataColIdx: number,
  dataRowIdx: number,
) {
  // Assume every dataSourceList[i] has the same region names; just for simplicity in this demo.
  var dataSource = dataSourceList[0];
  (option.matrix as echarts.MatrixComponentOption)!.body!.data!.push({
    value: dataSource.data[dataRowIdx][dataColIdx] as string,
    coord: [dataColIdx, dataRowIdx], // coord in matrix, happens to be the same as `dataColIdx` here.
  });
}

function addCellMiniBar(
  option: echarts.EChartsOption,
  dataSourceList: DataSourceList,
  dataColIdx: number,
  dataRowIdx: number,
  dataExtentOnCol: number[] | null | undefined
) {
  var id = 'mini-bar-' + dataColIdx + '-' + dataRowIdx;
  (option.grid as echarts.GridComponentOption[])!.push({
    id: id,
    coordinateSystem: 'matrix',
    coord: [dataColIdx, dataRowIdx], // coord in matrix, happens to be the same as `dataColIdx` here.
    top: '15%',
    bottom: '15%',
  });
  (option.xAxis as echarts.XAXisComponentOption[])!.push({
    id: id,
    gridId: id,
    type: 'value',
    min: 0,
    max: dataExtentOnCol ? dataExtentOnCol[1] : undefined,
    scale: false,
    axisLine: {show: false},
    axisTick: {show: false},
    splitLine: {show: false},
    axisLabel: {show: false}
  });
  (option.yAxis as echarts.YAXisComponentOption[])!.push({
    id: id,
    gridId: id,
    type: 'category',
    boundaryGap: false,
    inverse: true,
    axisLine: {show: false},
    axisTick: {show: false},
    splitLine: {show: false},
    axisLabel: {show: false}
  });
  dataSourceList.forEach((dataSource, dataSourceIdx) => {
    (option.series as echarts.BarSeriesOption[])!.push({
      type: 'bar',
      // `name` will be collected to legend.
      name: dataSource.name,
      xAxisId: id,
      yAxisId: id,
      label: {show: true, position: 'insideLeft'},
      barMinHeight: 2,
      barGap: '40%',
      barWidth: '40%',
      itemStyle: {
        color: _colorList[dataSourceIdx % _colorList.length]
      },
      encode: {label: 0},
      // Make sure 2021 and 2020 have the same Y value (we use '' here) for better bar series layout.
      data: [[dataSource.data[dataRowIdx][dataColIdx], '']]
    });
  });

  return option;
}

function addCellMiniGeo(
  option: echarts.EChartsOption,
  dataSourceList: DataSourceList,
  dataColIdx: number,
  dataRowIdx: number
) {
  var id = 'mini-geo-' + dataRowIdx;
  var regionName = dataSourceList[0].data[dataRowIdx][_regionColIdx] as string;

  (option.geo as echarts.GeoComponentOption[])!.push({
    id: id,
    map: 'target_map',
    animation: false,
    aspectScale: Math.cos(47 * Math.PI / 180), // 47 is Switzerland's approximate latitude.
    coordinateSystem: 'matrix',
    coord: [dataColIdx, dataRowIdx], // coord in matrix, happens to be the same as `dataColIdx` here.
    roam: false,
    selectedMode: false,
    tooltip: {show: false},
    regions: [{
      name: regionName,
      selected: true,
      select: {
        itemStyle: {color: '#0a41e6'}
      }
    }],
    select: {
      label: {show: false},
    },
  });
}

function fetchGeoJSON() {
  myChart.showLoading();
  $.get(ROOT_PATH + '/data/asset/geo/ch.geo.json', function (geoJSON) {
    echarts.registerMap('target_map', geoJSON);
    createChart();
    myChart.hideLoading();
  });
}

fetchGeoJSON();

export {};
