var svg = `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" version="1.2" fill-rule="evenodd" xml:space="preserve">
    <path name="named_rect" d="M 0,0 L 0,100 100,100 100,0 Z" fill="#765" />
    <path d="M 150,0 L 150,100 250,100 250,0 Z" fill="#567" />
</svg>
`;

echarts.registerMap('simple_svg', { svg: svg });

option = {
  geo: {
    map: 'simple_svg'
  }
};
