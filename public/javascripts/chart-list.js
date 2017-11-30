var EXAMPLES = [
    {
        id: 'area-rainfall',
        title: 'Rainfall and Water Flow',
        type: 'line'
    },  {
        id: 'area-simple',
        title: 'Area Chart',
        type: 'line'
    },  {
        id: 'area-stack',
        title: 'Stacked Area',
        type: 'line'
    },  {
        id: 'bar-animation-delay',
        title: 'Animation Delay on Bar Chart',
        type: 'bar'
    },  {
        id: 'bar-brush',
        title: 'Brush on Bar Chart',
        type: 'bar'
    },  {
        id: 'bar-gradient',
        title: 'Gradient, Shadow, Click Zoom',
        type: 'bar'
    },  {
        id: 'bar-negative',
        title: 'Negative Bar Chart',
        type: 'bar'
    },  {
        id: 'bar-negative2',
        title: 'Negative and Positive',
        type: 'bar'
    },  {
        id: 'bar-stack',
        title: 'Stacked Bar',
        type: 'bar'
    },  {
        id: 'bar-tick-align',
        title: 'Align between Ticks and Labels',
        type: 'bar'
    },  {
        id: 'bar-waterfall',
        title: 'Minimum Cost of Living in Shenzhen (RMB)',
        type: 'bar'
    },  {
        id: 'bar-waterfall2',
        title: 'Waterfall Chart',
        type: 'bar'
    },  {
        id: 'bar-y-category-stack',
        title: 'Stacked Bar Chart',
        type: 'bar'
    },  {
        id: 'bar-y-category',
        title: 'World Total Population',
        type: 'bar'
    },  {
        id: 'bar1',
        title: 'Rainfall and Evaporation',
        type: 'bar'
    },  {
        id: 'bar-polar-stack',
        title: 'Stacked Bar in Polar System',
        type: 'bar'
    },  {
        id: 'bar-polar-stack-radial',
        title: 'Stacked Bar in Polar System',
        type: 'bar'
    },  {
        id: 'bar-polar-real-estate',
        title: 'Real Estate',
        type: 'bar'
    },  {
        id: 'bar-label-rotation',
        title: 'Label Rotation',
        type: 'bar'
    },  {
        id: 'bar-rich-text',
        title: 'Rich Text',
        type: 'bar'
    },  {
        id: 'boxplot-light-velocity',
        title: 'Boxplot Light Velocity',
        type: 'boxplot'
    },  {
        id: 'boxplot-light-velocity2',
        title: 'Boxplot Light Velocity2',
        type: 'boxplot'
    },  {
        id: 'boxplot-multi',
        title: 'Multiple Categories',
        type: 'boxplot'
    },  {
        id: 'bubble-gradient',
        title: 'Bubble Chart',
        type: 'scatter'
    },  {
        id: 'candlestick-brush',
        title: 'Candlestick Brush',
        type: 'candlestick'
    },  {
        id: 'candlestick-sh-2015',
        title: 'ShangHai Index, 2015',
        type: 'candlestick'
    },  {
        id: 'candlestick-sh',
        title: 'ShangHai Index',
        type: 'candlestick'
    },  {
        id: 'candlestick-touch',
        title: 'Axis Pointer Link and Touch',
        type: 'candlestick'
    },  {
        id: 'custom-ohlc',
        title: 'OHLC Chart',
        type: 'candlestick'
    },  {
        id: 'confidence-band',
        title: 'Confidence Band',
        type: 'line'
    },  {
        id: 'dynamic-data',
        title: 'Dynamic Data',
        type: 'bar'
    },  {
        id: 'dynamic-data2',
        title: 'Dynamic Data + Time Axis',
        type: 'line'
    },  {
        id: 'effectScatter-bmap',
        title: 'Air Quality - Baidu Map',
        type: 'scatter'
    },  {
        id: 'effectScatter-map',
        title: 'Air Quality',
        type: 'scatter'
    },  {
        id: 'funnel-align',
        title: 'Funnel (align)',
        type: 'funnel'
    },  {
        id: 'funnel-customize',
        title: 'Customized Funnel',
        type: 'funnel'
    },  {
        id: 'funnel-mutiple',
        title: 'Multiple Funnels',
        type: 'funnel'
    },  {
        id: 'funnel',
        title: 'Funnel Chart',
        type: 'funnel'
    },  {
        id: 'gauge-car-dark',
        title: 'Gauge Car Dark',
        type: 'gauge'
    },  {
        id: 'gauge-car',
        title: 'Gauge Car',
        type: 'gauge'
    },  {
        id: 'gauge',
        title: 'Gauge',
        type: 'gauge'
    },  {
        id: 'geo-lines',
        title: 'Migration',
        type: 'map'
    },  {
        id: 'graph-circular-layout',
        title: 'Les Miserables',
        type: 'graph'
    },  {
        id: 'graph-force',
        title: 'Force Layout',
        type: 'graph'
    },  {
        id: 'graph-force2',
        title: 'Force Layout',
        type: 'graph'
    },  {
        id: 'graph-grid',
        title: 'Graph on Cartesian',
        type: 'graph'
    },  {
        id: 'graph-life-expectancy',
        title: 'Graph Life Expectancy',
        type: 'graph'
    },  {
        id: 'graph-npm',
        title: 'NPM Dependencies',
        type: 'graph'
    },  {
        id: 'graph-simple',
        title: 'Simple Graph',
        type: 'graph'
    },  {
        id: 'graph-webkit-dep',
        title: 'Graph Webkit Dep',
        type: 'graph'
    },  {
        id: 'graph',
        title: 'Les Miserables',
        type: 'graph'
    },  {
        id: 'graph-force-dynamic',
        title: 'Graph Dynamic',
        type: 'graph'
    },  {
        id: 'grid-multiple',
        title: 'Rainfall and Water Flow',
        type: 'line'
    },  {
        id: 'heatmap-bmap',
        title: 'Heatmap on Baidu Map Extension',
        type: 'heatmap'
    },  {
        id: 'heatmap-cartesian',
        title: 'Heatmap on Cartesian',
        type: 'heatmap'
    },  {
        id: 'heatmap-large-piecewise',
        title: 'Heatmap - Discrete Mapping of Color',
        type: 'heatmap'
    },  {
        id: 'heatmap-large',
        title: 'Heatmap - 2w data',
        type: 'heatmap'
    },  {
        id: 'heatmap-map',
        title: 'Air Qulity',
        type: 'heatmap'
    },  {
        id: 'line-aqi',
        title: 'Beijing AQI',
        type: 'line'
    },  {
        id: 'line-draggable',
        title: 'Try Dragging these Points',
        type: 'line'
    },  {
        id: 'line-easing',
        title: 'Line Easing',
        type: 'line'
    },  {
        id: 'line-log',
        title: 'Log Axis',
        type: 'line'
    },  {
        id: 'line-marker',
        title: 'Temperature Change in the coming week',
        type: 'line'
    },  {
        id: 'line-pen',
        title: 'Click to Add Points',
        type: 'line'
    },  {
        id: 'line-polar',
        title: 'Two Value-Axes in Polar',
        type: 'line'
    },  {
        id: 'line-polar2',
        title: 'Two Value-Axes in Polar',
        type: 'line'
    },  {
        id: 'line-sections',
        title: 'Distribution of Electricity',
        type: 'line'
    },  {
        id: 'line-stack',
        title: 'Stacked Line Chart',
        type: 'line'
    },  {
        id: 'line-step',
        title: 'Step Line',
        type: 'line'
    },  {
        id: 'line-y-category',
        title: 'Line Y Category',
        type: 'line'
    },  {
        id: 'multiple-x-axis',
        title: 'Multiple X Axes',
        type: 'line'
    },  {
        id: 'line-tooltip-touch',
        title: 'Tooltip and DataZoom on Mobile',
        type: 'line'
    },  {
        id: 'line-gradient',
        title: 'Line Gradient',
        type: 'line'
    },  {
        id: 'lines-airline',
        title: '65k+ Airline',
        type: 'map'
    },  {
        id: 'lines-bmap-bus',
        title: 'Bus Lines of Beijing - Baidu Map',
        type: 'map'
    },  {
        id: 'lines-bmap-effect',
        title: 'Bus Lines of Beijing - Line Effect',
        type: 'map'
    },  {
        id: 'lines-bmap',
        title: 'A Hiking Trail in Hangzhou - Baidu Map',
        type: 'map'
    },  {
        id: 'map-china-dataRange',
        title: 'Sales of iphone',
        type: 'map'
    },  {
        id: 'map-china',
        title: 'Map China',
        type: 'map'
    },  {
        id: 'map-HK',
        title: 'Population Density of HongKong (2011)',
        type: 'map'
    },  {
        id: 'map-locate',
        title: 'Map Locate',
        type: 'map'
    },  {
        id: 'geo-map-scatter',
        title: 'map and scatter share a geo',
        type: 'map'
    },  {
        id: 'map-parallel-prices',
        title: 'Prices and Earnings 2012',
        type: 'scatter'
    },  {
        id: 'map-province',
        title: 'Switch among 34 Provinces',
        type: 'map'
    },  {
        id: 'map-usa',
        title: 'USA Population Estimates (2012)',
        type: 'map'
    },  {
        id: 'map-world-dataRange',
        title: 'World Population (2010)',
        type: 'map'
    },  {
        id: 'map-world',
        title: 'Map World',
        type: 'map'
    },  {
        id: 'map-polygon',
        title: 'Draw Polygon on Map',
        type: 'map'
    },  {
        id: 'map-bin',
        title: 'Binning on Map',
        type: 'map'
    },  {
        id: 'map-labels',
        title: 'Rich Text Labels on Map',
        type: 'map'
    },  {
        id: 'mix-line-bar',
        title: 'Mixed Line and Bar',
        type: 'bar'
    },  {
        id: 'mix-timeline-finance',
        title: 'Finance Indices 2002',
        type: 'bar'
    },  {
        id: 'mix-zoom-on-value',
        title: 'Mix Zoom On Value',
        type: 'bar'
    },  {
        id: 'multiple-y-axis',
        title: 'Multiple Y Axes',
        type: 'bar'
    },  {
        id: 'parallel-aqi',
        title: 'Parallel Aqi',
        type: 'parallel'
    },  {
        id: 'parallel-nutrients',
        title: 'Parallel Nutrients',
        type: 'parallel'
    },  {
        id: 'map-parallel-prices',
        title: 'Prices and Earnings 2012',
        type: 'parallel'
    },  {
        id: 'pie-custom',
        title: 'Customized Pie',
        type: 'pie'
    },  {
        id: 'pie-doughnut',
        title: 'Doughnut Chart',
        type: 'pie'
    },  {
        id: 'pie-nest',
        title: 'Nested Pies',
        type: 'pie'
    },  {
        id: 'pie-pattern',
        title: 'Texture on Pie Chart',
        type: 'pie'
    },  {
        id: 'pie-roseType',
        title: 'Nightingale\'s Rose Diagram',
        type: 'pie'
    },  {
        id: 'pie-simple',
        title: 'Referer of a website',
        type: 'pie'
    },  {
        id: 'pie-rich-text',
        title: 'Pie Special Label',
        type: 'pie'
    },  {
        id: 'pie-legend',
        title: 'Pie with Scrollable Legend',
        type: 'pie'
    },  {
        id: 'radar-aqi',
        title: 'AQI - Radar Chart',
        type: 'radar'
    },  {
        id: 'radar-custom',
        title: 'Customized Radar Chart',
        type: 'radar'
    },  {
        id: 'radar-multiple',
        title: 'Multiple Radar',
        type: 'radar'
    },  {
        id: 'radar',
        title: 'Basic Radar Chart',
        type: 'radar'
    },  {
        id: 'radar2',
        title: 'Proportion of Browsers',
        type: 'radar'
    },  {
        id: 'sankey-energy',
        title: 'Sankey Diagram',
        type: 'sankey'
    },  {
        id: 'sankey-product',
        title: 'Sankey Diagram',
        type: 'sankey'
    },  {
        id: 'scatter-anscombe-quartet',
        title: 'Anscombe&#39;s quartet',
        type: 'scatter'
    },  {
        id: 'scatter-aqi-color',
        title: 'Scatter Aqi Color',
        type: 'scatter'
    },  {
        id: 'scatter-large',
        title: 'Large Scatter',
        type: 'scatter'
    },  {
        id: 'scatter-life-expectancy-timeline',
        title: 'Life Expectancy and GDP',
        type: 'scatter'
    },  {
        id: 'scatter-map-brush',
        title: 'Scatter Map Brush',
        type: 'scatter'
    },  {
        id: 'scatter-map',
        title: 'Air Quality',
        type: 'scatter'
    },  {
        id: 'scatter-matrix',
        title: 'Scatter Matrix',
        type: 'parallel'
    },  {
        id: 'scatter-nutrients',
        title: 'Scatter Nutrients',
        type: 'scatter'
    },  {
        id: 'scatter-painter-choice',
        title: 'Master Painter Color Choices Throughout History',
        type: 'scatter'
    },  {
        id: 'scatter-polar-punchCard',
        title: 'Punch Card of Github',
        type: 'scatter'
    },  {
        id: 'scatter-punchCard',
        title: 'Punch Card of Github',
        type: 'scatter'
    },  {
        id: 'scatter-single-axis',
        title: 'Scatter on Single Axis',
        type: 'scatter'
    },  {
        id: 'scatter-weibo',
        title: 'Sign in of weibo',
        type: 'scatter'
    },  {
        id: 'scatter-weight',
        title: 'Distribution of Height and Weight',
        type: 'scatter'
    },  {
        id: 'scatter-world-population',
        title: 'World Population (2011)',
        type: 'scatter'
    },  {
        id: 'scatter-nutrients-matrix',
        title: 'Scatter Nutrients Matrix',
        type: 'scatter'
    },  {
        id: 'scatter-clustering-process',
        title: 'Clustering Process',
        type: 'scatter'
    },  {
        id: 'scatter-linear-regression',
        title: 'Linear Regression',
        type: 'scatter'
    },  {
        id: 'scatter-exponential-regression',
        title: 'Exponential Regression',
        type: 'scatter'
    },  {
        id: 'scatter-logarithmic-regression',
        title: 'Logarithmic Regression',
        type: 'scatter'
    },  {
        id: 'scatter-polynomial-regression',
        title: 'Polynomial Regression',
        type: 'scatter'
    }, {
        id: 'tree-basic',
        title: 'Basic Tree',
        type: 'tree'
    }, {
        id: 'tree-vertical',
        title: 'Vertical Tree',
        type: 'tree'
    }, {
        id: 'tree-legend',
        title: 'Multiple Trees',
        type: 'tree'
    }, {
        id: 'tree-radial',
        title: 'Radial Tree',
        type: 'tree'
    },  {
        id: 'treemap-disk',
        title: 'Disk Usage',
        type: 'treemap'
    },  {
        id: 'treemap-drill-down',
        title: 'ECharts Option Query',
        type: 'treemap'
    },  {
        id: 'treemap-obama',
        title: 'How $3.7 Trillion is Spent',
        type: 'treemap'
    },  {
        id: 'treemap-visual',
        title: 'Gradient Mapping',
        type: 'treemap'
    },  {
        id: 'treemap-show-parent',
        title: 'Show Parent Labels',
        type: 'treemap'
    },  {
        id: 'watermark',
        title: 'Watermark - ECharts Download',
        type: 'bar'
    },  {
        id: 'bar-histogram',
        title: 'Histogram',
        type: 'bar'
    }, {
        id: 'pictorialBar-hill',
        title: 'Wish List and Mountain Height',
        type: 'pictorialBar'
    }, {
        id: 'pictorialBar-velocity',
        title: 'Velocity of Christmas Reindeers',
        type: 'pictorialBar'
    }, {
        id: 'pictorialBar-vehicle',
        title: 'Vehicles',
        type: 'pictorialBar'
    }, {
        id: 'pictorialBar-spirit',
        title: 'Spirits',
        type: 'pictorialBar'
    }, {
        id: 'pictorialBar-body-fill',
        title: 'Water Content',
        type: 'pictorialBar'
    }, {
        id: 'pictorialBar-dotted',
        title: 'Dotted bar',
        type: 'pictorialBar'
    }, {
        id: 'pictorialBar-forest',
        title: 'Expansion of forest',
        type: 'pictorialBar'
    }, {
        id: 'themeRiver-basic',
        title: 'ThemeRiver',
        type: 'themeRiver'
    }, {
        id: 'themeRiver-lastfm',
        title: 'ThemeRiver Lastfm',
        type: 'themeRiver'
    }, {
        id: 'calendar-graph',
        title: 'Calendar Graph',
        type: 'graph'
    }, {
        id: 'calendar-pie',
        title: 'Calendar Pie',
        type: 'calendar'
    }, {
        id: 'calendar-effectscatter',
        title: 'Calendar Effectscatter',
        type: 'scatter'
    }, {
        id: 'calendar-vertical',
        title: 'Calendar Heatmap Vertical',
        type: 'heatmap'
    }, {
        id: 'calendar-horizontal',
        title: 'Calendar Heatmap Horizontal',
        type: 'heatmap'
    }, {
        id: 'calendar-effectscatter',
        title: 'Calendar Effectscatter',
        type: 'calendar'
    }, {
        id: 'calendar-vertical',
        title: 'Calendar Heatmap Vertical',
        type: 'calendar'
    }, {
        id: 'calendar-horizontal',
        title: 'Calendar Heatmap Horizontal',
        type: 'calendar'
    }, {
        id: 'calendar-charts',
        title: 'Calendar Charts',
        type: 'calendar'
    }, {
        id: 'calendar-lunar',
        title: 'Calendar Lunar',
        type: 'calendar'
    }, {
        id: 'custom-profile',
        title: 'Profile',
        type: 'custom'
    }, {
        id: 'custom-error-bar',
        title: 'Error Bar on Catesian',
        type: 'custom'
    }, {
        id: 'custom-error-scatter',
        title: 'Error Scatter on Catesian',
        type: 'custom'
    }, {
        id: 'custom-bar-trend',
        title: 'Custom Bar Trend',
        type: 'custom'
    }, {
        id: 'custom-polar-heatmap',
        title: 'Polar Heatmap',
        type: 'custom'
    }, {
        id: 'custom-profit',
        title: 'Profit',
        type: 'custom'
    }, {
        id: 'custom-calendar-icon',
        title: 'Custom Calendar Icon',
        type: 'custom'
    }, {
        id: 'custom-hexbin',
        title: 'Hexagonal Binning',
        type: 'custom'
    }, {
        id: 'wind-barb',
        title: 'Wind Barb',
        type: 'custom'
    }, {
        id: 'cycle-plot',
        title: 'Cycle Plot',
        type: 'custom'
    }
];

var CHART_TYPES = {
    scatter: 'Scatter',
    line: 'Line',
    bar: 'Bar',
    map: 'Map',
    pie: 'Pie',
    radar: 'Radar',
    candlestick: 'Candlestick',
    boxplot: 'Boxplot',
    heatmap: 'Heatmap',
    graph: 'Graph',
    tree: 'Tree',
    treemap: 'Treemap',
    parallel: 'Parallel',
    sankey: 'Sankey',
    funnel: 'Funnel',
    gauge: 'Gauge',
    pictorialBar: 'PictorialBar',
    themeRiver: 'ThemeRiver',
    calendar: 'Calendar',
    custom: 'Custom'
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
