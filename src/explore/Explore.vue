<template>
<div id="example-explore">
    <div id="left-container">
        <div id="left-toolbar">
            <el-switch
                v-model="shared.darkMode"
                active-color="#181432"
                :active-text="$t('editor.darkMode')"
                :inactive-text="''">
            </el-switch>
        </div>
        <div id="left-chart-nav">
            <scrollactive
                active-class="active"
                :offset="80"
                :duration="500"
                :scroll-container-selector="'#example-explore'"
                bezier-easing-value=".5,0,.35,1"
                @itemchanged="onActiveNavChanged"
            >
                <ul>
                    <li v-for="category in EXAMPLE_CATEGORIES" :key="category">
                        <a class="left-chart-nav-link scrollactive-item" :id="'left-chart-nav-' + category"
                            :href="'#chart-type-' + category"
                        >
                            <span class="chart-icon"></span>
                            <span class="chart-name">{{$t('chartTypes.' + category)}}</span>
                        </a>
                    </li>
                </ul>
            </scrollactive>
        </div>
    </div>
    <div id="explore-container">
        <div class="example-list-panel">
            <div v-for="categoryObj in exampleList" :key="categoryObj.category">
                <h3 class="chart-type-head" :id="'chart-type-' + categoryObj.category">
                    {{$t('chartTypes.' + categoryObj.category)}}
                    <span>{{categoryObj.category}}</span>
                </h3>

                <div class="row" :id="'chart-row-' + categoryObj.category">
                    <div class="col-xl-2 col-lg-3 col-md-4 col-sm-6"
                        v-for="exampleItem in categoryObj.examples"
                        :key="exampleItem.id"
                    >
                        <ExampleCard :example="exampleItem"></ExampleCard>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>

import CHART_LIST from '../data/chart-list-data';
import CHART_LIST_GL from '../data/chart-list-data-gl';
import {EXAMPLE_CATEGORIES, BLACK_MAP, URL_PARAMS} from '../common/config';
import {store} from '../common/store';
import ExampleCard from './ExampleCard.vue';
import LazyLoad from 'vanilla-lazyload/dist/lazyload.esm';
import scrollIntoView from 'scroll-into-view';

const LAZY_LOADED_CLASS = 'ec-shot-loaded';

export default {

    components: {
        ExampleCard
    },

    data() {
        const exampleListByCategory = {};

        function addExamples(list, isGL) {
            let categoryOrder = 0;
            // Add by category order in each example.
            do {
                let added = false;
                for (let i = 0; i < list.length; i++) {
                    const example = list[i];
                    if (BLACK_MAP.hasOwnProperty(example.id)) {
                        continue;
                    }
                    if (typeof example.category === 'string') {
                        example.category = [example.category];
                    }

                    const categoryStr = (example.category || [])[categoryOrder];
                    if (categoryStr) {
                        added = true;
                        let categoryObj = exampleListByCategory[categoryStr];
                        if (!categoryObj) {
                            categoryObj = {
                                category: categoryStr,
                                examples: []
                            }
                            exampleListByCategory[categoryStr] = categoryObj;
                        }
                        example.isGL = isGL;

                        categoryObj.examples.push(example);
                    }
                }

                if (!added) {
                    break;
                }
            } while (++categoryOrder && categoryOrder < 4)  // At most 4 category
        }

        addExamples(CHART_LIST, false);
        addExamples(CHART_LIST_GL, true);

        return {
            shared: store,

            EXAMPLE_CATEGORIES,
            // [{
            //  category: '',
            //  isGL: false
            //  examples: []
            // }]
            exampleListByCategory
        }
    },

    watch: {
        "shared.darkMode"() {
            const imgs = this.$el.querySelectorAll('img.chart-area');
            for (let i = 0; i < imgs.length; i++) {
                // Force lazyload to update
                imgs[i].classList.remove(LAZY_LOADED_CLASS);
                imgs[i].setAttribute('data-was-processed', 'false');
            }
            this._lazyload.update();
        }
    },

    computed: {
        exampleList() {
            const list = [];
            for (let i = 0; i < EXAMPLE_CATEGORIES.length; i++) {
                const category = EXAMPLE_CATEGORIES[i];
                const categoryObj = this.exampleListByCategory[category];
                if (categoryObj && categoryObj.examples.length > 0) {
                    list.push({
                        category,
                        examples: categoryObj.examples
                    });
                }
            }
            return list;
        }
    },

    mounted() {
        this._lazyload = new LazyLoad({
            // Container should be the scroll viewport.
            // container: this.$el.querySelector('#explore-container .example-list-panel'),
            elements_selector: 'img.chart-area',
            load_delay: 400,
            class_loaded: LAZY_LOADED_CLASS
        });
    },

    methods: {
        onActiveNavChanged(event, currentItem, lastActiveItem) {
            // currentItem && currentItem.scrollIntoView && currentItem.parentNode.scrollIntoView({
            //     // behavior: "smooth"
            // });
            // scrollIntoView(currentItem, {
            //     time: 300,
            //     cancellable: false,
            //     align: {
            //         top: 0,
            //         topOffset: 50
            //     }
            // });
        }
    }
}
</script>

