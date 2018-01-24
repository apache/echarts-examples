var lang = ({
    cn: {
        errorInEditor: '编辑器内容有误！',
        chartOK: '图表已生成, '
    },
    en: {
        errorInEditor: 'Errors exist in code!',
        chartOK: 'Chart has been generated successfully, '
    }
})[window.EC_DEMO_LANG];



var configs = {};
var lnTools = ace.require('ace/ext/language_tools');

var keywords = {"grid": 108210,"series": 1161721,"pie": 173151,"legend": 278319,"right": 12224,"tooltip": 188049,"xAxis": 374619,"bar": 182040,"label": 163527,"emphasis": 50000,"formatter": 62138,"line": 306801,"data": 232156,"left": 24464,"top": 18094,"scatter": 48954,"type": 92134,"yAxis": 238764,"axisLabel": 73604,"legendHoverLink": 14243,"textStyle": 129159,"hoverAnimation": 9062,"dataZoom": 90999,"nameLocation": 15800,"nameTextStyle": 30596,"nameGap": 14640,"singleAxis": 15977,"splitLine": 30047,"nameRotate": 10483,"inverse": 12997,"boundaryGap": 18533,"clockwise": 4411,"lineStyle": 81857,"selectedOffset": 2984,"width": 17962,"slider": 28321,"dataBackground": 2287,"areaStyle": 19428,"color": 94439,"height": 7954,"orient": 17218,"align": 10373,"symbol": 35613,"xAxisIndex": 15405,"stack": 10602,"clipOverflow": 3229,"center": 9827,"padding": 12855,"itemStyle": 143518,"itemGap": 11914,"shadowBlur": 17233,"shadowColor": 13929,"normal": 211293,"borderColor": 20648,"shadowOffsetX": 11499,"shadowOffsetY": 9210,"opacity": 12301,"heatmap": 13825,"value": 21111,"fillerColor": 797,"borderWidth": 15576,"itemWidth": 7123,"effectScatter": 31179,"coordinateSystem": 15302,"axisLine": 53628,"axisTick": 38765,"selectedMode": 15177,"fontSize": 14906,"inactiveColor": 5720,"selected": 10921,"gauge": 55176,"markLine": 65539,"handleStyle": 1852,"borderType": 5717,"title": 158568,"show": 82000,"length": 4814,"zlevel": 22293,"labelPrecision": 746,"position": 48349,"labelFormatter": 727,"alignWithLabel": 3785,"interval": 28810,"showDetail": 694,"yAxisIndex": 10560,"showDataShadow": 591,"realtime": 2611,"onZero": 3690,"silent": 22883,"radar": 61070,"axisPointer": 23175,"trigger": 15344,"barCategoryGap": 3511,"splitNumber": 19992,"inside": 32482,"name": 61072,"showSymbol": 4778,"containLabel": 6413,"offset": 15619,"max": 12538,"backgroundColor": 32864,"visualMap": 95262,"fontStyle": 14443,"fontWeight": 11970,"fontFamily": 10141,"symbolSize": 21077,"blurSize": 360,"geo": 65283,"radius": 8533,"markArea": 19906,"map": 102385,"brush": 29508,"parallel": 20673,"parallelAxis": 13713,"gridIndex": 20650,"piecewise": 25231,"showContent": 6960,"zoom": 3997,"polar": 23175,"controller": 2892,"radiusAxis": 24146,"angleAxis": 18771,"toolbox": 101543,"timeline": 34619,"precision": 3306,"curveness": 1378,"x": 2753,"valueIndex": 2807,"itemHeight": 5180,"icon": 10336,"valueDim": 2013,"symbolOffset": 10017,"y": 1590,"transitionDuration": 3814,"radarIndex": 715,"extraCssText": 3640,"animation": 17864,"animationThreshold = 2000": 11727,"minInterval": 11278,"animationDelay": 7620,"layoutCenter": 2348,"animationDurationUpdate": 6972,"animationEasingUpdate": 6816,"animationDelayUpdate": 6642,"symbolRotate": 10221,"feature": 50238,"axis": 1794,"crossStyle": 1830,"funnel": 11042,"scaleLimit": 4792,"roam": 7112,"itemSize": 1966,"showTitle": 1851,"smooth": 5185,"saveAsImage": 9915,"showAllSymbol": 3417,"polarIndex": 5235,"graph": 76898,"layout": 2633,"excludeComponents": 447,"restore": 3693,"dataView": 10258,"magicType": 10505,"iconStyle": 9088,"nodeScaleRatio": 892,"hoverLayerThreshold": 6480,"textAlign": 9402,"splitArea": 16447,"nameMap": 4584,"text": 11691,"pixelRatio": 357,"readOnly": 491,"optionToContent": 936,"lang": 549,"textareaColor": 233,"textareaBorderColor": 177,"option": 2003,"seriesIndex": 4483,"back": 199,"rect": 323,"polygon": 254,"min": 16646,"scale": 14303,"logBase": 7456,"start": 2889,"z": 15867,"link": 5348,"textBaseline": 4210,"subtext": 5086,"sublink": 2618,"subtarget": 2373,"subtextStyle": 7732,"triggerEvent": 9175,"blendMode": 6359,"progressiveThreshold": 4699,"continuous": 42105,"lines": 31608,"markPoint": 81254,"roseType": 4221,"animationEasing": 8836,"animationDuration": 9562,"calculable": 3953,"progressive": 5761,"treemap": 16948,"links": 9573,"edgeSymbol": 1211,"bottom": 13969,"edges": 1122,"edgeLabel": 1685,"edgeSymbolSize": 769,"focusNodeAdjacency": 888,"draggable": 965,"force": 5601,"geoIndex": 2856,"circular": 1862,"avoidLabelOverlap": 3694,"target": 5476,"coord": 3995,"startValue": 2182,"triggerOn": 6741,"showDelay": 3535,"alwaysShowContent": 4928,"enterable": 3871,"hideDelay": 3018,"step": 3437,"detail": 5434,"startAngle": 5421,"handleIcon": 1051,"handleSize": 932,"zoomLock": 1979,"throttle": 1757,"boxplot": 6233,"candlestick": 14005,"sankey": 10101,"loop": 678,"rewind": 439,"controlStyle": 1269,"labelLine": 17838,"distance": 452,"rotate": 4666,"margin": 4342,"barWidth": 6641,"category": 1318,"barGap": 4832,"nodes": 2085,"pieces": 2683,"smoothMonotone": 2203,"itemSymbol": 882,"axisType": 902,"currentIndex": 583,"effectType": 1364,"areaColor": 2808,"showEffectOn": 1285,"rippleEffect": 3617,"minAngle": 2527,"barMaxWidth": 3073,"rotateLabel": 523,"dimension": 1922,"end": 1426,"inRange": 4604,"outOfRange": 2262,"checkpointStyle": 1036,"sampling": 2458,"regions": 6273,"large": 1055,"showLegendSymbol": 1600,"layoutSize": 1981,"mapValueCalculation": 1447,"categories": 4362,"indicator": 2995,"barBorderRadius": 1455,"range": 2009,"connectNulls": 3411,"pointer": 2665,"effect": 5446,"parallelAxisDefault": 927,"coords": 750,"shadowStyle": 1670,"largeThreshold": 754,"hoverLink": 1276,"repulsion": 865,"textGap": 1121,"breadcrumb": 828,"baseline": 1316,"endAngle": 895,"period": 1153,"brushType": 1421,"minOpacity": 216,"brushLink": 913,"brushMode": 465,"transformable": 418,"brushStyle": 507,"throttleType": 448,"throttleDelay": 369,"removeOnClick": 648,"inBrush": 500,"outOfBrush": 466,"offsetCenter": 981,"barMinHeight": 2279,"parallelIndex": 235,"nodeClick": 732,"source": 869,"color0": 210,"filterMode": 2252,"tiled": 352,"autoPlay": 496,"playInterval": 440,"sort": 484,"polyline": 929,"initLayout": 966,"controlPosition": 408,"children": 89,"contentToOption": 590,"maxOpacity": 215,"squareRatio": 281,"leafDepth": 347,"zoomToNodeRatio": 300,"childrenVisibleMin": 303,"shape": 1054,"length2": 891,"endValue": 1107,"gravity": 634,"edgeLength": 662,"layoutAnimation": 485,"colorAlpha": 389,"constantSpeed": 451,"trailLength": 530,"dim": 313,"areaSelectStyle": 253,"funnelAlign": 334,"buttonTextColor": 177,"buttonColor": 205,"levels": 2267,"textColor": 178,"lineX": 46,"lineY": 32,"showPlayBtn": 64,"showPrevBtn": 43,"showNextBtn": 43,"playIcon": 90,"stopIcon": 48,"prevIcon": 39,"nextIcon": 36,"ellipsis": 76,"clear": 114,"colorMappingBy": 424,"maxSize": 131,"minSize": 147,"gap": 175,"visibleMin": 315,"axisExpandable": 134,"layoutIterations": 226,"nodeGap": 158,"nodeWidth": 134,"axisExpandCenter": 79,"axisExpandCount": 56,"axisExpandWidth": 51,"boxWidth": 46,"gapWidth": 78,"borderColorSaturation": 56,"inactiveOpacity": 51,"keep": 41,"colorSaturation": 343,"visualDimension": 471,"id": 138,"borderColor0": 67,"emptyItemWidth": 60,"activeOpacity": 43,"radiusAxisIndex": 574,"angleAxisIndex": 478,"textPosition": 232,"minOpen": 194,"maxOpen": 125,"graphic": 5617,"elements": 3108,"image": 673,"group": 488,"$action": 82,"style": 431,"textVeticalAlign": 13,"fill": 55,"stroke": 47,"lineWidth": 34,"sector": 93,"bezier-curve": 6,"cpx2": 1,"cpy2": 1,"circle": 256,"arc": 61,"bezierCurve": 61,"onclick": 101,"onmouseover": 32,"font": 17,"bounding": 75,"cursor": 54,"themeRiver": 11,"confine": 580,"ring": 103,"ondragleave": 3,"ondragstart": 4,"ondragover": 4,"disabled": 221,"visualMin": 44,"visualMax": 18,"onmousemove": 14,"ondrag": 8,"ondragend": 2,"x2": 7,"x1": 4,"y1": 2,"y2": 3,"percent": 6,"ondrop": 9,"cx": 7,"smoothConstraint": 20,"cpx1": 2,"points": 16,"onmousewheel": 13,"onmouseout": 7,"barBorderWidth": 2,"ondragenter": 2,"onmouseup": 1,"cy": 1,"r": 2,"onmousedown": 1,"animationThreshold": 1};
var fullKeywordsList = ["0","1","title","show","text","link","target","textStyle","color","fontStyle","fontWeight","fontFamily","fontSize","textAlign","textBaseline","subtext","sublink","subtarget","subtextStyle","padding","itemGap","zlevel","z","left","top","right","bottom","backgroundColor","borderColor","borderWidth","shadowBlur","shadowColor","shadowOffsetX","shadowOffsetY","legend","width","height","orient","align","itemWidth","itemHeight","formatter","selectedMode","inactiveColor","selected","tooltip","data","name","icon","grid","containLabel","trigger","axisPointer","type","axis","snap","label","precision","margin","lineStyle","opacity","shadowStyle","crossStyle","position","extraCssText","xAxis","gridIndex","offset","nameLocation","nameTextStyle","nameGap","nameRotate","inverse","boundaryGap","min","max","scale","splitNumber","minInterval","interval","logBase","silent","triggerEvent","axisLine","onZero","axisTick","alignWithLabel","inside","length","axisLabel","rotate","showMinLabel","showMaxLabel","baseline","splitLine","splitArea","areaStyle","value","tiggerTooltip","status","handle","size","throttle","yAxis","polar","center","radius","radiusAxis","polarIndex","angleAxis","startAngle","clockwise","radar","shape","indicator","dataZoom","disabled","xAxisIndex","yAxisIndex","radiusAxisIndex","angleAxisIndex","filterMode","start","end","startValue","endValue","minSpan","maxSpan","minValueSpan","maxValueSpan","zoomLock","dataBackground","fillerColor","handleIcon","handleSize","handleStyle","borderType","labelPrecision","labelFormatter","showDetail","showDataShadow","realtime","visualMap","range","calculable","textGap","dimension","seriesIndex","hoverLink","inRange","outOfRange","controller","pieces","categories","minOpen","maxOpen","showLabel","itemSymbol","showContent","alwaysShowContent","triggerOn","showDelay","hideDelay","enterable","confine","transitionDuration","toolbox","itemSize","showTitle","feature","saveAsImage","excludeComponents","iconStyle","normal","textPosition","emphasis","pixelRatio","restore","dataView","readOnly","optionToContent","contentToOption","lang","textareaColor","textareaBorderColor","textColor","buttonColor","buttonTextColor","zoom","back","magicType","line","bar","stack","tiled","option","brush","rect","polygon","lineX","lineY","keep","clear","brushLink","geoIndex","brushType","brushMode","transformable","brushStyle","throttleType","throttleDelay","removeOnClick","inBrush","outOfBrush","geo","map","roam","aspectScale","boundingCoords","scaleLimit","nameMap","itemStyle","layoutCenter","layoutSize","regions","areaColor","parallel","layout","axisExpandable","axisExpandCenter","axisExpandCount","axisExpandWidth","axisExpandTriggerOn","parallelAxisDefault","parallelAxis","dim","parallelIndex","areaSelectStyle","singleAxis","timeline","axisType","currentIndex","autoPlay","rewind","loop","playInterval","controlPosition","symbol","symbolSize","symbolRotate","symbolOffset","checkpointStyle","animation","animationDuration","animationEasing","controlStyle","showPlayBtn","showPrevBtn","showNextBtn","playIcon","stopIcon","prevIcon","nextIcon","graphic","elements","id","$action","bounding","invisible","cursor","draggable","progressive","children","onclick","onmouseover","onmouseout","onmousemove","onmousewheel","onmousedown","onmouseup","ondrag","ondragstart","ondragend","ondragenter","ondragleave","ondragover","ondrop","style","image","x","y","fill","stroke","lineWidth","font","textVeticalAlign","cx","cy","r","r0","endAngle","points","smooth","smoothConstraint","x1","y1","x2","y2","percent","cpx1","cpy1","cpx2","cpy2","calendar","cellSize","dayLabel","firstDay","monthLabel","yearLabel","series","coordinateSystem","showSymbol","showAllSymbol","hoverAnimation","legendHoverLink","connectNulls","clipOverflow","step","smoothMonotone","sampling","markPoint","valueIndex","valueDim","coord","animationThreshold","animationDelay","animationDurationUpdate","animationEasingUpdate","animationDelayUpdate","markLine","curveness","markArea","barBorderRadius","barWidth","barMaxWidth","barMinHeight","barGap","barCategoryGap","selectedOffset","minAngle","roseType","avoidLabelOverlap","stillShowZeroSum","labelLine","length2","animationType","large","largeThreshold","effectType","showEffectOn","rippleEffect","period","radarIndex","squareRatio","leafDepth","nodeClick","zoomToNodeRatio","levels","visualDimension","visualMin","visualMax","colorAlpha","colorSaturation","colorMappingBy","visibleMin","childrenVisibleMin","ellipsis","gapWidth","borderColorSaturation","breadcrumb","emptyItemWidth","boxWidth","barMinWidth","color0","borderColor0","blurSize","minOpacity","maxOpacity","mapValueCalculation","showLegendSymbol","inactiveOpacity","activeOpacity","polyline","effect","delay","constantSpeed","trailLength","coords","circular","rotateLabel","force","initLayout","repulsion","gravity","edgeLength","layoutAnimation","nodeScaleRatio","focusNodeAdjacency","edgeSymbol","edgeSymbolSize","edgeLabel","category","nodes","links","source","edges","nodeWidth","nodeGap","layoutIterations","minSize","maxSize","sort","gap","funnelAlign","distance","pointer","offsetCenter","detail","symbolPosition","symbolRepeat","symbolRepeatDirection","symbolMargin","symbolClip","symbolBoundingData","symbolPatternSize","singleAxisIndex","date","progressiveThreshold","blendMode","hoverLayerThreshold","useUTC"];

