/*
title: Geo simple case
category: map
titleCN: 地理坐标系简单示例
*/

function createChart() {
  var icelandRoughLatitude = 65;
  option = {
    geo: {
      map: 'iceland',
      roam: true,
      aspectScale: Math.cos(icelandRoughLatitude * Math.PI / 180),
      // nameProperty: 'name_en', // If using en name.
      label: {
        show: true,
      }
    },
    tooltip: {},
    legend: {},
  };
  myChart.setOption(option);
}

function fetchGeoJSON() {
  myChart.showLoading();
  $.get(ROOT_PATH + '/data/asset/geo/iceland.geo.json', function (geoJSON) {
    echarts.registerMap('iceland', geoJSON);
    createChart();
    myChart.hideLoading();
  });
}

fetchGeoJSON();

// --- Extra control button panel ---
app.config = {
  nameProperty: 'name',
  onChange: function () {
    myChart.setOption({
      geo: {
        nameProperty: app.config.nameProperty,
      }
    });
  }
};
app.configParameters = {
  // The keys below must exist in `app.config`.
  nameProperty: {
    options: [
      'name',
      'name_en'
    ]
  },
};

export {};