<style lang="scss">

@import "../style/color.scss";
@import "../style/config.xl.scss";

$chart-nav-width: 170px;
$chart-icon-width: 25px;
$chart-icon-border: 1px;

$left-toolbar-height: 30px;

$nav-height: 50px;
$nav-bg: #252839;

$pd-basic: 10px;
$pd-sm: 6px;
$pd-lg: 20px;

#example-explore {
    background: $clr-bg;

    // Use this as scrollable viewport insteadof window because echarts-www has a viewport.
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow-y: auto;
}

#explore-container {
    margin-left: $chart-nav-width + 20px;
    padding: 10px 10px;
    // background-color: $clr-bg;
}

.example-list-panel {
    margin: 30px 15px 30px 15px;

    h3 {
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 1px solid #ccd3e8;
        font-weight: normal;
        color: #252839;
    }
    .chart-type-head span {
        font-size: 18px;
        padding-left: 5px;
        color: #999;
        font-weight: 200;
    }
}

#left-container {
    position: fixed;
    top: 10px;
    bottom: 10px;
    left: 10px;
    width: $chart-nav-width;
}

#left-toolbar {
    position: absolute;
    left: 0;
    right: 0;
    height: $left-toolbar-height;
    top: 0;
    background-color: #fff;
    border-radius: 10px;
    // color: #fff;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    padding-left: 5px;
    padding-top: 4px;

    .el-switch__label * {
        font-size: 12px;
        // color: #fff;
        text-transform: uppercase;
    }
    .el-switch__label.is-active {
        color: #181432;
    }
}

#left-chart-nav {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: $left-toolbar-height + 10px;
    background-color: $nav-bg;
    overflow-y: hidden;
    border-radius: 10px;
    color: #fff;
    box-shadow: 0 0 20px rgba(0,0,0,0.2);

    &:hover {
        overflow-y: auto;

        a {
            text-decoration: none;
        }
    }

    li {
        transition: 0.5s;
        cursor: pointer;

        a {
            height: 45px;
            padding: 10px 0 10px 10px;
            display: block;
            transition: 0.5s;
            text-decoration: none;
            color: inherit;

            .chart-name {
                display: inline-block;
                position: relative;
                vertical-align: middle;
                margin-left: 10px;
            }

            .chart-icon {
                content: '';
                display: inline-block;
                width: $chart-icon-width;
                height: $chart-icon-width;
                background-image: url('../asset/chart-icon.png');
                background-size: $chart-icon-width;
                background-repeat: no-repeat;
                border-radius: 50%;
                border: $chart-icon-border solid #fff;
                vertical-align: middle;
            }
            &.active {
                background-color: $clr-contrast;
            }

        }

        &:hover {
            background-color: darken($nav-bg, 10);
        }
    }
}

@media (max-width: 768px) {
    #left-container {
        display: none;
    }
    #explore-container {
        margin-left: 0;
    }
}

// icon sprites
$chart-types: 'line', 'bar', 'scatter', 'pie', 'radar', 'funnel', 'gauge', 'map',
    'graph', 'treemap', 'parallel', 'sankey', 'candlestick', 'boxplot', 'heatmap',
    'pictorialBar', 'themeRiver', 'calendar', 'custom', 'sunburst', 'tree',
    'globe', 'bar3D', 'scatter3D', 'surface', 'map3D', 'lines3D', 'line3D',
    'scatterGL', 'linesGL', 'flowGL', 'graphGL', 'geo3D', 'geo', 'lines', 'dataset';
$chart-position: 0, 1, 2, 4, 5, 10, 9, 8, 7, 15, 16, 17, 3, 18, 11, 24, 25, 26, 27, 28, 14,
    29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 8, 20, 22;

@each $type in $chart-types {
    $i: index($chart-types, $type);
    $pos: nth($chart-position, $i);
    #left-chart-nav-#{$type} .chart-icon {
        background-position-x: - $chart-icon-border;
        background-position-y: - $chart-icon-border - $pos * $chart-icon-width;
    }
}

</style>