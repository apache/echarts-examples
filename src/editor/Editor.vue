<template>
<div id="main-container">
    <div id="code-container">
        <div id="control-panel">
            <div id="code-info"></div>
            <div class="control-btn-panel">
                <a href="javascript:;" class='btn btn-default btn-sm' @click='disposeAndRun'>{{$t('editor.run')}}</a>
            </div>
        </div>
        <CodeAce></CodeAce>
    </div>
    <div class="handler" id="h-handler"></div>
    <div class="right-container">
        <div class="right-panel" id="chart-panel"></div>
        <div id="tool-panel">
            <ToggleButton></ToggleButton>
            <button id="download" class="btn btn-sm">Download</button>
        </div>
    </div>
</div>
</template>

<script>

import { ToggleButton } from 'vue-js-toggle-button';
import CodeAce from './CodeAce.vue';

export default {
    components: {
        ToggleButton,
        CodeAce
    }
}
</script>

<style lang="scss">

@import '../style/color.scss';

$code-info-height: 25px;
$control-panel-height: 50px;
$pd-basic: 10px;
$handler-width: 5px;

#main-container {
    .handler {
        position: absolute;
        left: 50%;

        top: 0;
        bottom: 0;
        width: $handler-width;

        cursor: col-resize;
        z-index: 100;
        background-color: transparent;
        border-left: 1px solid #ececec;
        // border-right: 1px solid $clr-border;
    }

}

#code-container {
    position: absolute;
    left: 0;
    bottom: 0;
    top: 0;

    width: 50%;
}

#control-panel {
    height: $control-panel-height;
    position: absolute;;
    left: 0;
    right: 0;
    top: 0;
    z-index: 20;
    padding: 0;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

    .setting-panel {
        display: inline-block;

        .btn-group + .btn-group {
            margin-left: $pd-basic;
        }
    }

    .control-btn-panel  {
        float: right;

        .btn {
            color: #FFF;
            border-radius: 0;
            background-color: #3FA7DC;
            margin-left: $pd-basic;
            border: none;
            height: 30px;
            width: 50px;
        }
        .btn:hover {
            background-color: #277EAB;
        }
    }
}


#code-panel {
    position: absolute;
    top: $control-panel-height;
    bottom: 0;
    left: 0;
    right: 0;

    padding: $pd-basic;

    ::-webkit-scrollbar {
        height:8px;
        width:8px;
        transition:all 0.3s ease-in-out;
        border-radius:2px;
    }

    ::-webkit-scrollbar-button {
        display:none;
    }

    ::-webkit-scrollbar-thumb {
        width:8px;
        min-height:15px;
        background:rgba(50, 50, 50, 0.6) !important;
        transition:all 0.3s ease-in-out;border-radius:2px;
    }

    ::-webkit-scrollbar-thumb:hover {
        background:rgba(0, 0, 0, 0.5) !important;
    }
}

#code-info {
    position: absolute;
    bottom: 0;
    overflow: hidden;

    height: $control-panel-height;
    line-height: $control-panel-height;
    padding: 0px 10px;

    // border-top: 1px solid $clr-border;
    font-size: 0.9rem;

    .code-info-time {
        color: $clr-text;
        display: inline-block;
        margin-right: 10px;
    }

    .code-info-type-info {
        color: $clr-text;
    }

    .code-info-type-warn {
        color: $clr-warn;
    }

    .code-info-type-error {
        color: $clr-error;
    }
}

.dg.main * {
    box-sizing: content-box;
}
.dg.main input {
    line-height: normal;
}

.dg.main.a {
    overflow-x: visible;
}

.dg.main .c {
    select {
        color: #000;
    }
}

.right-container {
    position: absolute;
    right: 0;

    width: 50%;
    height: 100%;
    padding: 0;
    padding-left: $handler-width;
    border: none;
    z-index: 30;

    background: $clr-bg;

    .right-panel {
        padding: $pd-basic;

        canvas {
            border-radius: 5px;
        }
    }
}

#fork-btn, #reset-btn {
    display: none;
}

#chart-panel {
    position: absolute;
    // top: $control-panel-height;
    top: 15px;
    right: 15px;
    bottom: 60px;
    left: 15px;
    box-sizing: border-box;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 20px;
    border-radius: 5px;
    background: #fff;
    overflow: hidden;
}

#tool-panel {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;

    #theme {
        margin-bottom: 10px;
        float: right;

        a {
            cursor: pointer;
        }
    }

    #download {
        float: right;
        margin-right: 10px;
    }
}

</style>