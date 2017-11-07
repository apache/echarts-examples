var axisLine = {
    lineStyle: {
        color: '#888'
    }
};

var themeColor = '#B03A5B';

option = {
    color: ['transparent', themeColor],
    legend: {
        data: [{
            name: 'Canvas',
            icon: 'path://M0,0 L58,0 L58,38 L0,38 L0,0 Z M6,6 L6,32 L53,32 L53,6 L6,6 Z'
        }, {
            name: 'SVG',
            icon: 'rect'
        }],
        top: 25
    },
    title: [{
        text: 'ECharts Canvas vs SVG 渲染性能',
        left: 'center'
    }, {
        subtext: 'PC端',
        subtextStyle: {
            color: '#666',
            fontSize: 15
        },
        left: '21%',
        top: 50
    }, {
        subtext: '移动端',
        subtextStyle: {
            color: '#666',
            fontSize: 15
        },
        left: '73%',
        top: 50
    }],
    xAxis: [{
        data: ['折线图\n1000数据点', '柱状图\n1000数据点', '饼图\n100系列'],
        axisLine: axisLine
    }, {
        data: ['折线图\n100数据点', '柱状图\n100数据点', '饼图\n10系列'],
        gridIndex: 1,
        axisLine: axisLine
    }],
    yAxis: [{
        name: 'FPS',
        axisLine: axisLine
    }, {
        gridIndex: 1,
        name: 'FPS',
        axisLine: axisLine
    }],
    grid: [{
        xAxisIndex: 0,
        yAxisIndex: 0,
        right: '55%',
        left: 30,
        bottom: 40,
        top: 100
    }, {
        left: '55%',
        right: 10,
        bottom: 40,
        top: 100
    }],
    series: [{
        name: 'Canvas',
        type: 'scatter',
        data: [],
        itemStyle: {
            normal: {
                color: themeColor
            }
        }
    }, {
        name: 'Canvas',
        type: 'bar',
        data: [30, 58, 19],
        itemStyle: {
            normal: {
                borderWidth: 2,
                borderColor: themeColor
            }
        },
        barGap: '30%',
        barCategoryGap: '40%'
    }, {
        name: 'SVG',
        type: 'bar',
        data: [60, 32, 38]
    }, {
        name: 'Canvas',
        type: 'bar',
        data: [5, 5, 5],
        xAxisIndex: 1,
        yAxisIndex: 1,
        itemStyle: {
            normal: {
                borderWidth: 2,
                borderColor: themeColor
            }
        },
        barGap: '30%',
        barCategoryGap: '40%'
    }, {
        name: 'SVG',
        type: 'bar',
        data: [17, 11, 9],
        xAxisIndex: 1,
        yAxisIndex: 1,
    }]
};
