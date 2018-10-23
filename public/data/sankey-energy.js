myChart.showLoading();
$.get('data/asset/data/energy.json', function (data) {
    myChart.hideLoading();

    myChart.setOption(option = {
        title: {
            text: 'Sankey Diagram'
        },
        tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove'
        },
        series: [
            {
                type: 'sankey',
                data: data.nodes,
                links: data.links,
                focusNodeAdjacency: 'allEdges',
                itemStyle: {
                    normal: {
                        borderWidth: 1,
                        borderColor: '#aaa'
                    }
                },
                lineStyle: {
                    normal: {
                        color: 'source',
                        curveness: 0.5
                    }
                }
            }
        ]
    });
});