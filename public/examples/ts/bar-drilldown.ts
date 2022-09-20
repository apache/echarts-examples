/*
title: Bar Chart Multi-level Drilldown Animation
category: bar
titleCN: 柱状图多层下钻动画
difficulty: 5
*/

interface DataItem {
  value: number;
  groupId: string;
  childGroupId: string;
}

// level 1 (root)
const data_1 = [
  ['1_1', 5, '1', '1_1'],
  ['1_2', 2, '1', '1_2']
];
// level 2
const data_1_1 = [
  ['1_1_1', 2, '1_1', '1_1_1'],
  ['1_1_2', 2, '1_1', '1_1_2'],
  ['1_1_3', 3, '1_1', '1_1_3']
];
const data_1_2 = [
  ['1_2_1', 6, '1_2', '1_2_1'],
  ['1_2_2', 7, '1_2', '1_2_2']
];
// level 3
const data_1_1_1 = [
  ['1_1_1_A', 5, '1_1_1'], // the "childest" data need not to be specified a `childGroupId`
  ['1_1_1_B', 6, '1_1_1'],
  ['1_1_1_C', 7, '1_1_1'],
  ['1_1_1_D', 8, '1_1_1']
];
const data_1_1_2 = [
  ['1_1_2_A', 2, '1_1_2'],
  ['1_1_2_B', 9, '1_1_2']
];
const data_1_1_3 = [
  ['1_1_3_A', 1, '1_1_3'],
  ['1_1_3_B', 2, '1_1_3'],
  ['1_1_3_C', 8, '1_1_3']
];
const data_1_2_1 = [
  ['1_2_1_A', 9, '1_2_1'],
  ['1_2_1_B', 2, '1_2_1'],
  ['1_2_1_C', 1, '1_2_1']
];
const data_1_2_2 = [
  ['1_2_2_A', 7, '1_2_2'],
  ['1_2_2_B', 7, '1_2_2']
];
const allLevelData = [
  data_1,
  data_1_1,
  data_1_2,
  data_1_1_1,
  data_1_1_2,
  data_1_1_3,
  data_1_2_1,
  data_1_2_2
];

const allOptions: {
  [index: string]: any;
} = {};

allLevelData.forEach((data, index) => {
  // since dataItems of each data have same groupId in this
  // example, we can use groupId as optionId for optionStack.
  const optionId = data[0][2];

  if (index === 0) {
    data[0][2] = '';
    data[1][2] = '';
  }

  const option = {
    id: optionId, // option.id is not a property of emyCharts option model, but can be accessed if we provide it
    xAxis: {
      type: 'category'
    },
    yAxis: {},
    animationDurationUpdate: 500,
    series: {
      type: index % 2 === 0 ? 'bar' : 'line',
      dimensions: ['x', 'y', 'groupId', 'childGroupId'],
      encode: {
        x: 'x',
        y: 'y',
        itemGroupId: 'groupId',
        childGroupId: 'childGroupId'
      },
      data,
      universalTransition: {
        enabled: true,
        divideShape: 'clone'
      }
    },
    graphic: [
      {
        type: 'text',
        left: 50,
        top: 20,
        style: {
          text: 'Back',
          fontSize: 18,
          fill: 'grey'
        },
        onclick: function () {
          goBack();
        }
      }
    ]
  };
  allOptions[optionId] = option;
});

// A stack to remember previous option id
const optionStack: string[] = [];

const goForward = (optionId: string) => {
  optionStack.push(myChart.getOption().id as string); // push current option id into stack.
  myChart.setOption(allOptions[optionId], false);
};

const goBack = () => {
  if (optionStack.length === 0) {
    console.log('Already in root level!');
  } else {
    console.log('Go back to previous level');
    myChart.setOption(allOptions[optionStack.pop() as string]);
  }
};

option = allOptions['1']; // The initial option is the root data option

myChart.on('click', 'series', (params) => {
  const dataItem = params.data as any;
  if (dataItem[3]) {
    // If current params is not belong to the "childest" data, it has data[3]
    const childGroupId = dataItem[3];
    // since we use groupId as optionId in this example,
    // we use childGroupId as the next level optionId.
    const nextOptionId = childGroupId;
    goForward(nextOptionId);
  }
});

option && myChart.setOption(option);

export {};
