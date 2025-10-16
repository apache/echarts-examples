/*
title: Matrix Stock Application
category: matrix-stock
titleCN: 简单的矩阵图
difficulty: 3
since: 6.0.0
*/

const lastClose = 50; // Close value of yesterday
const colorGreen = '#14b143';
const colorRed = '#ef232a';
const colorGray = '#888';

const getPriceColor = (price: number) => {
  return price === lastClose
    ? colorGray
    : price > lastClose
    ? colorRed
    : colorGreen;
};
const priceFormatter = (value: number) => {
  const result = Math.round(value * 100) / 100 + '';
  // Adding padding 0 if needed
  let dotIndex = result.indexOf('.');
  if (dotIndex < 0) {
    return result + '.00';
  } else if (dotIndex === result.length - 2) {
    return result + '0';
  }
  return result;
};

const priceData = [];
const volumeData = [];
const averageData = []; // Average of volume * price
let sumPrice = 0;
let sumVolume = 0;
const sTime = new Date('2025-10-16 09:30:00').getTime();
const eTime = new Date('2025-10-16 15:00:00').getTime();
const breakStartTime = new Date('2025-10-16 11:30:00').getTime();
const breakEndTime = new Date('2025-10-16 13:00:00').getTime();

let time = startTime;
let price = lastClose;
let direction = 1; // 1 for up, -1 for down
let maxAbs = 0;
while (time < eTime) {
  const volume = Math.random() * 1000 + 500;
  volumeData.push([time, volume]);
  sumVolume += volume;

  if (time === startTime) {
    // Today open price
    direction = Math.random() < 0.5 ? 1 : -1;
    price = lastClose * (1 + (Math.random() - 0.5) * 0.02);
  } else {
    // 70% chance to maintain the last direction
    direction = Math.random() < 0.8 ? direction : -direction;
    price = Math.round((price + direction * (Math.random() * 0.1)) * 100) / 100;
  }
  priceData.push([time, price]);

  sumPrice += price * volume;
  averageData.push([time, sumPrice / sumVolume]);

  maxAbs = Math.max(maxAbs, Math.abs(price - lastClose));

  if (time === breakStartTime) {
    time = breakEndTime;
  } else {
    time += 60 * 1000; // increment by 1 minute
  }
}

option = {
  xAxis: [
    {
      type: 'time',
      show: false,
      breaks: [
        {
          start: breakStartTime,
          end: breakEndTime,
          gap: 0
        }
      ]
    }
  ],
  yAxis: [
    {
      type: 'value',
      show: false,
      // Value should be symmetric around zero
      min: lastClose - maxAbs,
      max: lastClose + maxAbs
    }
  ],
  grid: [
    {
      coordinateSystem: 'matrix',
      coord: [0, 0],
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    }
  ],
  series: [
    {
      type: 'line',
      symbolSize: 0,
      data: priceData,
      markPoint: {
        symbolSize: 0,
        symbol: 'circle',
        data: [
          {
            relativeTo: 'coordinate',
            x: 0,
            y: 0,
            name: 'max',
            type: 'max',
            label: {
              align: 'left',
              verticalAlign: 'top',
              formatter: priceFormatter(lastClose + maxAbs),
              color: getPriceColor(lastClose + maxAbs)
            }
          },
          {
            relativeTo: 'coordinate',
            x: 0,
            y: '100%',
            name: 'min',
            type: 'min',
            label: {
              align: 'left',
              verticalAlign: 'bottom',
              formatter: priceFormatter(lastClose - maxAbs),
              color: getPriceColor(lastClose - maxAbs)
            }
          },
          {
            relativeTo: 'coordinate',
            x: '100%',
            y: 0,
            name: priceFormatter((maxAbs / lastClose) * 100) + '%',
            label: {
              align: 'right',
              verticalAlign: 'top',
              color: colorRed,
              formatter: (params) => params.name
            }
          },
          {
            relativeTo: 'coordinate',
            x: '100%',
            y: '100%',
            name: '-' + priceFormatter((maxAbs / lastClose) * 100) + '%',
            label: {
              align: 'right',
              verticalAlign: 'bottom',
              color: colorGreen,
              formatter: (params) => params.name
            }
          }
        ]
      }
    },
    {
      type: 'line',
      symbolSize: 0,
      data: averageData,
      xAxisIndex: 0,
      yAxisIndex: 0
    }
  ],
  matrix: {
    x: { data: Array(5).fill(null) },
    y: { data: Array(6).fill(null) },
    body: {
      data: [
        {
          coord: [
            [0, 3],
            [0, 3]
          ],
          mergeCells: true
        }
      ]
    }
  }
};
