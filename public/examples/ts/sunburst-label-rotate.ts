/*
title: Sunburst Label Rotate
category: sunburst
titleCN: 旭日图标签旋转
difficulty: 2
*/

option = {
  silent: true,
  series: [
    {
      radius: ['15%', '80%'],
      type: 'sunburst',
      sort: undefined,
      emphasis: {
        focus: 'ancestor'
      },
      data: [
        {
          value: 8,
          children: [
            {
              value: 4,
              children: [
                {
                  value: 2
                },
                {
                  value: 1
                },
                {
                  value: 1
                },
                {
                  value: 0.5
                }
              ]
            },
            {
              value: 2
            }
          ]
        },
        {
          value: 4,
          children: [
            {
              children: [
                {
                  value: 2
                }
              ]
            }
          ]
        },
        {
          value: 4,
          children: [
            {
              children: [
                {
                  value: 2
                }
              ]
            }
          ]
        },
        {
          value: 3,
          children: [
            {
              children: [
                {
                  value: 1
                }
              ]
            }
          ]
        }
      ],
      label: {
        color: '#000',
        textBorderColor: '#fff',
        textBorderWidth: 2,
        formatter: function (param: any) {
          var depth = param.treePathInfo.length;
          if (depth === 2) {
            return 'radial';
          } else if (depth === 3) {
            return 'tangential';
          } else if (depth === 4) {
            return '0';
          }
          return '';
        }
      },
      levels: [
        {},
        {
          itemStyle: {
            color: '#CD4949'
          },
          label: {
            rotate: 'radial'
          }
        },
        {
          itemStyle: {
            color: '#F47251'
          },
          label: {
            rotate: 'tangential'
          }
        },
        {
          itemStyle: {
            color: '#FFC75F'
          },
          label: {
            rotate: 0
          }
        }
      ]
    }
  ]
};

export {};
