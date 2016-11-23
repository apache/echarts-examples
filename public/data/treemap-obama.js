myChart.showLoading();

var household_america_2012 = 113616229;
$.get('data/asset/data/obama_budget_proposal_2012.json', function (obama_budget_2012) {
    myChart.hideLoading();

    var formatUtil;

    function buildData(mode, originList) {
        var out = [];

        for (var i = 0; i < originList.length; i++) {
            var node = originList[i];
            var newNode = out[i] = cloneNodeInfo(node);
            var value = newNode.value;

            if (!newNode) {
                continue;
            }

            // Calculate amount per household.
            value[3] = value[0] / household_america_2012;

            // if mode === 0 and mode === 2 do nothing
            if (mode === 1) {
                // Set 'Change from 2010' to value[0].
                var tmp = value[1];
                value[1] = value[0];
                value[0] = tmp;
            }

            if (node.children) {
                newNode.children = buildData(mode, node.children);
            }
        }

        return out;
    }

    function cloneNodeInfo(node) {
        if (!node) {
            return;
        }

        var newNode = {};
        newNode.name = node.name;
        newNode.id = node.id;
        newNode.discretion = node.discretion;
        newNode.value = (node.value || []).slice();
        return newNode;
    }

    function getLevelOption(mode) {
        return [
            {
                color: mode === 2
                    ? [
                        '#c23531', '#314656', '#61a0a8', '#dd8668',
                        '#91c7ae', '#6e7074', '#61a0a8', '#bda29a',
                        '#44525d', '#c4ccd3'
                    ]
                    : null,
                colorMappingBy: 'id',
                itemStyle: {
                    normal: {
                        borderWidth: 3,
                        gapWidth: 3
                    }
                }
            },
            {
                colorAlpha: mode === 2
                    ? [0.5, 1] : null,
                itemStyle: {
                    normal: {
                        gapWidth: 1
                    }
                }
            }
        ];
    }

    function isValidNumber(num) {
        return num != null && isFinite(num);
    }

    function getTooltipFormatter(mode) {
        var amountIndex = mode === 1 ? 1 : 0;
        var amountIndex2011 = mode === 1 ? 0 : 1;

        return function (info) {
            var value = info.value;

            var amount = value[amountIndex];
            amount = isValidNumber(amount)
                ? formatUtil.addCommas(amount * 1000) + '$'
                : '-';

            var amount2011 = value[amountIndex2011];
            amount2011 = isValidNumber(amount2011)
                ? formatUtil.addCommas(amount2011 * 1000) + '$'
                : '-';

            var perHousehold = value[3];
            perHousehold = isValidNumber(perHousehold)
                ? formatUtil.addCommas((+perHousehold.toFixed(4)) * 1000) + '$'
                : '-';

            var change = value[2];
            change = isValidNumber(change)
                ? change.toFixed(2) + '%'
                : '-';

            return [
                '<div class="tooltip-title">' + formatUtil.encodeHTML(info.name) + '</div>',
                '2012 Amount: &nbsp;&nbsp;' + amount + '<br>',
                'Per Household: &nbsp;&nbsp;' + perHousehold + '<br>',
                '2011 Amount: &nbsp;&nbsp;' + amount2011 + '<br>',
                'Change From 2011: &nbsp;&nbsp;' + change
            ].join('');
        };
    }

    function createSeriesCommon() {
        return {
            type: 'treemap',
            label: {
                show: true,
                formatter: "{b}",
                normal: {
                    textStyle: {
                        ellipsis: true
                    }
                }
            },
            itemStyle: {
                normal: {
                    borderColor: 'black'
                }
            },
            levels: getLevelOption(0)
        };
    }

    formatUtil = echarts.format;
    var modes = ['2012Budget', '2011Budget', 'Growth'];

    myChart.setOption(option = {
        title: {
            left: 'center',
            text: 'How $3.7 Trillion is Spent',
            subtext: 'Obama’s 2012 Budget Proposal'
        },

        legend: {
            data: modes,
            selectedMode: 'single',
            top: 50,
            itemGap: 5
        },

        tooltip: {
            formatter: getTooltipFormatter(0)
        },

        series: modes.map(function (mode, idx) {
            var seriesOpt = createSeriesCommon();
            seriesOpt.name = mode;
            seriesOpt.top = 80;
            seriesOpt.visualDimension = idx === 2 ? 2 : null;
            seriesOpt.data = buildData(idx, obama_budget_2012);
            seriesOpt.levels = getLevelOption(idx);
            return seriesOpt;
        })
    });
});