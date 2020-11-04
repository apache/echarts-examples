/*
title: Simple Story Transition
category: custom
titleCN: 极简场景变换示例
difficulty: 11
*/

const _global = {};
$.get(ROOT_PATH + '/data/asset/js/myTransform.js', function (aggregateJS) {
    (new Function(aggregateJS)).call(_global);

    $.get(ROOT_PATH + '/data/asset/data/life-expectancy-table.json', function (_rawData) {
        run(_rawData);
    });
});

let _optionList;

function run(_rawData) {
    echarts.registerTransform(_global.myTransform.aggregate);
    echarts.registerTransform(_global.myTransform.id);


    const COLORS = [
        '#37A2DA', '#e06343', '#37a354', '#b55dba', '#b5bd48', '#8378EA', '#96BFFF'
    ];
    const COUNTRY_A = 'Germany';
    const COUNTRY_B = 'France';
    const CONTENT_COLORS = {
        [COUNTRY_A]: '#37a354',
        [COUNTRY_B]: '#e06343'
    };
    const Z2 = {
        [COUNTRY_A]: 1,
        [COUNTRY_B]: 2
    }


    const ANIMATION_DURATION_UPDATE = 1000;
    const AXIS_NAME_STYLE = {
        nameGap: 25,
        nameTextStyle: {
            fontSize: 20
        },
    };


    const baseOption = {
        animationDurationUpdate: ANIMATION_DURATION_UPDATE,
        dataset: [{
            id: 'DatasetRaw',
            source: _rawData
        }, {
            id: 'DatasetRawWithId',
            fromDatasetId: 'DatasetRaw',
            transform: [{
                type: 'filter',
                config: {
                    dimension: 'Year', gte: 1950
                }
            }, {
                type: 'myTransform:id',
                config: {
                    dimensionIndex: 5,
                    dimensionName: 'Id'
                }
            }]
        }, {
            id: 'DatasetCountryAB',
            fromDatasetId: 'DatasetRawWithId',
            transform: {
                type: 'filter',
                config: {
                    or: [{
                        dimension: 'Country', '=': COUNTRY_A
                    }, {
                        dimension: 'Country', '=': COUNTRY_B
                    }]
                }
            }
        }, {
            id: 'DatasetCountryABSumIncome',
            fromDatasetId: 'DatasetCountryAB',
            transform: {
                type: 'myTransform:aggregate',
                config: {
                    resultDimensions: [
                        { from: 'Income', method: 'sum' },
                        { from: 'Country' }
                    ],
                    groupBy: 'Country'
                }
            }
        }],
        tooltip: {}
    };



    const optionCreators = {

        'Option_CountryAB_Year_Income_Bar': function (datasetId, specifiedCountry) {
            return {
                xAxis: {
                    type: 'category',
                    nameLocation: 'middle'
                },
                yAxis: {
                    name: 'Income',
                    ...AXIS_NAME_STYLE
                },
                series: {
                    type: 'custom',
                    coordinateSystem: 'cartesian2d',
                    datasetId: datasetId,
                    encode: {
                        x: 'Year',
                        y: 'Income',
                        itemName: 'Year',
                        tooltip: ['Income'],
                    },
                    renderItem: function (params, api) {
                        const valPos = api.coord([api.value('Year'), api.value('Income')]);
                        const basePos = api.coord([api.value('Year'), 0]);
                        const width = api.size([1, 0])[0] * 0.9;

                        const country = api.value('Country');
                        if (specifiedCountry != null && specifiedCountry !== country) {
                            return;
                        }

                        return {
                            type: 'group',
                            children: [{
                                type: 'rect',
                                transition: ['shape', 'style'],
                                morph: true,
                                shape: {
                                    x: basePos[0],
                                    y: basePos[1],
                                    width: width,
                                    height: valPos[1] - basePos[1]
                                },
                                z2: Z2[country],
                                style: {
                                    fill: CONTENT_COLORS[country],
                                    opacity: 0.8
                                }
                            }]
                        };
                    }
                }
            };
        },

        'Option_CountryAB_Year_Population_Bar': function (datasetId, specifiedCountry) {
            return {
                xAxis: {
                    type: 'category',
                    nameLocation: 'middle'
                },
                yAxis: {
                    name: 'Population',
                    ...AXIS_NAME_STYLE
                },
                series: {
                    type: 'custom',
                    coordinateSystem: 'cartesian2d',
                    datasetId: datasetId,
                    encode: {
                        x: 'Year',
                        y: 'Population',
                        itemName: 'Year',
                        tooltip: ['Population'],
                    },
                    renderItem: function (params, api) {
                        const valPos = api.coord([api.value('Year'), api.value('Population')]);
                        const basePos = api.coord([api.value('Year'), 0]);
                        const width = api.size([1, 0])[0] * 0.9;

                        const country = api.value('Country');
                        if (specifiedCountry != null && specifiedCountry !== country) {
                            return;
                        }

                        return {
                            type: 'group',
                            children: [{
                                type: 'rect',
                                transition: ['shape', 'style'],
                                morph: true,
                                shape: {
                                    x: basePos[0],
                                    y: basePos[1],
                                    width: width,
                                    height: valPos[1] - basePos[1]
                                },
                                style: {
                                    fill: CONTENT_COLORS[country]
                                }
                            }]
                        };
                    }
                }
            };
        },

        'Option_CountryAB_Income_Population_Scatter': function (datasetId, specifiedCountry) {
            return {
                xAxis: {
                    name: 'Income',
                    ...AXIS_NAME_STYLE,
                    scale: true,
                    nameLocation: 'middle'
                },
                yAxis: {
                    name: 'Population',
                    ...AXIS_NAME_STYLE,
                    scale: true
                },
                series: {
                    type: 'custom',
                    coordinateSystem: 'cartesian2d',
                    datasetId: datasetId,
                    encode: {
                        x: 'Income',
                        y: 'Population',
                        itemName: ['Year'],
                        tooltip: ['Income', 'Population', 'Country']
                    },
                    renderItem: function (params, api) {
                        const pos = api.coord([api.value('Income'), api.value('Population')]);

                        const country = api.value('Country');
                        if (specifiedCountry != null && specifiedCountry !== country) {
                            return;
                        }

                        return {
                            type: 'group',
                            children: [{
                                type: 'circle',
                                transition: ['shape', 'style'],
                                morph: true,
                                shape: {
                                    cx: pos[0],
                                    cy: pos[1],
                                    r: 10
                                },
                                style: {
                                    fill: CONTENT_COLORS[country],
                                    lineWidth: 1,
                                    stroke: '#333',
                                    opacity: 1,
                                    enterFrom: {
                                        opacity: 0
                                    }
                                }
                            }]
                        };
                    }
                }
            };
        },

        'Option_CountryAB_Income_Sum_Bar': function (datasetId) {
            return {
                xAxis: {
                    name: 'Income',
                    ...AXIS_NAME_STYLE,
                    nameLocation: 'middle'
                },
                yAxis: {
                    type: 'category'
                },
                series: {
                    type: 'custom',
                    coordinateSystem: 'cartesian2d',
                    datasetId: datasetId,
                    encode: {
                        x: 'Income',
                        y: 'Country',
                        itemName: ['Country'],
                        tooltip: ['Income']
                    },
                    renderItem: function (params, api) {
                        const country = api.ordinalRawValue('Country');
                        const valPos = api.coord([api.value('Income'), country]);
                        const basePos = api.coord([0, country]);
                        const height = api.size([0, 1])[1] * 0.4;

                        return {
                            type: 'group',
                            children: [{
                                type: 'rect',
                                transition: ['shape', 'style'],
                                morph: true,
                                shape: {
                                    x: basePos[0],
                                    y: valPos[1] - height / 2,
                                    width: valPos[0] - basePos[0],
                                    height: height
                                },
                                style: {
                                    fill: CONTENT_COLORS[country]
                                }
                            }]
                        };
                    }
                }
            };
        }

    };

    _optionList = [{
        backwardTransitionOpt: {
            from: { dimension: 'Id', seriesIndex: 0 },
            to: { dimension: 'Id', seriesIndex: 0 }
        },
        option: optionCreators['Option_CountryAB_Year_Income_Bar']('DatasetCountryAB', COUNTRY_A)
    }, {
        backwardTransitionOpt: {
            from: { dimension: 'Id', seriesIndex: 0 },
            to: { dimension: 'Id', seriesIndex: 0 }
        },
        forwardTransitionOpt: {
            from: { dimension: 'Id', seriesIndex: 0 },
            to: { dimension: 'Id', seriesIndex: 0 }
        },
        option: optionCreators['Option_CountryAB_Year_Population_Bar']('DatasetCountryAB', COUNTRY_A)
    }, {
        backwardTransitionOpt: {
            from: { dimension: 'Id', seriesIndex: 0 },
            to: { dimension: 'Id', seriesIndex: 0 }
        },
        forwardTransitionOpt: {
            from: { dimension: 'Id', seriesIndex: 0 },
            to: { dimension: 'Id', seriesIndex: 0 }
        },
        option: optionCreators['Option_CountryAB_Income_Population_Scatter']('DatasetCountryAB', COUNTRY_A)
    }, {
        backwardTransitionOpt: {
            from: { dimension: 'Country', seriesIndex: 0 },
            to: { dimension: 'Country', seriesIndex: 0 }
        },
        forwardTransitionOpt: {
            from: { dimension: 'Id', seriesIndex: 0 },
            to: { dimension: 'Id', seriesIndex: 0 }
        },
        option: optionCreators['Option_CountryAB_Income_Population_Scatter']('DatasetCountryAB')
    }, {
        backwardTransitionOpt: {
            from: { dimension: 'Country', seriesIndex: 0 },
            to: { dimension: 'Country', seriesIndex: 0 }
        },
        forwardTransitionOpt: {
            from: { dimension: 'Country', seriesIndex: 0 },
            to: { dimension: 'Country', seriesIndex: 0 }
        },
        option: optionCreators['Option_CountryAB_Income_Sum_Bar']('DatasetCountryABSumIncome')
    }, {
        forwardTransitionOpt: {
            from: { dimension: 'Country', seriesIndex: 0 },
            to: { dimension: 'Country', seriesIndex: 0 }
        },
        option: optionCreators['Option_CountryAB_Year_Income_Bar']('DatasetCountryAB')
    }];


    myChart.setOption(baseOption, { lazyMode: true });

    // Initialize state
    myChart.setOption(_optionList[currentOptionIndex].option);
}

let currentOptionIndex = 0;
app.config = {
    'Next': function () {
        if (!_optionList || currentOptionIndex >= _optionList.length - 1) {
            return;
        }
        const optionWrap = _optionList[++currentOptionIndex];
        myChart.setOption(optionWrap.option, {
            replaceMerge: ['xAxis', 'yAxis'],
            transition: optionWrap.forwardTransitionOpt
        });
    },

    'Previous': function () {
        if (!_optionList || currentOptionIndex <= 0) {
            return;
        }
        const optionWrap = _optionList[--currentOptionIndex];
        myChart.setOption(optionWrap.option, {
            replaceMerge: ['xAxis', 'yAxis'],
            transition: optionWrap.backwardTransitionOpt
        });
    }
}
