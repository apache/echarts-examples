var data = [];
for (var i = 0; i < 8; ++i) {
    data.push({
        name: 'left',
        label: {
            align: 'left',
            position: 'inside'
        },
        children: [{
            name: 'right',
            value: 1,
            label: {
                align: 'right',
                position: 'inside'
            }
        }]
    });
}

option = {
    series: {
        radius: ['20%', '90%'],
        type: 'sunburst',
        sort: null,
        highlightPolicy: 'none',
        data: data,
        label: {
            fontSize: 14
        }
    }
};
