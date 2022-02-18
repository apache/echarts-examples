/*
title: Flight Seatmap with SVG
category: map
titleCN: 航班选座（SVG）
*/

$.get(ROOT_PATH + '/data/asset/geo/flight-seats.svg', function (svg) {
  echarts.registerMap('flight-seats', { svg: svg });

  const takenSeatNames = ['26E', '26D', '26C', '25D', '23C', '21A', '20F'];

  option = {
    tooltip: {},
    geo: {
      map: 'flight-seats',
      roam: true,
      selectedMode: 'multiple',
      layoutCenter: ['50%', '50%'],
      layoutSize: '95%',
      tooltip: {
        show: true
      },
      itemStyle: {
        color: '#fff'
      },
      emphasis: {
        itemStyle: {
          color: undefined,
          borderColor: 'green',
          borderWidth: 2
        },
        label: {
          show: false
        }
      },
      select: {
        itemStyle: {
          color: 'green'
        },
        label: {
          show: false,
          textBorderColor: '#fff',
          textBorderWidth: 2
        }
      },
      regions: makeTakenRegions(takenSeatNames)
    }
  };

  function makeTakenRegions(takenSeatNames: string[]) {
    var regions = [];
    for (var i = 0; i < takenSeatNames.length; i++) {
      regions.push({
        name: takenSeatNames[i],
        silent: true,
        itemStyle: {
          color: '#bf0e08'
        },
        emphasis: {
          itemStyle: {
            borderColor: '#aaa',
            borderWidth: 1
          }
        },
        select: {
          itemStyle: {
            color: '#bf0e08'
          }
        }
      });
    }
    return regions;
  }

  myChart.setOption(option);

  // Get selected seats.
  myChart.on('geoselectchanged', function (params: any) {
    const selectedNames: string[] = params.allSelected[0].name.slice();

    // Remove taken seats.
    for (var i = selectedNames.length - 1; i >= 0; i--) {
      if (takenSeatNames.indexOf(selectedNames[i]) >= 0) {
        selectedNames.splice(i, 1);
      }
    }

    console.log('selected', selectedNames);
  });
});

export {};
