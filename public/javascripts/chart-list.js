var CHART_TYPES = {
    line: 'Line',
    bar: 'Bar',
    pie: 'Pie',
    scatter: 'Scatter',
    map: 'Map',
    candlestick: 'Candlestick',
    radar: 'Radar',
    boxplot: 'Boxplot',
    heatmap: 'Heatmap',
    graph: 'Graph',
    tree: 'Tree',
    treemap: 'Treemap',
    sunburst: 'Sunburst',
    parallel: 'Parallel',
    sankey: 'Sankey',
    funnel: 'Funnel',
    gauge: 'Gauge',
    pictorialBar: 'PictorialBar',
    themeRiver: 'ThemeRiver',
    calendar: 'Calendar',
    custom: 'Custom',

    globe: '3D Globe',
    bar3D: '3D Bar',
    scatter3D: '3D Scatter',
    surface: '3D Surface',
    map3D: '3D Map',
    lines3D: '3D Lines',
    line3D: '3D Line',
    scatterGL: 'Scatter GL',
    linesGL: 'Lines GL',
    flowGL: 'Flow GL',
    graphGL: 'Graph GL',

    geo3D: '3D Geo'
};

// Params parser
var params = {};
(location.search || '').substr(1).split('&').forEach(function (item) {
    var kv = item.split('=');
    params[kv[0]] = kv[1];
});

$('#theme .' + (params.theme || 'default')).addClass('selected');

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


    function addExamples(examples, isGL) {
        // load charts
        for (var eid = 0, elen = examples.length; eid < elen; ++eid) {
            // show title if exists
            var title = examples[eid].title || '未命名图表';

            // append dom element
            var $row = $('<div class="col-xl-2 col-lg-3 col-md-4 col-sm-6"></div>');
            var $chart = $('<div class="chart"></div>');
            $('#chart-row-' + examples[eid].category).append($row.append($chart));

            var hash = ['c=' + examples[eid].id];
            if (isGL) {
                hash.push('&gl=1');
            }
            if (params.theme) {
                hash.push('&theme=' + params.theme);
            }

            $link = $('<a class="chart-link" href="./editor.html?' + hash.join('&') + '"></a>');
            $chart.append($link);
            $link.append('<h4 class="chart-title">' + title + '</h4>');

            var themePostfix = (isGL || !params.theme) ? '' : ('-' + params.theme);

            // load chart image
            $chartArea = $('<img class="chart-area" src="images/placeholder.png" data-original="' + (isGL ? 'data-gl' : 'data') + '/thumb' + themePostfix + '/'
                + examples[eid].id + '.png" />');
            $link.append($chartArea);
        }
    }

    addExamples(EXAMPLES, false);
    addExamples(EXAMPLES_GL, true);

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

    $container.find('img.chart-area').lazyload();
});