for (var i = 0; i < fullKeywordsList.length; i++) {
    if (keywords[fullKeywordsList[i]] == null) {
        keywords[fullKeywordsList[i]] = 0;
    }
}
var completions = [];
for (var key in keywords) {
    completions.push({
        caption: key,
        value: key,
        score: keywords[key],
        metal: 'local'
    });
}
lnTools.addCompleter({
    getCompletions: function (editor, session, pos, prefix, callback) {
        callback(null, completions);
    }
});

_.each((location.search || '').substr(1).split('&'), function (item) {
    var kv = item.split('=');
    configs[kv[0]] = kv[1];
});

function makeSearch(obj) {
    var search = [];
    for (var key in obj) {
        if (obj[key] != null) {
            search.push(key + '=' + obj[key]);
        }
    }
    return search.join('&');
}

var gb = {
    handler: {
        isDown: false
    },
    lastTyping: 0,
    editor: null,
    chart: null,
    loadedCode: null,
    echartsSource: {},

    lastOption: null,
    updateTime: 0,
    debounceTime: 500,

    enableLive: !configs.gl && !configs.nolive
};

var COLORS = {
    default: ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
    light: ['#37A2DA', '#32C5E9', '#67E0E3', '#9FE6B8', '#FFDB5C','#ff9f7f', '#fb7293', '#E062AE', '#E690D1', '#e7bcf3', '#9d96f5', '#8378EA', '#96BFFF'],
    dark: ['#dd6b66','#759aa0','#e69d87','#8dc1a9','#ea7e53','#eedd78','#73a373','#73b9bc','#7289ab', '#91ca8c','#f49f42']
};

