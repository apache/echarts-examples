<template>
<div>
    <div id="left-chart-nav">
        <ul>
            <li v-for="category in EXAMPLE_CATEGORIES" :key="category">
                <a class="left-chart-nav-link" :id="'left-chart-nav-' + category"
                    :href="'#chart-type-' + category"
                >
                    <span class="chart-icon"></span>
                    <span class="chart-name">{{$t('chartTypes.' + category)}}</span>
                </a>
            </li>
        </ul>
    </div>
    <div id="explore-container">
        <div class="example-list-panel">
            <div v-for="category in EXAMPLE_CATEGORIES" :key="category" v-if="exampleListByCategory[category] && exampleListByCategory[category].examples.length > 0">
                <h3 class="chart-type-head" :id="'chart-type-' + category">
                    {{$t('chartTypes.' + category)}}
                    <span>{{category}}</span>
                </h3>

                <div class="row" :id="'chart-row-' + category">
                    <div class="col-xl-2 col-lg-3 col-md-4 col-sm-6"
                        v-for="exampleItem in exampleListByCategory[category].examples"
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

                    const categoryStr = (example.category || [])[categoryOrder];
                    if (categoryStr) {
                        added = true;
                        let categoryObj = exampleListByCategory[categoryStr];
                        if (!categoryObj) {
                            categoryObj = {
                                category: categoryStr,
                                isGL,
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
            } while (categoryOrder++ && categoryOrder < 4)  // At most 4 category
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

    mounted() {
        this._lazyload = new LazyLoad({
            // Container should be the scroll viewport.
            // container: this.$el.querySelector('#explore-container .example-list-panel'),
            elements_selector: 'img.chart-area',
            load_delay: 300
        });
    }
}
</script>

<style lang="scss">

@import "../style/color.scss";
@import "../style/config.xl.scss";

$chart-nav-width: 180px;
$chart-icon-width: 32px;
$chart-icon-border: 1px;
$nav-height: 50;

$pd-basic: 10px;
$pd-sm: 6px;
$pd-lg: 20px;

#explore-container {
    margin-left: $chart-nav-width;
    padding: $nav-height $pd-lg;
    background-color: $clr-bg;
}


.example-list-panel {
    margin: 30px 15px 30px 15px;

    h3 {
        margin-bottom: 20px;
    }
    .chart-type-head span {
        font-size: 20px;
        padding-left: 10px;
        color: #999;
        font-weight: normal;
    }
}

#left-chart-nav {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;

    // padding-top: $nav-height;
    width: $chart-nav-width;

    background-color: $clr-primary;
    overflow-y: hidden;

    &:hover {
        overflow-y: auto;

        a {
            text-decoration: none;
        }
    }

    li {
        height: 54px;
        padding: 10px 0 10px 20px;
        transition: 0.5s;

        a {
            color: $clr-gray;
            position: relative;
            display: block;
            transition: 0.5s;
            text-decoration: none;

            .chart-name {
                display: inline-block;
                position: relative;
                top: -12px;
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
                border: $chart-icon-border solid $clr-gray-dark;
            }
        }

        &.active {
            background-color: $clr-contrast;

            a {
                color: $clr-gray-light;
            }

            .chart-icon {
                border-color: $clr-gray-light;
            }
        }

        &:hover {
            background-color: $clr-primary-dark;
        }
    }
}

@media (max-width: 768px) {
    #left-chart-nav {
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