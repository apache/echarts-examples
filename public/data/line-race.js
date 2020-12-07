/*
title: Line Race
category: line
titleCN: 动态排序折线图
difficulty: 5
*/

$.get(ROOT_PATH + '/data/asset/data/life-expectancy-table.json', function (_rawData) {
    run(_rawData);
});

function run(_rawData) {

    // var countries = ['Australia', 'Canada', 'China', 'Cuba', 'Finland', 'France', 'Germany', 'Iceland', 'India', 'Japan', 'North Korea', 'South Korea', 'New Zealand', 'Norway', 'Poland', 'Russia', 'Turkey', 'United Kingdom', 'United States'];
    var countries = ['Finland', 'France', 'Germany', 'Iceland', 'Norway', 'Poland', 'Russia', 'United Kingdom'];
    var datasetWithFilters = [];
    var seriesList = [];
    echarts.util.each(countries, function (country) {
        var datasetId = 'dataset_' + country;
        datasetWithFilters.push({
            id: datasetId,
            fromDatasetId: 'dataset_raw',
            transform: {
                type: 'filter',
                config: {
                    and: [
                        { dimension: 'Year', gte: 1950 },
                        { dimension: 'Country', '=': country }
                    ]
                }
            }
        });
        seriesList.push({
            type: 'line',
            datasetId: datasetId,
            showSymbol: false,
            name: country,
            endLabel: {
                show: true,
                formatter: function (params) {
                    return params.value[3] + ': ' + params.value[0];
                }
            },
            labelLayout: {
                moveOverlap: 'shiftY'
            },
            emphasis: {
                focus: 'series'
            },
            encode: {
                x: 'Year',
                y: 'Income',
                label: ['Country', 'Income'],
                itemName: 'Year',
                tooltip: ['Income'],
            }
        });
    });

    option = {
        animationDuration: 10000,
        dataset: [{
            id: 'dataset_raw',
            source: _rawData
        }].concat(datasetWithFilters),
        title: {
            text: 'Income of Germany and France since 1950'
        },
        tooltip: {
            order: 'valueDesc',
            trigger: 'axis'
        },
        xAxis: {
            type: 'category',
            nameLocation: 'middle'
        },
        yAxis: {
            name: 'Income'
        },
        grid: {
            right: 140
        },
        series: seriesList
    };

    myChart.setOption(option);

}
