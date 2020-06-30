
myChart.showLoading();
$.get(ROOT_PATH + '/data/asset/data/flare.json', function (data) {
    myChart.hideLoading();

    echarts.util.each(data.children, function (datum, index) {
        index % 2 === 0 && (datum.collapsed = true);
    });

    myChart.setOption(option = {

        tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove'
        },

        series:[
            {
                type: 'tree',

                data: [data],

                top: '1%',
                left: '15%',
                bottom: '1%',
                right: '7%',

                symbolSize: 7,

                orient: 'RL',

                label: {
                    position: 'right',
                    verticalAlign: 'middle',
                    align: 'left'
                },

                leaves: {
                    label: {
                        position: 'left',
                        verticalAlign: 'middle',
                        align: 'right'
                    }
                },

                expandAndCollapse: true,
                animationDuration: 550,
                animationDurationUpdate: 750
            }
        ]
    });
});


