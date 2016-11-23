var EXAMPLES = [
    /** for: ${examples} as ${example}, ${idx} */{
        id: '${example.id}',
        title: '${example.title}',
        type: '${example.type}'
    }/** if: ${idx} < ${examples}.length-1 */, /** /if */ /** /for */
];

var CHART_TYPES = {
    scatter: '散点图',
    line: '折线图',
    bar: '柱状图',
    map: '地图',
    pie: '饼图',
    radar: '雷达图',
    candlestick: 'k线图',
    boxplot: '箱线图',
    heatmap: '热力图',
    graph: '关系图',
    treemap: '矩形树图',
    parallel: '平行坐标',
    sankey: '桑基图',
    funnel: '漏斗图',
    gauge: '仪表盘'
};

var charts = [];

$(document).ready(function() {

    // chart type as category
    var $container = $('#explore-container .chart-list-panel');
    var $nav = $('#left-chart-nav ul');
    for (var type in CHART_TYPES) {
        $container.append('<h3 class="chart-type-head" id="chart-type-'
            + type + '">' + CHART_TYPES[type] + '</h3>')
            .append('<div class="row" id="chart-row-' + type + '"></div>');
        $nav.append($('<li>').append(
            '<a class="left-chart-nav-link" id="left-chart-nav-' + type + '" '
            + 'href="#chart-type-' + type + '">'
                + '<div class="chart-icon"></div>'
                + '<div class="chart-name">' + CHART_TYPES[type] + '</div>'
            + '</a>'));
    }

    // load charts
    for (var eid = 0, elen = EXAMPLES.length; eid < elen; ++eid) {
        // show title if exists
        var title = EXAMPLES[eid].title || '未命名图表';

        // append dom element
        var $row = $('<div class="col-lg-3 col-md-4 col-sm-6"></div>');
        var $chart = $('<div class="chart"></div>');
        $('#chart-row-' + EXAMPLES[eid].type).append($row.append($chart));

        $link = $('<a class="chart-link" href="./editor.html?c='
            + EXAMPLES[eid].id + '"></a>');
        $chart.append($link);
        $link.append('<h4 class="chart-title">' + title + '</h4>');

        // load chart image
        $chartArea = $('<img class="chart-area" src="data/thumb/'
            + EXAMPLES[eid].id + '.png" />');
        $link.append($chartArea);
    }

    // chart nav highlighting as scrolling
    var waypoints = $('.chart-type-head').waypoint(function (direction) {
        var names = this.element.id.split('-');
        if (names.length === 3) {
            $('#left-chart-nav li').removeClass('active');
            $('#left-chart-nav-' + names[2]).parent('li').addClass('active');
        }
    }, {
        offset: 70
    });

    window.addEventListener('hashchange', function () {
        // move window down at the height of navbar so that title will not
        // be hidden when goes to hash tag
        scrollBy(0, -80);

        // changes highlighting as hash tag changes
        var names = location.hash.split('-');
        if (names.length === 3) {
            $('#left-chart-nav li').removeClass('active');
            $('#left-chart-nav-' + names[2]).parent('li').addClass('active');
        }
    });

    // highlight the first chart in chart navbar
    $('#left-chart-nav li').first().addClass('active');

});