$('#theme .' + (configs.theme || 'default')).addClass('selected');

$('#theme a').click(function () {
    if ($(this).hasClass('selected')) {
        return;
    }
    var theme = $(this).attr('class').replace('default', '').trim();

    window.location.href = './editor.html?' + makeSearch({
        c: configs.c,
        gl: configs.gl || null,
        theme: theme || null
    });
})
// Add popover
$('#theme a').popover({
    html: true,
    content: function () {
        var theme = $(this).attr('class').replace('selected', '').trim();
        return '<div class="theme-palette ' + theme + '">'
            + COLORS[theme].map(function (color) {
                return '<span style="background-color:' + color + '"></span>'
            }).join('')
            + '</div>';
    },
    placement: 'top',
    trigger: 'hover'
});


$(document).ready(function() {

    initEditor();
    checkEditorIfToShow();

    initEcharts();

    initControl();

    initEventHandler();

    load();
});



function initEditor() {

    gb.editor = ace.edit('code-panel');
    gb.editor.getSession().setMode('ace/mode/javascript');

    gb.editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true
    });
}



function initEcharts() {

    gb.chart = echarts.init($('#chart-panel')[0], configs.theme, {
        renderer: configs.renderer || 'canvas'
    });

    gb.editor.setValue('var option = {\n    \n};\n');

    gb.editor.selection.setSelectionRange({
        start: {
            row:1,
            column: 4
        }, end: {
            row:1,
            column: 4
        }
    });

}



