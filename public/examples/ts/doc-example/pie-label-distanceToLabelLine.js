var data = [{
    name: 'Apple Numbers',
    value: 70
}, {
    name: 'Strawberry Numbers',
    value: 68
}, {
    name: 'Banana Numbers',
    value: 48
}, {
    name: 'Orange Numbers',
    value: 40
}, {
    name: 'Pear Numbers',
    value: 32
}, {
    name: 'Pineapple Numbers',
    value: 27
}, {
    name: 'Grape Numbers',
    value: 18
}];

option = {
    title: [{
        text: 'Pie label margin'
    }, {
        subtext: 'distanceToLabelLine: 5',
        left: '25%',
        top: '75%',
        textAlign: 'center'
    }, {
        subtext: 'distanceToLabelLine: 20',
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
            alignTo: 'labelLine',
            distanceToLabelLine: 5
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
            alignTo: 'labelLine',
            distanceToLabelLine: 20
        },
        left: '50%',
        right: 0,
        top: 0,
        bottom: 0
    }]
};
