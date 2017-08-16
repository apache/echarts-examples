
var weatherIcons = {
    up: './data/asset/img/arrow-up.png',
    down: './data/asset/img/arrow-down.png'
};

option = {
    title: {
        text: '降水量',
        subtext: '纯属虚构',
        left: 'center'
    },
    tooltip: {
        trigger: 'item'
    },
    visualMap: {
        min: 0,
        max: 1000,
        left: 'left',
        top: 'bottom',
        text: ['高','低'],
        calculable: true
    },
    toolbox: {
        show: true,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        feature: {
            dataView: {readOnly: false},
            saveAsImage: {}
        }
    },
    animation: true,
    animationDurationUpdate: 1000,
    animationEasingUpdate: 'cubicInOut',
    series: [
        {
            name: 'a',
            type: 'map',
            mapType: 'china',
            roam: true,
            label: {
                normal: {
                    show: true,
                    formatter: function (params) {
                        var icon = params.data.value[1] ? 'up' : 'down';
                        var valueType = params.data.value[1] ? 'valueUp' : 'valueDown';
                        return params.name
                            + '：{' + valueType + '|' + params.value + '} {' + icon + '|}';
                    },
                    position: 'inside',
                    backgroundColor: '#fff',
                    padding: [4, 5],
                    borderRadius: 3,
                    borderWidth: 1,
                    borderColor: 'rgba(0,0,0,0.5)',
                    color: '#777',
                    rich: {
                        valueUp: {
                            color: '#019D2D',
                            fontSize: 14
                        },
                        valueDown: {
                            color: 'red',
                            fontSize: 14
                        },
                        up: {
                            height: 14,
                            align: 'center',
                            backgroundColor: {
                                image: weatherIcons.up
                            }
                        },
                        down: {
                            height: 14,
                            align: 'center',
                            backgroundColor: {
                                image: weatherIcons.down
                            }
                        }
                    }
                },
                emphasis: {
                    show: true
                }
            },
            data: [
                {name: '北京',value: randomData() },
                {name: '天津',value: randomData() },
                {name: '上海',value: randomData() },
                {name: '重庆',value: randomData() },
                {name: '河北',value: randomData() },
                {name: '河南',value: randomData() },
                {name: '云南',value: randomData() },
                {name: '辽宁',value: randomData() },
                {name: '黑龙江',value: randomData() },
                {name: '湖南',value: randomData() },
                {name: '安徽',value: randomData() },
                {name: '山东',value: randomData() },
                {name: '新疆',value: randomData() },
                {name: '江苏',value: randomData() },
                {name: '浙江',value: randomData() },
                {name: '江西',value: randomData() },
                {name: '湖北',value: randomData() },
                {name: '广西',value: randomData() },
                {name: '甘肃',value: randomData() },
                {name: '山西',value: randomData() },
                {name: '内蒙古',value: randomData() },
                {name: '陕西',value: randomData() },
                {name: '吉林',value: randomData() },
                {name: '福建',value: randomData() },
                {name: '贵州',value: randomData() },
                {name: '广东',value: randomData() },
                {name: '青海',value: randomData() },
                {name: '西藏',value: randomData() },
                {name: '四川',value: randomData() },
                {name: '宁夏',value: randomData() },
                {name: '海南',value: randomData() },
                {name: '台湾',value: randomData() },
                {name: '香港',value: randomData() },
                {name: '澳门',value: randomData() }
            ]
        }
    ]
};




function randomData() {
    return [Math.round(Math.random() * 1000), Math.random() > 0.6];
}

setTimeout(function () {

    myChart.on('mouseup', function (params) {
        if (!down) {
            return;
        }
        down = false;

        var e = params.event;

        var geoCoord = myChart.convertFromPixel('series', [e.offsetX, e.offsetY]);

        myChart.setOption({
            series: [{
                center: geoCoord,
                zoom: 4,
                animationDurationUpdate: 1000,
                animationEasingUpdate: 'cubicInOut'
            }]
        });
    });

    var down;
    myChart.on('mousedown', function () {
        down = true;
    });
    myChart.on('mousemove', function () {
        down = false;
    });

}, 0);
