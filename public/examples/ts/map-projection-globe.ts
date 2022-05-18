/*
title: Map with Orthographic Projection
category: map
titleCN: 正交投影地图
*/

myChart.showLoading();

let projection: any;

$.when(
  $.get(ROOT_PATH + '/data/asset/geo/world.json'),
  $.getScript('https://fastly.jsdelivr.net/npm/d3-array'),
  $.getScript('https://fastly.jsdelivr.net/npm/d3-geo')
).done(function (res) {
  myChart.hideLoading();
  // Add graticule
  const graticuleLineStrings = [];
  for (let lat = -80; lat <= 80; lat += 10) {
    graticuleLineStrings.push(createLineString([-180, lat], [180, lat]));
  }
  for (let lng = -180; lng <= 180; lng += 10) {
    graticuleLineStrings.push(createLineString([lng, -80], [lng, 80]));
  }

  res[0].features.unshift({
    geometry: {
      type: 'MultiLineString',
      coordinates: graticuleLineStrings
    },
    properties: {
      name: 'graticule'
    }
  });

  echarts.registerMap('world', res[0]);

  projection = d3.geoOrthographic();

  option = {
    geo: {
      map: 'world',

      projection: {
        project: (pt) => projection(pt),
        unproject: (pt) => projection.invert(pt),
        stream: projection.stream
      },

      itemStyle: {
        borderColor: '#333',
        borderWidth: 1,
        borderJoin: 'round',
        color: '#000'
      },

      emphasis: {
        label: {
          show: false
        },

        itemStyle: {
          color: 'skyblue'
        }
      },

      regions: [
        {
          name: 'graticule',
          itemStyle: {
            borderColor: '#bbb'
          },
          emphasis: {
            disabled: true
          }
        }
      ]
    }
  };

  myChart.setOption(option);
});

app.config = {
  rotateX: 0,
  rotateY: 0,

  onChange() {
    projection && projection.rotate([app.config.rotateX, app.config.rotateY]);
    myChart.setOption({
      geo: {}
    });
  }
};

app.configParameters = {
  rotateX: {
    min: -180,
    max: 180
  },
  rotateY: {
    min: -80,
    max: 80
  }
};

function createLineString(start: number[], end: number[]) {
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  const segs = 50;
  const stepX = dx / segs;
  const stepY = dy / segs;
  const points = [];
  // TODO needs adaptive sampling on the -180 / 180 of azimuthal projections.
  for (let i = 0; i <= segs; i++) {
    points.push([start[0] + i * stepX, start[1] + i * stepY]);
  }
  return points;
}
