var data = [{
    name: 'Apples',
    value: 70
}, {
    name: 'Strawberries',
    value: 68
}, {
    name: 'Bananas',
    value: 48
}, {
    name: 'Oranges',
    value: 40
}, {
    name: 'Pears',
    value: 32
}, {
    name: 'Pineapples',
    value: 27
}, {
    name: 'Grapes',
    value: 18
}];

option = {
    title: [{
        text: 'Pie label margin'
    }, {
        subtext: 'margin: "25%"',
        left: '25%',
        top: '75%',
        textAlign: 'center'
    }, {
        subtext: 'margin: 10',
        left: '75%',
        top: '75%',
        textAlign: 'center'
    }],
    series: [{
        type: 'pie',
        radius: '25%',
        center: ['50%', '50%'],
        data: data,
        animation: false,
        label: {
            position: 'outer',
            alignTo: 'edge',
            margin: '25%'
        },
        left: 0,
        right: '50%',
        top: 0,
        bottom: 0
    }, {
        type: 'pie',
        radius: '25%',
        center: ['50%', '50%'],
        data: data,
        animation: false,
        label: {
            position: 'outer',
            alignTo: 'edge',
            margin: 10
        },
        left: '50%',
        right: 0,
        top: 0,
        bottom: 0
    }]
};