function initControl() {

    // init dropdown button groups
    $('#theme-dropdown').on('click', 'li a', function(){
        setThemeButton($(this).text());
    });
    $('#echarts-version-dropdown').on('click', 'li a', function() {
        setEchartsVersionButton($(this).text());
    });

}



function setThemeButton(text) {

    $('#theme-btn').html('ECharts-' + text + ' <span class="caret"></span>');
    $('#theme-btn').val(text);
    disposeAndRun();

}



function setEchartsVersionButton(version) {

    $('#echarts-version-btn').html('ECharts-' + version
        + ' <span class="caret"></span>');
    $('#echarts-version-btn').val(version);
    updateEchartsVersion();

}



function initEventHandler() {

    // reset typing state
    var typingHandler = null;


    if (gb.enableLive) {  // Not using live when it's GL
        gb.editor.on('change', function() {
            runDebounce();
        });
    }

    $('#h-handler').mousedown(function() {

        gb.handler.isDown = true;

    });


    $(window).mousemove(function(e) {

        if (gb.handler.isDown) {
            var left = e.clientX / window.innerWidth;
            setSplitPosition(left);
        }

    }).mouseup(function() {

        gb.handler.isDown = false;

    });

    $(window).resize(function() {
        gb.chart.resize();
        appEnv.onresize && appEnv.onresize();
        checkEditorIfToShow();
    });

}



