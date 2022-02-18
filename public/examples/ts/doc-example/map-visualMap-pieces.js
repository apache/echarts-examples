myChart.showLoading();
$.get(ROOT_PATH + '/data/asset/geo/USA.json', function (usaJson) {
  echarts.registerMap('USA', usaJson, {
    Alaska: {
      left: -131,
      top: 25,
      width: 15
    },
    Hawaii: {
      left: -110,
      top: 28,
      width: 5
    },
    'Puerto Rico': {
      left: -76,
      top: 26,
      width: 2
    }
  });
  myChart.hideLoading();

  const data = echarts.util.map(usaJson.features, function (feature) {
    return {
      name: feature.properties.name,
      value: Math.round(Math.random() * Math.random() * 1500)
    };
  });

  option = {
    title: {
      text: 'Order',
      subtext: 'Fake Data',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    visualMap: {
      type: 'piecewise',
      pieces: [
        { min: 1500 },
        { min: 900, max: 1500 },
        { min: 310, max: 1000 },
        {
          min: 200,
          max: 300,
          label: '200 - 300 (Custom Color)',
          color: 'lightgreen'
        },
        { min: 10, max: 200, label: '10 to 200 (Custom Label)' }
      ],
      outOfRange: {
        color: '#eee'
      }
    },
    series: [
      {
        name: 'Order',
        type: 'map',
        map: 'USA',
        roam: true,
        label: {
          show: true,
          color: 'inherit'
        },
        labelLayout(params) {
          return {
            hideOverlap: true,
            fontSize: Math.max(params.rect.width / 10, 8)
          };
        },
        data: data
      }
    ]
  };

  myChart.setOption(option);
});
