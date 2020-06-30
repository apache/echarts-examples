myChart.showLoading();
$.get(ROOT_PATH + '/data/asset/data/energy.json', function (data) {
    myChart.hideLoading();

    myChart.setOption(option = {
        title: {
            text: 'Node Align Right'
        },
        tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove'
        },
        animation: false,
        series: [
            {
                type: 'sankey',
                focusNodeAdjacency: 'allEdges',
                nodeAlign: 'left',
                data: data.nodes,
                links: data.links,
                lineStyle: {
                    color: 'source',
                    curveness: 0.5
                }
            }
        ]
    });
});

