/*
title: Data Transform Simple Aggregate
category: bar
titleCN: 简单的数据聚合
difficulty: 3
*/

$.when(
    $.get(ROOT_PATH + '/data/asset/data/life-expectancy-table.json'),
    $.getScript(ROOT_PATH + '/data/asset/js/myTransform.js')
).done(function (res) {
    run(res[0]);
});

function run(_rawData) {

    echarts.registerTransform(window.myTransform.aggregate);

    option = {
        dataset: [{
            id: 'raw',
            source: _rawData
        }, {
            id: 'income_aggregate',
            fromDatasetId: 'raw',
            transform: [{
                type: 'filter',
                config: {
                    dimension: 'Year', gte: 1950
                }
            }, {
                type: 'myTransform:aggregate',
                config: {
                    resultDimensions: [
                        { name: 'min', from: 'Income', method: 'min' },
                        { name: 'Q1', from: 'Income', method: 'Q1' },
                        { name: 'median', from: 'Income', method: 'median' },
                        { name: 'Q3', from: 'Income', method: 'Q3' },
                        { name: 'max', from: 'Income', method: 'max' },
                        { name: 'Country', from: 'Country' }
                    ],
                    groupBy: 'Country'
                }
            }, {
                type: 'sort',
                config: {
                    dimension: 'max',
                    order: 'asc'
                }
            }]
        }],
        title: {
            text: 'Income since 1950'
        },
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            name: 'Income',
            nameLocation: 'middle',
            nameGap: 30
        },
        yAxis: {
            type: 'category'
        },
        series: {
            type: 'boxplot',
            datasetId: 'income_aggregate',
            encode: {
                x: ['min', 'Q1', 'median', 'Q3', 'max'],
                y: 'Country',
                itemName: ['Country'],
                tooltip: ['min', 'Q1', 'median', 'Q3', 'max']
            }
        }
    };

    myChart.setOption(option);

}