// set splitter position by percentage, left should be between 0 to 1
function setSplitPosition(percentage) {
    percentage = Math.min(0.9, Math.max(0.1, percentage));

    var left = percentage * 100;
    $('#code-container').css('width', left + '%');
    $('.right-container').css('width', (100 - left) + '%')
        .css('left', left + '%');
    $('#h-handler').css('left', left + '%');

    if (gb.chart) {
        gb.chart.resize();
        appEnv.onresize && appEnv.onresize();
    }
}


function checkEditorIfToShow() {

    // hide editor for mobile devices
    if (window.innerWidth < 768) {
        if (gb.editorIsShown === undefined || gb.editorIsShown === true) {
            // hide editor
            $('#code-container').hide();
            $('#h-handler').hide();
            $('.right-container').css('width', '100%').css('left', '0%');
            gb.editorIsShown = false;
        }
    } else {
        if (gb.editorIsShown === undefined || gb.editorIsShown === false) {
            // show editor
            $('#code-container').show();
            $('#h-handler').show();
            setSplitPosition(0.4);
            gb.editorIsShown = true;
        }
    }
}


var appEnv = {};
var gui;

var _intervalIdList = [];
var _timeoutIdList = [];

var _oldSetTimeout = window.setTimeout;
var _oldSetInterval = window.setInterval;

