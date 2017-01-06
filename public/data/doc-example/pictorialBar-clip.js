var path = 'path://M36.7,102.84c-1.17,2.54-2.99,4.98-3.39,7.63c-1.51,9.89-3.31,19.58-1.93,29.95 c0.95,7.15-2.91,14.82-3.57,22.35c-0.64,7.36-0.2,14.86,0.35,22.25c0.12,1.68,2.66,3.17,4.67,5.4c-0.6,0.82-1.5,2.22-2.58,3.48 c-0.96,1.12-1.96,2.35-3.21,3.04c-1.71,0.95-3.71,2.03-5.51,1.9c-1.18-0.08-3.04-2.13-3.16-3.43c-0.44-4.72,0-9.52-0.41-14.25 c-0.94-10.88-2.32-21.72-3.24-32.61c-0.49-5.84-1.63-12.01-0.35-17.54c3.39-14.56,2.8-28.84,0.36-43.4 c-2.71-16.16-1.06-32.4,0.54-48.59c0.91-9.22,4.62-17.36,8.53-25.57c1.32-2.77,1.88-6.84,0.87-9.62C21.89-3.77,18.09-11,14.7-18.38 c-0.56,0.1-1.13,0.21-1.69,0.31C10.17-11.52,6.29-5.2,4.71,1.65C2.05,13.21-4.42,22.3-11.43,31.28c-1.32,1.69-2.51,3.5-3.98,5.04 c-4.85,5.08-3.25,10.98-2.32,16.82c0.25,1.53,0.52,3.06,0.77,4.59c-0.53,0.22-1.07,0.43-1.6,0.65c-1.07-2.09-2.14-4.19-3.28-6.44 c-6.39,2.91-2.67,9.6-5.23,15.16c-1.61-3.31-2.77-5.68-3.93-8.06c0-0.33,0-0.67,0-1c6.96-16.08,14.63-31.9,20.68-48.31 C-5.24-4.07-2.03-18.55,2-32.73c0.36-1.27,0.75-2.53,0.98-3.82c1.36-7.75,4.19-10.23,11.88-10.38c1.76-0.04,3.52-0.21,5.76-0.35 c-0.55-3.95-1.21-7.3-1.45-10.68c-0.61-8.67,0.77-16.69,7.39-23.19c2.18-2.14,4.27-4.82,5.25-7.65c2.39-6.88,11.66-9,16.94-8.12 c5.92,0.99,12.15,7.93,12.16,14.12c0.01,9.89-5.19,17.26-12.24,23.68c-2.17,1.97-5.35,4.77-5.17,6.94c0.31,3.78,4.15,5.66,8.08,6.04 c1.82,0.18,3.7,0.37,5.49,0.1c5.62-0.85,8.8,2.17,10.85,6.73C73.38-27.19,78.46-14.9,84.2-2.91c1.52,3.17,4.52,5.91,7.41,8.09 c7.64,5.77,15.57,11.16,23.45,16.61c2.28,1.58,4.64,3.23,7.21,4.14c5.18,1.84,8.09,5.63,9.82,10.46c0.45,1.24,0.19,3.71-0.6,4.18 c-1.06,0.63-3.15,0.27-4.44-0.38c-7.05-3.54-12.84-8.88-19.14-13.5c-3.5-2.57-7.9-4-12.03-5.6c-9.44-3.66-17.73-8.42-22.5-18.09 c-2.43-4.94-6.09-9.27-9.69-14.61c-1.2,10.98-4.46,20.65,1.14,31.19c6.62,12.47,5.89,26.25,1.21,39.49 c-2.52,7.11-6.5,13.74-8.67,20.94c-1.91,6.33-2.2,13.15-3.23,19.75c-0.72,4.63-0.84,9.48-2.36,13.84 c-2.49,7.16-6.67,13.83-5.84,21.82c0.42,4.02,1.29,7.99,2.1,12.8c-3.74-0.49-7.47-0.4-10.67-1.66c-1.33-0.53-2.43-4.11-2.07-6.01 c1.86-9.94,3.89-19.69,0.07-29.74C34.55,108.63,36.19,105.52,36.7,102.84c1.25-8.45,2.51-16.89,3.71-24.9 c-0.83-0.58-0.85-0.59-0.87-0.61c-0.03,0.16-0.07,0.32-0.09,0.48C38.53,86.15,37.62,94.5,36.7,102.84z';

option = {
    color: ['#bb0004', '#ccc'],
    xAxis: {
        data: [
            'symbolClip: true\nsymbolRepeat: false',
            'symbolClip: true\nsymbolRepeat: true',
            'symbolClip: false\nsymbolRepeat: true'
        ],
        axisTick: {
            show: false
        },
        axisLabel: {
            interval: 0
        }
    },
    yAxis: {
        max: 80,
        splitLine: {show: false}
    },
    series: [{
        // This series represents real value.
        type: 'pictorialBar',
        name: 'realValue',
        symbol: path,
        // 'real value' series should has higher z than 'background'
        // series.
        z: 10,
        // When there is another series used as the background of
        // this series, it is recommended that assign
        // symbolBoundingData the same value in 'realValue' series
        // and 'background' series.
        symbolBoundingData: 80,
        data: [{
            value: 40,
            symbolClip: true
        }, {
            value: 40,
            symbolSize: ['50%', '80%'],
            symbolClip: true,
            symbolRepeat: true
        }, {
            value: 40,
            symbolSize: ['50%', '80%'],
            symbolClip: false,
            symbolRepeat: true
        }]
    }, {
        // This series is used as background.
        type: 'pictorialBar',
        name: 'background',
        symbol: path,
        // When a series is used as background, it is recommended
        // that assign symbolBoundingData the same value in
        // 'realValue' series and 'background' series.
        symbolBoundingData: 80,
        label: {
            normal: {
                show: true,
                position: 'outside',
                formatter: 'value: {c}',
                textStyle: {
                    color: '#bb0004'
                }
            }
        },
        data: [{
            value: 40,
            // When a series is used as background and symbolClip
            // is used in 'realValue' series, it is recommended that
            // set animationDuration to be zero, which disables
            // initial aniation, and keeps update animation enabled.
            animationDuration: 0
        }, {
            value: 40,
            symbolSize: ['50%', '80%'],
            // When a series is used as background, it is
            // recommended that set symbolRepeat as 'fixed'.
            symbolRepeat: 'fixed',
            // When a series is used as background and symbolClip
            // is used in 'realValue' series, it is recommended that
            // set animationDuration to be zero, which disables
            // initial aniation, and keeps update animation enabled.
            animationDuration: 0
        }, {
            value: 40,
            symbolSize: ['50%', '80%'],
            // When a series is used as background, it is
            // recommended that set symbolRepeat as 'fixed'.
            symbolRepeat: 'fixed'
        }]
    }]
};