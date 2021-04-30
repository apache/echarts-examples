
var svg_noWidthHeight_noViewBox = `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" version="1.2" fill-rule="evenodd" xml:space="preserve">
    <circle cx="0" cy="0" r="100" fill="#765" />
</svg>
`;
var svg_noWidthHeight_hasViewBox = `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" version="1.2" fill-rule="evenodd" xml:space="preserve"
    viewBox="0 0 200 200"
>
    <circle cx="0" cy="0" r="100" fill="#765" />
</svg>
`;
var svg_hasWidthHeight_hasViewBox = `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" version="1.2" fill-rule="evenodd" xml:space="preserve"
    width="100"
    height="200"
    viewBox="0 0 200 200"
>
    <circle cx="0" cy="0" r="100" fill="#765" />
</svg>
`;

echarts.registerMap('svg_noWidthHeight_noViewBox', { svg: svg_noWidthHeight_noViewBox });
echarts.registerMap('svg_noWidthHeight_hasViewBox', { svg: svg_noWidthHeight_hasViewBox });
echarts.registerMap('svg_hasWidthHeight_hasViewBox', { svg: svg_hasWidthHeight_hasViewBox });

var WIDTH = 100;
var HEIGHT = 100;
var X_GAP = 120;
var Y_GAP = 120;
var X_START = 40;
var currentLeft = X_START;
var currentTop = 40;
var currentGeoIndex = 0;

option = {
    geo: [],
    graphic: []
};

function addGeoOption(option, optionPartial, labelLines) {
    optionPartial.geo.left = currentLeft;
    optionPartial.geo.top = currentTop;
    optionPartial.geo.width = WIDTH;
    optionPartial.geo.height = HEIGHT;

    option.geo.push(optionPartial.geo);
    labelLines.unshift('{head|geo ' + currentGeoIndex + ':}');
    option.graphic.push({
        type: 'rect',
        shape: { x: currentLeft, y: currentTop, width: WIDTH, height: HEIGHT },
        style: { fill: null, stroke: '#000', lineWidth: 2 },
        textContent: {
            style: {
                text: labelLines.join('\n'),
                fontFamily: 'Arial',
                fontSize: 12,
                align: 'left',
                rich: { head: { fill: 'red', lineHeight: 20} }
            }
        },
        textConfig: { position: [0, HEIGHT + 10] }
    });

    currentLeft += WIDTH + X_GAP;
    if (!((currentGeoIndex + 1) % 3)) {
        currentLeft = X_START;
        currentTop += HEIGHT + Y_GAP;
    }
    currentGeoIndex++;
}

addGeoOption(
    option,
    {
        geo: {
            map: 'svg_noWidthHeight_noViewBox'
        },
    },
    [
        '<svg>',
        '<circle cx="0" cy="0" r="100"/>',
        '</svg>'
    ]
);
addGeoOption(
    option,
    {
        geo: {
            map: 'svg_noWidthHeight_hasViewBox',
        }
    },
    [
        '<svg viewBox="0 0 200 200">',
        '<circle cx="0" cy="0" r="100"/>',
        '</svg>'
    ]
);
addGeoOption(
    option,
    {
        geo: {
            map: 'svg_hasWidthHeight_hasViewBox',
        }
    },
    [
        '<svg viewBox="0 0 200 200"',
        '     width="100" height="200">',
        '<circle cx="0" cy="0" r="100"/>',
        '</svg>'
    ]
);
addGeoOption(
    option,
    {
        geo: {
            map: 'svg_noWidthHeight_noViewBox',
            boundingCoords: [[-50, -50], [150, 150]],
        }
    },
    [
        '<svg>',
        '<circle cx="0" cy="0" r="100"/>',
        '</svg>',
        'geo.boundingCoords: ',
        '    [[-50, -50], [150, 150]]'
    ]
);
addGeoOption(
    option,
    {
        geo: {
            map: 'svg_noWidthHeight_hasViewBox',
            boundingCoords: [[-50, -50], [150, 150]],
        }
    },
    [
        '<svg viewBox="0 0 200 200">',
        '<circle cx="0" cy="0" r="100"/>',
        '</svg>',
        'geo.boundingCoords: ',
        '    [[-50, -50], [150, 150]]'
    ]
);
addGeoOption(
    option,
    {
        geo: {
            map: 'svg_hasWidthHeight_hasViewBox',
            boundingCoords: [[-50, -50], [150, 150]],
        }
    },
    [
        '<svg viewBox="0 0 200 200"',
        '     width="100" height="200">',
        '<circle cx="0" cy="0" r="100"/>',
        '</svg>',
        'geo.boundingCoords: ',
        '    [[-50, -50], [150, 150]]'
    ]
);