window.setTimeout = function (func, delay) {
    var id = _oldSetTimeout(func, delay);
    _timeoutIdList.push(id);
    return id;
};
window.setInterval = function (func, gap) {
    var id = _oldSetInterval(func, gap);
    _intervalIdList.push(id);
    return id;
};
function _clearTimeTickers() {
    for (var i = 0; i < _intervalIdList.length; i++) {
        clearInterval(_intervalIdList[i]);
    }
    for (var i = 0; i < _timeoutIdList.length; i++) {
        clearTimeout(_timeoutIdList[i]);
    }
    _intervalIdList = [];
    _timeoutIdList = [];
}
var _events = [];
function _wrapOnMethods(chart) {
    var oldOn = chart.on;
    chart.on = function (eventName) {
        var res = oldOn.apply(chart, arguments);
        _events.push(eventName);
        return res;
    };
}

function _clearChartEvents() {
    _events.forEach(function (eventName) {
        if (gb.chart) {
            gb.chart.off(eventName);
        }
    });

    _events.length = 0;
}

// run to get echarts locally
var run = function (ignoreOptionNotChange) {

    // check if code is valid
    if (hasEditorError()) {
        log(lang.errorInEditor, 'error');
        return;
    }

    // save locallly
    localSave();

    _clearTimeTickers();
    _clearChartEvents();
    // Reset
    appEnv.config = null;

    // run the code
    try {

        var myChart = gb.chart;
        // FIXME
        var app = appEnv;

        // Reset option
        option = null;
        eval(gb.editor.getValue());

        if (option && typeof option === 'object' && (!_.isEqual(option, gb.lastOption) || ignoreOptionNotChange)) {
            gb.lastOption = option;
            var startTime = +new Date();
            gb.chart.setOption(option, true);
            var endTime = +new Date();
            gb.updateTime = endTime - startTime;

            // Find the appropriate throttle time
            var debounceTime = 500;
            var debounceTimeQuantities = [500, 2000, 5000, 10000];
            for (var i = debounceTimeQuantities.length - 1; i >= 0; i--) {
                var quantity = debounceTimeQuantities[i];
                var preferredDebounceTime = debounceTimeQuantities[i + 1] || 1000000;
                if (gb.updateTime > quantity && gb.debounceTime !== preferredDebounceTime) {
                    gb.debounceTime = preferredDebounceTime;
                    runDebounce = _.debounce(run, preferredDebounceTime, {
                        trailing: true
                    });
                    break;
                }
            }
            log(lang.chartOK + gb.updateTime + 'ms');
        }

        if (gui) {
            $(gui.domElement).remove();
            gui.destroy();
            gui = null;
        }

        if (app.config) {
            gui = new dat.GUI({
                autoPlace: false
            });
            $(gui.domElement).css({
                position: 'absolute',
                right: 5,
                top: 0,
                zIndex: 1000
            });
            $('.right-container').append(gui.domElement);

            var configParameters = app.configParameters || {};
            for (var name in app.config) {
                var value = app.config[name];
                if (name !== 'onChange' && name !== 'onFinishChange') {
                    var isColor = false;
                    // var value = obj;
                    var controller;
                    if (configParameters[name]) {
                        if (configParameters[name].options) {
                            controller = gui.add(app.config, name, configParameters[name].options);
                        }
                        else if (configParameters[name].min != null) {
                            controller = gui.add(app.config, name, configParameters[name].min, configParameters[name].max);
                        }
                    }
                    if (typeof obj === 'string') {
                        try {
                            var colorArr = echarts.color.parse(value);
                            isColor = !!colorArr;
                            if (isColor) {
                                value = echarts.color.stringify(colorArr, 'rgba');
                            }
                        }
                        catch (e) {}
                    }
                    if (!controller) {
                        controller = gui[isColor ? 'addColor' : 'add'](app.config, name);
                    }
                    app.config.onChange && controller.onChange(app.config.onChange);
                    app.config.onFinishChange && controller.onFinishChange(app.config.onFinishChange);
                }
            }
        }
    } catch(e) {
        log(lang.errorInEditor, 'error');
        console.error(e);
    }
};

