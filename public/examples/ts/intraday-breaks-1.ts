/*
title: Intraday Chart with Breaks
titleCN: 断轴上的日内走势图
category: candlestick, line
difficulty: 4
since: 6.0.0
*/

var roundTime = echarts.time.roundTime;
var formatTime = echarts.time.format;
var BREAK_GAP = '1%';
var DATA_ZOOM_MIN_VALUE_SPAN = 3600 * 1000;

var _data = generateData();

option = {
  // Choose axis ticks based on UTC time.
  useUTC: true,
  title: {
    text: 'Intraday Chart with Breaks',
    left: 'center'
  },
  tooltip: {
    show: true,
    trigger: 'axis'
  },
  grid: {
    top: '25%',
    bottom: '40%'
  },
  xAxis: [
    {
      type: 'time',
      interval: 1000 * 60 * 30, // 30 minutes
      axisLabel: {
        showMinLabel: true,
        showMaxLabel: true,
        formatter(timestamp, _, opt) {
          if (opt.break) {
            // The third parameter is `useUTC: true`.
            return formatTime(timestamp, '{HH}:{mm}\n{weak|{dd}d}', true);
          }
          return formatTime(timestamp, '{HH}:{mm}', true);
        },
        rich: {
          weak: {
            color: '#999'
          }
        }
      },
      breaks: _data.breaks,
      breakArea: {
        expandOnClick: false,
        zigzagAmplitude: 0,
        zigzagZ: 200,
        itemStyle: {
          borderColor: 'none',
          opacity: 0
        }
      }
    }
  ],
  yAxis: {
    type: 'value',
    min: 'dataMin',
  },
  dataZoom: [
    {
      type: 'inside',
      minValueSpan: DATA_ZOOM_MIN_VALUE_SPAN
    },
    {
      type: 'slider',
      bottom: '30%',
      minValueSpan: DATA_ZOOM_MIN_VALUE_SPAN
    }
  ],
  series: [
    {
      type: 'line',
      symbolSize: 0,
      areaStyle: {},
      data: _data.seriesData
    }
  ]
};
/**
 * Generate random data, not relevant to echarts API.
 */
function generateData() {
  var seriesData = [];
  var breaks = [];

  var time = new Date('2024-04-09T00:00:00Z');
  var endTime = new Date('2024-04-12T23:59:59Z').getTime();
  var todayCloseTime = new Date();

  updateDayTime(time, todayCloseTime);

  function updateDayTime(time: Date, todayCloseTime: Date): void {
    roundTime(time, 'day', true);
    todayCloseTime.setTime(time.getTime());
    time.setUTCHours(9, 30); // Open time
    todayCloseTime.setUTCHours(16, 0); // Close time
  }

  var valBreak = false;
  for (var val = 1669; time.getTime() <= endTime; ) {
    var delta;
    if (valBreak) {
      delta =
        Math.floor((Math.random() - 0.5 * Math.sin(val / 1000)) * 20 * 100) /
        10;
      valBreak = false;
    } else {
      delta =
        Math.floor((Math.random() - 0.5 * Math.sin(val / 1000)) * 20 * 100) /
        100;
    }
    val = val + delta;
    val = +val.toFixed(2);
    seriesData.push([time.getTime(), val]);

    time.setMinutes(time.getMinutes() + 1);

    if (time.getTime() > todayCloseTime.getTime()) {

      // Use `NaN` to break the line.
      seriesData.push([time.getTime(), NaN]);

      var breakStart = todayCloseTime.getTime();
      time.setUTCDate(time.getUTCDate() + 1);
      updateDayTime(time, todayCloseTime);
      var breakEnd = time.getTime();

      valBreak = true;

      breaks.push({
        start: breakStart,
        end: breakEnd,
        gap: BREAK_GAP
      });
    }
  }
  return {
    seriesData: seriesData,
    breaks: breaks
  };
}
