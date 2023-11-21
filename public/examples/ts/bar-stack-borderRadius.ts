/*
title: Stacked Bar with borderRadius
category: bar
titleCN: 带圆角的堆积柱状图
difficulty: 3
*/

var series = [
{
    data: [120, 200, 150, 80, 70, 110, 130],
    type: 'bar',
    stack: 'a',
    name: 'a'
},
{
    data: [10, 46, 64, '-', 0, '-', 0],
    type: 'bar',
    stack: 'a',
    name: 'b'
},
{
    data: [30, '-', 0, 20, 10, '-', 0],
    type: 'bar',
    stack: 'a',
    name: 'c'
},
{
    data: [30, '-', 0, 20, 10, '-', 0],
    type: 'bar',
    stack: 'b',
    name: 'd'
},
{
    data: [10, 20, 150, 0, '-', 50, 10],
    type: 'bar',
    stack: 'b',
    name: 'e'
}
];

const stackInfo: {[key: string]: {stackStart: number[], stackEnd: number[]}} = {};
for (let i = 0; i < series[0].data.length; ++i) {
    for (let j = 0; j < series.length; ++j) {
        const stackName = series[j].stack;
        if (!stackName) {
        continue;
        }
        if (!stackInfo[stackName]) {
        stackInfo[stackName] = {
            stackStart: [],
            stackEnd: []
        };
        }
        const info = stackInfo[stackName];
        const data = series[j].data[i];
        if (data && data !== '-') {
        if (info.stackStart[i] == null) {
            info.stackStart[i] = j;
        }
        info.stackEnd[i] = j;
        }
    }
}
for (let i = 0; i < series.length; ++i) {
const data = series[i].data as number[] | {value: number, itemStyle: object}[];
const info = stackInfo[series[i].stack];
for (let j = 0; j < series[i].data.length; ++j) {
    // const isStart = info.stackStart[j] === i;
    const isEnd = info.stackEnd[j] === i;
    const topBorder = isEnd ? 20 : 0;
    const bottomBorder = 0;
    data[j] = {
        value: data[j] as number,
        itemStyle: {
            borderRadius: [topBorder, topBorder, bottomBorder, bottomBorder]
        }
    };
}
}

option = {
    xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
        type: 'value'
    },
    series: series as any
};

export {};