var runDebounce = _.debounce(run, gb.debounceTime, {
    trailing: true
});

function disposeAndRun() {

    // dispose
    if (gb.chart) {
        gb.chart.dispose();
    }

    // init with theme
    var theme = $('#theme-btn').val() || 'default';
    gb.chart = echarts.init($('#chart-panel')[0], configs.theme, {
        renderer: configs.renderer || 'canvas'
    });
    _wrapOnMethods(gb.chart);

    // run with option in code panel
    run(true);
}



// update echarts version locally
function updateEchartsVersion() {

    var version = $('#echarts-version-btn').val();

    // update only when version is different
    if (echarts && version === echarts.version && !gb.echartsSource[version]) {
        return;
    }

    // echarts = null;

    try {
        eval(gb.echartsSource[version]);
        disposeAndRun();
    } catch (e) {
        log('加载 ECharts 版本失败！', 'error');
    }

}






// save chart to localStorage
function localSave() {

    var code = gb.editor.getValue();

    if (window.localStorage && code !== gb.loadedCode) {
        try {
            window.localStorage.setItem('code', code);
            $('#reset-btn').css('display', 'inline-block');
        } catch (e) {
            console.error(e);
            log('缓存到本地失败，刷新页面后图表将不被保存，请及时保存');
        }
    }

}



// load code from localStorage
function localLoad() {

    try {
        var code = window.localStorage.getItem('code');
        if (code) {
            gb.editor.setValue(code, -1);

            if (!gb.enableLive) {
                runDebounce();
            }

            log('读取本地缓存成功');
        }
    } catch (e) {
        console.error(e);
    }

}



// reset editor with loaded code
function localReset() {

    if (gb.loadedCode) {
        gb.editor.setValue(gb.loadedCode);

        if (!gb.enableLive) {
            runDebounce();
        }

        localSave();
        $('#reset-btn').hide();
        run();
    }

}



function hasEditorError() {

    var annotations = gb.editor.getSession().getAnnotations();
    for (var aid = 0, alen = annotations.length; aid < alen; ++aid) {
        if (annotations[aid].type === 'error') {
            return true;
        }
    }
    return false;

}



