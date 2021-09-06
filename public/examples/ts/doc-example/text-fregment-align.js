
option = {
    series: [
        {
            type: 'scatter',
            data: [[0,0]],
            symbolSize: 1,
            label: {
                normal: {
                    show: true,
                    formatter: [
                        '{tc|height is specified as 30}{box|}',
                        '{lh|Biggest lineHeight} {vt|verticalAlign "top"} {vb|verticalAlign "bottom"} {vm|verticalAlign "middle"}',
                        '{l1|align "left"}{l2|align "left"}{c1|align "center"}{c2|align "center"}{r2|align "right"}{r1|align "right"}',
                        '{tc|height is specified as 30}{box|}',
                    ].join('\n'),
                    backgroundColor: '#ddd',
                    borderColor: '#555',
                    borderWidth: 1,
                    borderRadius: 5,
                    padding: [0, 20, 0, 20],
                    color: '#000',
                    fontSize: 14,
                    rich: {
                        box: {
                            backgroundColor: '#000',
                            height: 30,
                            padding: [0, 20, 0, 20],
                            align: 'right',
                            width: '100%',
                            color: '#eee'
                        },
                        tc: {
                            align: 'center',
                            color: '#eee'
                        },
                        lh: {
                            fontSize: 30,
                            color: 'rgb(199,86,83)',
                            borderWidth: 1,
                            borderColor: 'rgb(199,86,83)'
                        },
                        vt: {
                            verticalAlign: 'top',
                            backgroundColor: '#991122',
                            color: '#fff',
                            padding: [1, 2, 1, 2]
                        },
                        vb: {
                            verticalAlign: 'bottom',
                            backgroundColor: '#991122',
                            color: '#fff',
                            padding: [1, 2, 1, 2]
                        },
                        vm: {
                            verticalAlign: 'middle',
                            backgroundColor: '#991122',
                            color: '#fff',
                            padding: [1, 2, 1, 2]
                        },
                        l1: {
                            backgroundColor: '#7066FF',
                            color: '#fff',
                            padding: 5
                        },
                        l2: {
                            backgroundColor: '#339911',
                            color: '#fff',
                            borderRadius: 15,
                            padding: 5
                        },
                        r1: {
                            backgroundColor: '#7066FF',
                            align: 'right',
                            color: '#fff',
                            padding: 5
                        },
                        r2: {
                            backgroundColor: '#339911',
                            align: 'right',
                            color: '#fff',
                            borderRadius: 15,
                            padding: 5
                        },
                        c1: {
                            backgroundColor: '#7066FF',
                            align: 'center',
                            color: '#fff',
                            padding: 5,
                            width: 100
                        },
                        c2: {
                            backgroundColor: '#339911',
                            align: 'center',
                            color: '#fff',
                            borderRadius: 15,
                            padding: 5,
                            width: 100
                        }
                    }
                }
            }
        }
    ],
    xAxis: {
        axisLabel: {show: false},
        axisLine: {show: false},
        splitLine: {show: false},
        axisTick: {show: false},
        min: -1,
        max: 1
    },
    yAxis: {
        axisLabel: {show: false},
        axisLine: {show: false},
        splitLine: {show: false},
        axisTick: {show: false},
        min: -1,
        max: 1
    }
};