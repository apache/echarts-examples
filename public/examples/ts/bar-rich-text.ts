/*
title: Wheater Statistics
category: 'bar, rich'
titleCN: 天气统计（富文本）
difficulty: 6
*/

const weatherIcons = {
  Sunny: ROOT_PATH + '/data/asset/img/weather/sunny_128.png',
  Cloudy: ROOT_PATH + '/data/asset/img/weather/cloudy_128.png',
  Showers: ROOT_PATH + '/data/asset/img/weather/showers_128.png'
} as const;

const seriesLabel = {
  show: true
} as const;

option = {
  title: {
    text: 'Weather Statistics'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  legend: {
    data: ['City Alpha', 'City Beta', 'City Gamma']
  },
  grid: {
    left: 100
  },
  toolbox: {
    show: true,
    feature: {
      saveAsImage: {}
    }
  },
  xAxis: {
    type: 'value',
    name: 'Days',
    axisLabel: {
      formatter: '{value}'
    }
  },
  yAxis: {
    type: 'category',
    inverse: true,
    data: ['Sunny', 'Cloudy', 'Showers'],
    axisLabel: {
      formatter: function (value: string) {
        return '{' + value + '| }\n{value|' + value + '}';
      },
      margin: 20,
      rich: {
        value: {
          lineHeight: 30,
          align: 'center'
        },
        Sunny: {
          height: 40,
          align: 'center',
          backgroundColor: {
            image: weatherIcons.Sunny
          }
        },
        Cloudy: {
          height: 40,
          align: 'center',
          backgroundColor: {
            image: weatherIcons.Cloudy
          }
        },
        Showers: {
          height: 40,
          align: 'center',
          backgroundColor: {
            image: weatherIcons.Showers
          }
        }
      }
    }
  },
  series: [
    {
      name: 'City Alpha',
      type: 'bar',
      data: [165, 170, 30],
      label: seriesLabel,
      markPoint: {
        symbolSize: 1,
        symbolOffset: [0, '50%'],
        label: {
          formatter: '{a|{a}\n}{b|{b} }{c|{c}}',
          backgroundColor: 'rgb(242,242,242)',
          borderColor: '#aaa',
          borderWidth: 1,
          borderRadius: 4,
          padding: [4, 10],
          lineHeight: 26,
          // shadowBlur: 5,
          // shadowColor: '#000',
          // shadowOffsetX: 0,
          // shadowOffsetY: 1,
          position: 'right',
          distance: 20,
          rich: {
            a: {
              align: 'center',
              color: '#fff',
              fontSize: 18,
              textShadowBlur: 2,
              textShadowColor: '#000',
              textShadowOffsetX: 0,
              textShadowOffsetY: 1,
              textBorderColor: '#333',
              textBorderWidth: 2
            },
            b: {
              color: '#333'
            },
            c: {
              color: '#ff8811',
              textBorderColor: '#000',
              textBorderWidth: 1,
              fontSize: 22
            }
          }
        },
        data: [
          { type: 'max', name: 'max days: ' },
          { type: 'min', name: 'min days: ' }
        ]
      }
    },
    {
      name: 'City Beta',
      type: 'bar',
      label: seriesLabel,
      data: [150, 105, 110]
    },
    {
      name: 'City Gamma',
      type: 'bar',
      label: seriesLabel,
      data: [220, 82, 63]
    }
  ]
};

export {};
