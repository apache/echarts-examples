option = {
    title: {
        text: '漏斗图(对比)',
        subtext: '纯属虚构',
        left: 'left',
        top: 'bottom'
    },
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c}%"
    },
    toolbox: {
        show: true,
        orient: 'vertical',
        top: 'center',
        feature: {
            dataView: {readOnly: false},
            restore: {},
            saveAsImage: {}
        }
    },
    legend: {
        orient: 'vertical',
        left: 'left',
        data: ['产品A','产品B','产品C','产品D','产品E']
    },
    calculable: true,
    series: [
        {
            name: '漏斗图',
            type: 'funnel',
            width: '40%',
            height: '45%',
            left: '5%',
            top: '50%',
            funnelAlign: 'right',

            center: ['25%', '25%'],  // for pie

            data:[
                {value:60, name:'产品C'},
                {value:30, name:'产品D'},
                {value:10, name:'产品E'},
                {value:80, name:'产品B'},
                {value:100, name:'产品A'}
            ]
        },
        {
            name: '金字塔',
            type:'funnel',
            width: '40%',
            height: '45%',
            left: '5%',
            top: '5%',
            sort: 'ascending',
            funnelAlign: 'right',

            center: ['25%', '75%'],  // for pie

            data:[
                {value:60, name:'产品C'},
                {value:30, name:'产品D'},
                {value:10, name:'产品E'},
                {value:80, name:'产品B'},
                {value:100, name:'产品A'}
            ]
        },
        {
            name:'漏斗图',
            type:'funnel',
            width: '40%',
            height: '45%',
            left: '55%',
            top: '5%',
            funnelAlign: 'left',

            center: ['75%', '25%'],  // for pie

            data: [
                {value: 60, name: '产品C'},
                {value: 30, name: '产品D'},
                {value: 10, name: '产品E'},
                {value: 80, name: '产品B'},
                {value: 100, name: '产品A'}
            ]
        },
        {
            name: '金字塔',
            type:'funnel',
            width: '40%',
            height: '45%',
            left: '55%',
            top: '50%',
            sort: 'ascending',
            funnelAlign: 'left',

            center: ['75%', '75%'],  // for pie

            data: [
                {value: 60, name: '产品C'},
                {value: 30, name: '产品D'},
                {value: 10, name: '产品E'},
                {value: 80, name: '产品B'},
                {value: 100, name: '产品A'}
            ]
        }
    ]
};
