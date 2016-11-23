myChart.showLoading();

$.get('data/asset/data/obama_budget_proposal_2012.list.json', function (obama_budget_2012) {
    myChart.hideLoading();

    option = {
        tooltip : {
            trigger: 'item'
        },
        legend: {
            data: ['Growth', 'Budget 2011', 'Budget 2012'],
            itemGap: 5
        },
        grid: {
            top: '12%',
            left: '1%',
            right: '10%',
            containLabel: true
        },
        xAxis: [
            {
                type : 'category',
                data : obama_budget_2012.names
            }
        ],
        yAxis: [
            {
                type : 'value',
                name : 'Budget (million USD)',
                axisLabel: {
                    formatter: function (a) {
                        a = +a;
                        return isFinite(a)
                            ? echarts.format.addCommas(+a / 1000)
                            : '';
                    }
                }
            }
        ],
        dataZoom: [
            {
                type: 'slider',
                show: true,
                start: 94,
                end: 100,
                handleSize: 8
            },
            {
                type: 'inside',
                start: 94,
                end: 100
            },
            {
                type: 'slider',
                show: true,
                yAxisIndex: 0,
                filterMode: 'empty',
                width: 12,
                height: '70%',
                handleSize: 8,
                showDataShadow: false,
                left: '93%'
            }
        ],
        series : [
            {
                name: 'Budget 2011',
                type: 'bar',
                data: obama_budget_2012.budget2011List
            },
            {
                name: 'Budget 2012',
                type: 'bar',
                data: obama_budget_2012.budget2012List
            }
        ]
    };

    myChart.setOption(option);

});