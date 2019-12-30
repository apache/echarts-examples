option = {
    color: [
        '#67001f', '#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#d1e5f0', '#92c5de', '#4393c3', '#2166ac', '#053061'
    ],
    tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove'
    },
    animation: false,
    series: [
        {
            type: 'sankey',
            bottom: '10%',
            focusNodeAdjacency: 'allEdges',
            data: [
                {name: 'a'},
                {name: 'b'},
                {name: 'a1'},
                {name: 'b1'},
                {name: 'c'},
                {name: 'e'}
            ],
            links: [
                {source: 'a', target: 'a1', value: 5},
                {source: 'e', target: 'b', value: 3},
                {source: 'a', target: 'b1', value: 3},
                {source: 'b1', target: 'a1', value: 1},
                {source: 'b1', target: 'c', value: 2},
                {source: 'b', target: 'c', value: 1}
            ],
            orient: 'vertical',
            label: {
                position: 'top'
            },
            lineStyle: {
                color: 'source',
                curveness: 0.5
            }
        }
    ]
}
