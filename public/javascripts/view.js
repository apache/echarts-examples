(function () {

    var lang = ({
        cn: {
            editDemo: '编辑示例',
            reset: '重置',
            enableInteraction: '开启交互',
            disableInteraction: '关闭交互'
        },
        en: {
            editDemo: 'Edit',
            reset: 'Reset',
            enableInteraction: 'Enable interaction',
            disableInteraction: 'Disable interaction'
        }
    })[window.EC_DEMO_LANG];

    var configs = {};
    _.each((location.search || '').substr(1).split('&'), function (item) {
        var kv = item.split('=');
        configs[kv[0]] = kv[1];
    });

    var myChart;
    var app = {};
    var name;
    var gui;
    // run to get echarts locally
    var run = function (code) {
        clearTimeout(app.timeTicket);
        clearInterval(app.timeTicket);
        // Reset
        app.config = null;


        if (myChart) {
            myChart.dispose();
        }
        myChart = echarts.init(document.getElementById('view-chart'));

        eval(code);
        if (typeof option === 'object') {
            myChart.setOption(option, true);
        }

        if (app.config) {
            gui = new dat.GUI();
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
    };

    if (configs.edit) {
        var $editButton = $('<a class="btn btn-default btn-sm">' + lang.editDemo + '</a>').click(function () {
            window.open('./editor.html?c=' + configs.c);
        });
        $('#view-main .control-panel').append($editButton);
    }
    if (configs.reset) {
        var $resetButton = $('<a class="btn btn-default btn-sm">' + lang.reset + '</a>').click(function () {
            run();
        });
        $('#view-main .control-panel').append($resetButton);
    }
    if (configs.mask) {
        var maskEnabled = true;
        var $toggleBtn = $('<a id="view-toggle-interable" class="btn btn-default btn-sm">' + lang.enableInteraction + '</a>');
        var $mask = $('<div id="view-mask"></div>');
        function enableMask() {
            $toggleBtn.html(lang.enableInteraction);
            $(document.body).append($mask);
            maskEnabled = true;
        }
        function disableMask() {
            $toggleBtn.html(lang.disableInteraction);
            $mask.remove();
            maskEnabled = false;
        }
        $('#view-main .control-panel').append($toggleBtn);

        $toggleBtn.click(function () {
            if (maskEnabled) {
                disableMask();
            }
            else {
                enableMask();
            }
        });
        enableMask();
    }
    if (configs.c) {
        $.ajax('./data/' + configs.c + '.js', {
            dataType: 'text',
            success: function (data) {
                run(data);
            }
        }).fail(function () {
            // log('加载图表失败！', 'error');
        });
    }

    $(window).resize(function () {
        if (myChart) {
            myChart.resize();
        }
    });
})();