// load a chart with chart id in url
function load() {
    var dataRoot = configs.gl ? 'data-gl' : 'data';

    if (configs.gl) {
        $.when.apply($, [
            './vendors/echarts-gl/echarts-gl.min.js'
            // './vendors/mapbox-gl.js'
        ].map(function (url) {
            return $.getScript(url);
        })).done(loadChart);
    }
    else {
        loadChart();
    }

    function loadChart() {
        if (configs.c) {
            $.ajax('./' + dataRoot + '/' + configs.c + '.js', {
                dataType: 'text',
                success: function (data) {
                    gb.loadedCode = data;
                    gb.editor.setValue(data, -1);
                    if (!gb.enableLive) {
                        runDebounce();
                    }
                }
            }).fail(function () {
                log('加载图表失败！', 'error');
            });
        }
    }
    return;
}



// show log info in code-info panel
// type should be 'info', 'warn', 'error'
function log(text, type) {

    // log time
    var timeStr = formatTime(new Date());

    if (type !== 'warn' && type !== 'error') {
        type = 'info';
    }

    $('#code-info').html(
        '<span class="code-info-time">' + timeStr + '</span>' +
        '<span class="code-info-type-' + type + '">' + text + '</span>'
    );

}



// format time to string
function formatTime(time) {

    var digits = [time.getHours(), time.getMinutes(), time.getSeconds()];
    var timeStr = '';
    for (var i = 0, len = digits.length; i < len; ++i) {
        timeStr += (digits[i] < 10 ? '0' : '') + digits[i];
        if (i < len - 1) {
            timeStr += ':';
        }
    }
    return timeStr;

}



// get version id of current page
function getVersion() {

    var url = window.location.href.split('/');
    if (url.length === 4) {
        // no version in url, first version
        return 1;
    } else {
        return parseInt(url[url.length - 1], 10) || 1;
    }

}



// get version id of current page
function getCid() {

    return window.location.href.split('/')[3];

}



// download example html and js

function downloadExample() {

    var html =
'<!DOCTYPE html>\n' +
'<html style="height: 100%">\n' +
'   <head>\n' +
'       <meta charset="utf-8">\n' +
'   </head>\n' +
'   <body style="height: 100%; margin: 0">\n' +
'       <div id="container" style="height: 100%"></div>\n' +

'       <script type="text/javascript" src="http://echarts.baidu.com/gallery/vendors/echarts/echarts.min.js"></script>\n' +
'       <script type="text/javascript" src="http://echarts.baidu.com/gallery/vendors/echarts-gl/echarts-gl.min.js"></script>\n' +
'       <script type="text/javascript" src="http://echarts.baidu.com/gallery/vendors/echarts-stat/ecStat.min.js"></script>\n' +
'       <script type="text/javascript" src="http://echarts.baidu.com/gallery/vendors/echarts/extension/dataTool.min.js"></script>\n' +
'       <script type="text/javascript" src="http://echarts.baidu.com/gallery/vendors/echarts/map/js/china.js"></script>\n' +
'       <script type="text/javascript" src="http://echarts.baidu.com/gallery/vendors/echarts/map/js/world.js"></script>\n' +
'       <script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak=ZUONbpqGBsYGXNIYHicvbAbM"></script>\n' +
'       <script type="text/javascript" src="http://echarts.baidu.com/gallery/vendors/echarts/extension/bmap.min.js"></script>\n' +
'       <script type="text/javascript" src="http://echarts.baidu.com/gallery/vendors/simplex.js"></script>\n' +

'       <script type="text/javascript">\n' +
'var dom = document.getElementById("container");\n' +
'var myChart = echarts.init(dom);\n' +
'var app = {};\n' +

'option = null;\n' +
gb.editor.getValue() + ';\n' +

'if (option && typeof option === "object") {\n' +
'    myChart.setOption(option, true);\n' +
'}\n' +
'       </script>\n' +
'   </body>\n' +
'</html>';
    var file = new Blob([html], {
        type: 'text/html;charset=UTF-8',
        encoding: 'UTF-8'
    });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(file);
    a.download = configs.c + '.html';
    a.click();

}

$('#download').click(downloadExample);