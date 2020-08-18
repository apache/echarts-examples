/*
title: Hide Overlapped Label
category: graph
titleCN: 关系图自动隐藏重叠标签
*/

myChart.showLoading();
$.getJSON(ROOT_PATH + '/data/asset/data/les-miserables.json', function (graph) {
    myChart.hideLoading();

    option = {
        tooltip: {},
        legend: [{
            data: graph.categories.map(function (a) {
                return a.name;
            })
        }],
        series: [
            {
                name: 'Les Miserables',
                type: 'graph',
                layout: 'none',
                data: graph.nodes,
                links: graph.links,
                categories: graph.categories,
                roam: true,
                label: {
                    show: true,
                    position: 'right',
                    formatter: '{b}'
                },
                labelLayout: {
                    hideOverlap: true
                },
                lineStyle: {
                    color: 'source',
                    curveness: 0.3
                }
            }
        ]
    };

    myChart.setOption(option);
});