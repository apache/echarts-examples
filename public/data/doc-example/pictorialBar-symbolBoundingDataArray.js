// Thanks [anoosurf](https://github.com/anoosurf) ~.
var starPath = 'path://m15.5,19c-0.082,0 -0.164,-0.02 -0.239,-0.061l-5.261,-2.869l-5.261,2.869c-0.168,0.092 -0.373,0.079 -0.529,-0.032s-0.235,-0.301 -0.203,-0.49l0.958,-5.746l-3.818,-3.818c-0.132,-0.132 -0.18,-0.328 -0.123,-0.506s0.209,-0.31 0.394,-0.341l5.749,-0.958l2.386,-4.772c0.085,-0.169 0.258,-0.276 0.447,-0.276s0.363,0.107 0.447,0.276l2.386,4.772l5.749,0.958c0.185,0.031 0.337,0.162 0.394,0.341s0.01,0.374 -0.123,0.506l-3.818,3.818l0.958,5.746c0.031,0.189 -0.048,0.379 -0.203,0.49c-0.086,0.061 -0.188,0.093 -0.29,0.093z';

var categoryData = ['DTA', 'Fin', 'Tool', 'VTG', 'CAAT', 'UYL', 'TC'];
var data = [-12, -60, 34, 23, -21, 0, -25];

option = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    grid: {
        left: 120
    },
    xAxis: {
        splitLine: {show: false},
        axisLine: {show: false},
        axisTick: {show: false},
        axisLabel: {show: false}
    },
    yAxis: {
        data: categoryData,
        axisTick: {show: false},
        axisLine: {
            lineStyle: {color: '#ccc'}
        },
        axisLabel: {
            margin: 40,
            textStyle: {
                color: '#999',
                fontSize: 16
            }
        },
        splitLine: {show: true},
        position: 'top'
    },
    series: [{
        name: 'bg',
        type: 'pictorialBar',
        symbol: starPath,
        tooltip: {trigger: 'none'},
        itemStyle: {
            normal: {
                color: '#ddd'
            }
        },
        silent: true,
        symbolRepeat: 'fixed',
        symbolClip: false,
        symbolBoundingData: 40,
        symbolSize: ['80%', '80%'],
        z: -1,
        data: data
    }, {
        name: 'bg',
        type: 'pictorialBar',
        symbol: starPath,
        tooltip: {trigger: 'none'},
        itemStyle: {
            normal: {
                color: '#ddd'
            }
        },
        silent: true,
        symbolRepeat: 'fixed',
        symbolClip: false,
        symbolBoundingData: -60,
        symbolSize: ['80%', '80%'],
        z: -1,
        data: data
    }, {
        name: 'data',
        type: 'pictorialBar',
        symbol: starPath,
        symbolRepeat: true,
        symbolClip: true,
        symbolSize: ['80%', '80%'],
        symbolBoundingData: [-60, 40],
        data: data
    }]
};