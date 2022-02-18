/*
title: ECharts Option Query
category: treemap
titleCN: ECharts 配置项查询分布
*/

type RawNode = {
  [key: string]: RawNode;
} & {
  $count: number;
};

interface TreeNode {
  name: string;
  value: number;
  children?: TreeNode[];
}

const uploadedDataURL =
  ROOT_PATH + '/data/asset/data/ec-option-doc-statistics-201604.json';

myChart.showLoading();

$.getJSON(uploadedDataURL, function (rawData) {
  myChart.hideLoading();

  function convert(source: RawNode, target: TreeNode, basePath: string) {
    for (let key in source) {
      let path = basePath ? basePath + '.' + key : key;
      if (!key.match(/^\$/)) {
        target.children = target.children || [];
        const child = {
          name: path
        } as TreeNode;
        target.children.push(child);
        convert(source[key], child, path);
      }
    }

    if (!target.children) {
      target.value = source.$count || 1;
    } else {
      target.children.push({
        name: basePath,
        value: source.$count
      });
    }
  }

  const data = {
    children: [] as TreeNode[]
  } as TreeNode;

  convert(rawData, data, '');

  myChart.setOption(
    (option = {
      title: {
        text: 'ECharts Options',
        subtext: '2016/04',
        left: 'leafDepth'
      },
      tooltip: {},
      series: [
        {
          name: 'option',
          type: 'treemap',
          visibleMin: 300,
          data: data.children,
          leafDepth: 2,
          levels: [
            {
              itemStyle: {
                borderColor: '#555',
                borderWidth: 4,
                gapWidth: 4
              }
            },
            {
              colorSaturation: [0.3, 0.6],
              itemStyle: {
                borderColorSaturation: 0.7,
                gapWidth: 2,
                borderWidth: 2
              }
            },
            {
              colorSaturation: [0.3, 0.5],
              itemStyle: {
                borderColorSaturation: 0.6,
                gapWidth: 1
              }
            },
            {
              colorSaturation: [0.3, 0.5]
            }
          ]
        }
      ]
    })
  );
});
export {};
