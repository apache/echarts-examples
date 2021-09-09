import * as echarts from 'echarts';
import * as jQuery from 'jquery';

declare global {
  const ROOT_PATH: string;
  const app: {
    configParameters: {
      [key: string]:
        | {
            options: Record<string, string> | string[];
          }
        | {
            min?: number;
            max?: number;
          };
    };
    config: {
      onChange: () => void;
      [key: string]: string | number | Function;
    };
    onresize: () => void;
    [key: string]: any;
  };

  const ecStat: any;
  const d3: any;

  const myChart: echarts.ECharts;
  let option: echarts.EChartsOption;

  const echarts: typeof echarts;
}
