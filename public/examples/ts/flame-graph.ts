/*
title: Flame graph
category: custom
titleCN: 火焰图
difficulty: 4
*/

import {
  CustomSeriesRenderItem,
  CustomSeriesRenderItemAPI,
  CustomSeriesRenderItemParams
} from 'echarts';

interface StackTrace {
  id: string;
  name: string;
  value: number;
  children?: [StackTrace];
}

const ColorTypes = {
  root: '#8fd3e8',
  genunix: '#d95850',
  unix: '#eb8146',
  ufs: '#ffb248',
  FSS: '#f2d643',
  namefs: '#ebdba4',
  doorfs: '#fcce10',
  lofs: '#b5c334',
  zfs: '#1bca93'
} as const;

const filterJson = (json: StackTrace, id?: string): StackTrace => {
  if (id === undefined) {
    return json;
  }

  const recur = (item: StackTrace, id?: string): StackTrace | undefined => {
    if (item.id === id) {
      return item;
    }

    for (const child of item?.children ?? []) {
      const temp = recur(child, id);
      if (temp && Array.from(Object.keys(temp)).length !== 0) {
        item.children = [temp];
        item.value = temp.value; // change the parents' values
        return item;
      }
    }
  };

  return recur(json, id) ?? json;
};

const recursionJson = (jsonObj: StackTrace, id?: string): any[] => {
  const data: any[] = [];
  const filteredJson = filterJson(structuredClone(jsonObj), id);
  const rootVal = filteredJson.value;

  const recur = (item: StackTrace, start = 0, level = 0) => {
    const temp = {
      name: item.id,
      // [level, start_val, end_val, name, percentage]
      value: [
        level,
        start,
        start + item.value,
        item.name,
        (item.value / rootVal) * 100
      ],
      itemStyle: {
        normal: {
          color: ColorTypes[item.name.split(' ')[0] as keyof typeof ColorTypes]
        }
      }
    };
    data.push(temp);

    let prevStart = start;
    for (const child of item?.children ?? []) {
      recur(child, prevStart, level + 1);
      prevStart = prevStart + child.value;
    }
  };

  recur(filteredJson);
  return data;
};

const heightOfJson = (json: StackTrace): number => {
  const recur = (item: StackTrace, level = 0): number => {
    if ((item?.children ?? []).length === 0) {
      return level;
    }

    let maxLevel = level;
    for (const child of item?.children ?? []) {
      const tempLevel = recur(child, level + 1);
      maxLevel = Math.max(maxLevel, tempLevel);
    }
    return maxLevel;
  };

  return recur(json);
};

const renderItem: CustomSeriesRenderItem = (
  params: CustomSeriesRenderItemParams,
  api: CustomSeriesRenderItemAPI
) => {
  const level = api.value(0);
  const start = api.coord([api.value(1), level]);
  const end = api.coord([api.value(2), level]);
  const height = ((api.size?.([0, 1]) ?? [0, 20]) as number[])[1];

  return {
    type: 'rect',
    transition: ['shape'],
    shape: {
      x: start[0],
      y: start[1] - height / 2,
      width: end[0] - start[0],
      height: height
    },
    style: api.style({})
  };
};

myChart.showLoading();
$.get(
  ROOT_PATH + '/data/asset/data/stack-trace.json',
  (stackTrace: StackTrace) => {
    myChart.hideLoading();

    const levelOfOriginalJson = heightOfJson(stackTrace);

    option = {
      tooltip: {
        formatter: (params: any) => {
          const samples = params.value[2] - params.value[1];
          return `${params.marker} ${params.value[3]}: (${samples} samples, ${params.value[4]}%)`;
        }
      },
      title: [
        {
          text: 'Flame Graph',
          left: 'center',
          top: 10,
          textStyle: { fontWeight: 'normal', fontSize: 20 }
        }
      ],
      xAxis: {
        show: false
      },
      yAxis: {
        show: false,
        max: levelOfOriginalJson
      },
      series: [
        {
          type: 'custom',
          renderItem: renderItem,
          encode: {
            x: [0, 1],
            y: 0
          },
          itemStyle: {
            borderWidth: 1,
            borderColor: '#fff'
          },
          labelLayout: {
            hideOverlap: true
          },
          data: recursionJson(stackTrace)
        }
      ]
    };

    if (option && typeof option === 'object') {
      myChart.setOption(option);
    }

    myChart.on('click', (params: any) => {
      const data = recursionJson(stackTrace, params.data.name);
      const rootValue = data[0].value[2];

      myChart.setOption({
        ...option,
        xAxis: { max: rootValue },
        series: [{ data }]
      });
    });
  }
);
