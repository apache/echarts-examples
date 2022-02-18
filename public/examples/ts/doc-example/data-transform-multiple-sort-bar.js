option = {
    dataset: [{
        dimensions: ['name', 'age', 'profession', 'score', 'date'],
        source: [
            [' Hannah Krause ', 41, 'Engineer', 314, '2011-02-12'],
            ['Zhao Qian ', 20, 'Teacher', 351, '2011-03-01'],
            [' Jasmin Krause ', 52, 'Musician', 287, '2011-02-14'],
            ['Li Lei', 37, 'Teacher', 219, '2011-02-18'],
            [' Karle Neumann ', 25, 'Engineer', 253, '2011-04-02'],
            [' Adrian Groß', 19, 'Teacher', null, '2011-01-16'],
            ['Mia Neumann', 71, 'Engineer', 165, '2011-03-19'],
            [' Böhm Fuchs', 36, 'Musician', 318, '2011-02-24'],
            ['Han Meimei ', 67, 'Engineer', 366, '2011-03-12'],
        ]
    }, {
        transform: {
            type: 'sort',
            config: [
                { dimension: 'profession', order: 'desc' },
                { dimension: 'score', order: 'desc' }
            ]
        }
    }],
    xAxis: {
        type: 'category',
        axisLabel: { interval: 0, rotate: 30 },
    },
    yAxis: {},
    series: {
        type: 'bar',
        label: {
            show: true,
            rotate: 90,
            position:
            'insideBottom',
            align: 'left',
            verticalAlign: 'middle'
        },
        itemStyle: {
            color: function (params) {
                return ({
                    Engineer: '#5470c6',
                    Teacher: '#91cc75',
                    Musician: '#fac858'
                })[params.data[2]]
            }
        },
        encode: { x: 'name', y: 'score', label: ['profession'] },
        datasetIndex: 1
    }
};
