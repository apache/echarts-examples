/*
title: Customized Pie
category: pie
titleCN: 饼图自定义样式
difficulty: 2
*/

option = {
    title: {
        text: '喜欢的电影类型',
        left: 'center',
        top: 20,
        textStyle: {
            fontSize: 24
        }

    },
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
    },

    visualMap: {
        show: false,
        min: 80,
        max: 600,
        inRange: {
            colorLightness: [0, 1]
        }
    },
    series: [
        {
            type: 'pie',
            radius: '55%',
            center: ['50%', '50%'],
            data: [
                {value: 460, name: '浪漫'},
                {value: 380, name: '动作'},
                {value: 324, name: '文艺'},
                {value: 265, name: '喜剧'},
                {value: 230, name: '其他'}
            ].sort(function (a, b) {
                return a.value - b.value;
            }),
            roseType: 'radius',
            label: {
                fontSize: 14
            },
            labelLine: {
                smooth: 0.2,
                length: 20,
                length2: 100
            },
            itemStyle: {
                color: '#c23531',
                shadowBlur: 20,
                shadowColor: 'rgba(91, 12, 10, 0.5)'
            },
            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function (idx) {
                return Math.random() * 200;
            }
        }
    ]
};