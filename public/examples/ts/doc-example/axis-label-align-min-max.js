const data = [];
for (let i = 0; i < 200; ++i) {
  data.push([i, Math.floor(Math.random() * 100)]);
}

option = {
  xAxis: {
    axisLabel: {
      formatter: 'label of {value}',
      showMinLabel: true,
      showMaxLabel: true,
      alignMinLabel: 'left',
      alignMaxLabel: 'right'
    }
  },
  yAxis: {},
  series: {
    type: 'line',
    data
  },
  dataZoom: {
    type: 'slider',
    start: 20,
    end: 42
  }
};
