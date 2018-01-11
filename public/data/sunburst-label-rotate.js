option = {
    silent: true,
    series: {
        radius: ['15%', '80%'],
        type: 'sunburst',
        sort: null,
        highlightPolicy: 'ancestor',
        data: [{
            value: 8,
            children: [{
                value: 4,
                children: [{
                    value: 2
                }, {
                    value: 1
                }, {
                    value: 1
                }, {
                    value: 0.5
                }]
            }, {
                value: 2
            }]
        }, {
            value: 4,
            children: [{
                children: [{
                    value: 2
                }]
            }]
        }, {
            value: 4,
            children: [{
                children: [{
                    value: 2
                }]
            }]
        }, {
            value: 3,
            children: [{
                children: [{
                    value: 1
                }]
            }]
        }],
        label: {
            color: '#fff',
            textBorderColor: '#666',
            textBorderWidth: 2,
            borderColor: '#999',
            borderWidth: 1,
            formatter: function (param) {
                var depth = param.treePathInfo.length;
                if (depth === 2) {
                    return 'radial';
                }
                else if (depth === 3) {
                    return 'tangential';
                }
                else if (depth === 4) {
                    return '0';
                }
            }
        },
        levels: [{}, {
            itemStyle: {
                color: 'red'
            },
            label: {
                rotate: 'radial'
            }
        }, {
            itemStyle: {
                color: 'orange'
            },
            label: {
                rotate: 'tangential'
            }
        }, {
            itemStyle: {
                color: 'yellow'
            },
            label: {
                rotate: 0
            }
        }]
    }
};
