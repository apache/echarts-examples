function genData(len, offset) {
    // console.profile('gen');
    var lngRange = [-10.781327, 131.48];
    var latRange = [18.252847, 52.33];

    var arr = new Float32Array(len * 2);
    var off = 0;

    for (var i = 0; i < len; i++) {
        var x = +Math.random() * 10;
        var y = +Math.sin(x) - x * (len % 2 ? 0.1 : -0.1) * Math.random() + (offset || 0) / 10;
        arr[off++] = x;
        arr[off++] = y;
    }
    return arr;
}

option = {
    tooltip: {},
    toolbox: {
        left: 'center',
        feature: {
            dataZoom: {}
        }
    },
    legend: {
        orient: 'vertical',
        left: 'left',
        data: ['pm2.5' /* ,'pm10' */]
    },
    // ???
    // visualMap: {
    //     min: 0,
    //     max: 1500,
    //     left: 'left',
    //     top: 'bottom',
    //     text: ['High','Low'],
    //     seriesIndex: [1, 2, 3],
    //     inRange: {
    //         color: ['#006edd', '#e0ffff']
    //     },
    //     calculable : true
    // },
    xAxis: [{
    }],
    yAxis: [{
    }],
    dataZoom: [{
        type: 'inside'
    }, {
        type: 'slider'
    }],
    animation: false,
    series : [{
        name: 'pm2.5',
        type: 'scatter',
        data: genData(5e5),
        dimensions: ['x', 'y'],
        symbolSize: 3,
        itemStyle: {
            color: '#128de3',
            opacity: 0.4
        },
        large: true
    }]
};


// option = {
//     title: {
//         text: '大规模散点图'
//     },
//     tooltip : {
//         trigger: 'axis',
//         showDelay : 0,
//         axisPointer:{
//             show: true,
//             type : 'cross',
//             lineStyle: {
//                 type : 'dashed',
//                 width : 1
//             }
//         },
//         zlevel: 1
//     },
//     legend: {
//         data:['sin','cos']
//     },
//     toolbox: {
//         show : true,
//         feature : {
//             mark : {show: true},
//             dataZoom : {show: true},
//             dataView : {show: true, readOnly: false},
//             restore : {show: true},
//             saveAsImage : {show: true}
//         }
//     },
//     xAxis : [
//         {
//             type : 'value',
//             scale:true
//         }
//     ],
//     yAxis : [
//         {
//             type : 'value',
//             scale:true
//         }
//     ],
//     series : [
//         {
//             name:'sin',
//             type:'scatter',
//             large: true,
//             symbolSize: 3,
//             data: (function () {
//                 var d = [];
//                 var len = 10000;
//                 var x = 0;
//                 while (len--) {
//                     x = (Math.random() * 10).toFixed(3) - 0;
//                     d.push([
//                         x,
//                         //Math.random() * 10
//                         (Math.sin(x) - x * (len % 2 ? 0.1 : -0.1) * Math.random()).toFixed(3) - 0
//                     ]);
//                 }
//                 //console.log(d)
//                 return d;
//             })()
//         },
//         {
//             name:'cos',
//             type:'scatter',
//             large: true,
//             symbolSize: 2,
//             data: (function () {
//                 var d = [];
//                 var len = 20000;
//                 var x = 0;
//                 while (len--) {
//                     x = (Math.random() * 10).toFixed(3) - 0;
//                     d.push([
//                         x,
//                         //Math.random() * 10
//                         (Math.cos(x) - x * (len % 2 ? 0.1 : -0.1) * Math.random()).toFixed(3) - 0
//                     ]);
//                 }
//                 //console.log(d)
//                 return d;
//             })()
//         }
//     ]
// };
