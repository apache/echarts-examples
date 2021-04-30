var svg = `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" version="1.2" fill-rule="evenodd" xml:space="preserve"
        viewBox="-180 0 610 300">
    <g name="name_a">
        <path d="M 0,0 L 0,100 100,100 100,0 Z" fill="#765" />
        <path d="M 150,0 L 150,100 250,100 250,0 Z" fill="#765" />
    </g>
    <path name="name_b" d="M -80,200 L -80,300 20,300 20,200 Z" fill="#567" />
    <path name="name_b" d="M 230,200 L 230,300 330,300 330,200 Z" fill="#567" />
</svg>
`;

echarts.registerMap('simple_svg', { svg: svg });

option = {
    geo: {
        map: 'simple_svg',
        regions: [{
            name: 'name_a',
            label: {
                formatter: [
                    'This two rects are wrapped in a <g name="...">',
                    'So a single label is displayed in the center',
                    'of the bounding rect of the <g>'
                ].join('\n'),
                backgroundColor: 'rgba(0,0,0,0.2)',
                padding: 5
            }
        }, {
            name: 'name_b',
            label: {
                formatter: [
                    'This two rects are named',
                    'with the same name.',
                    'So each of them has a label.'
                ].join('\n'),
                backgroundColor: 'rgba(0,0,0,0.2)',
                padding: 5
            }
        }]
    }
};
