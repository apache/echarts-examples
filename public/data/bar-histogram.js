var girth = [8.3, 8.6, 8.8, 10.5, 10.7, 10.8, 11.0, 11.0, 11.1, 11.2, 11.3, 11.4, 11.4, 11.7, 12.0, 12.9, 12.9, 13.3, 13.7, 13.8, 14.0, 14.2, 14.5, 16.0, 16.3, 17.3, 17.5, 17.9, 18.0, 18.0, 20.6];

// See https://github.com/ecomfe/echarts-stat
var bins = ecStat.histogram(girth);

option = {
    title: {
        text: 'Girths of Black Cherry Trees',
        subtext: 'By ecStat.histogram',
        sublink: 'https://github.com/ecomfe/echarts-stat',
        left: 'center',
        top: 10
    },
    color: ['rgb(25, 183, 207)'],
    grid: {
        left: '3%',
        right: '3%',
        bottom: '3%',
        top: 80,
        containLabel: true
    },
    xAxis: [{
        type: 'value',
        scale: true, //这个一定要设，不然barWidth和bins对应不上
    }],
    yAxis: [{
        type: 'value',
    }],
    series: [{
        name: 'height',
        type: 'bar',
        barWidth: '99.3%',
        label: {
            normal: {
                show: true,
                position: 'insideTop',
                formatter: function(params) {
                    return params.value[1];
                }
            }
        },
        data: bins.data
    }]
};