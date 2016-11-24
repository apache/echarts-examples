option = {
    graphic: [{
        type: 'group',
        id: 'textGroup1',
        left: 30,
        top: 30,
        bounding: 'raw',
        children: [
            {
                type: 'rect',
                z: 100,
                left: 'center',
                top: 'center',
                shape: {
                    width: 330,
                    height: 100
                },
                style: {
                    fill: '#fff',
                    stroke: '#999',
                    lineWidth: 2,
                    shadowBlur: 8,
                    shadowOffsetX: 3,
                    shadowOffsetY: 3,
                    shadowColor: 'rgba(0,0,0,0.3)'
                }
            },
            {
                type: 'text',
                z: 100,
                top: 'middle',
                left: 'center',
                style: {
                    text: [
                        '这个文本框的 bounding 为 "raw"',
                        '表示定位时仅仅取 group 自己的',
                        '未经过 transform 的包围盒。'
                    ].join('\n'),
                    font: '20px "STHeiti", sans-serif'
                }
            }
        ]
    }, {
        type: 'group',
        id: 'textGroup2',
        left: 0,
        bottom: 0,
        children: [
            {
                type: 'rect',
                z: 100,
                left: 'center',
                top: 'center',
                shape: {
                    width: 330,
                    height: 100
                },
                style: {
                    fill: '#fff',
                    stroke: '#999',
                    lineWidth: 2,
                    shadowBlur: 8,
                    shadowOffsetX: 3,
                    shadowOffsetY: 3,
                    shadowColor: 'rgba(0,0,0,0.3)'
                }
            },
            {
                type: 'text',
                z: 100,
                top: 'middle',
                left: 'center',
                style: {
                    text: [
                        '这个文本框的 bounding 为 "all"',
                        '表示定位时取整个 group 的',
                        '经过 transform 后的包围盒。'
                    ].join('\n'),
                    font: '20px "STHeiti", sans-serif'
                }
            }
        ]
    }]
}

var rotation = 0;
setInterval(function () {
    rotation = (rotation + Math.PI / 300) % (Math.PI * 2);
    myChart.setOption({
        graphic: [{
            id: 'textGroup1',
            rotation: rotation
        }, {
            id: 'textGroup2',
            rotation: rotation
        }]
    });
}, 20);