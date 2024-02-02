<template>
  <div id="example-explore">
    <div id="left-container" ref="leftContainer">
      <div id="left-chart-nav">
        <scrollactive
          ref="scrollactive"
          active-class="active"
          :offset="80"
          :duration="500"
          :scroll-container-selector="'#example-explore'"
          :scroll-on-start="false"
          :modify-url="false"
          bezier-easing-value=".5,0,.35,1"
          @itemchanged="onActiveNavChanged"
        >
          <ul>
            <li v-for="category in EXAMPLE_CATEGORIES" :key="category">
              <a
                class="left-chart-nav-link scrollactive-item"
                :id="'left-chart-nav-' + category"
                :href="'#chart-type-' + category"
              >
                <span class="chart-icon" v-html="icons[category]"></span>
                <span class="chart-name">{{
                  $t('chartTypes.' + category)
                }}</span>
              </a>
            </li>
          </ul>
        </scrollactive>
      </div>
    </div>
    <div id="explore-container">
      <div class="example-list-panel">
        <div v-for="categoryObj in exampleList" :key="categoryObj.category">
          <h3
            class="chart-type-head"
            :id="'chart-type-' + categoryObj.category"
          >
            {{ $t('chartTypes.' + categoryObj.category) }}
            <span>{{ categoryObj.category }}</span>
          </h3>

          <div class="row" :id="'chart-row-' + categoryObj.category">
            <div
              class="col-xl-2 col-lg-3 col-md-4 col-sm-6"
              v-for="exampleItem in categoryObj.examples"
              :key="exampleItem.id"
            >
              <ExampleCard :example="exampleItem"></ExampleCard>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="toolbar">
      <el-switch
        v-model="shared.darkMode"
        active-color="#181432"
        :active-text="$t('editor.darkMode')"
        :inactive-text="''"
      >
      </el-switch>
    </div>
  </div>
</template>

<script>
import CHART_LIST from '../data/chart-list-data';
import CHART_LIST_GL from '../data/chart-list-data-gl';
import { EXAMPLE_CATEGORIES, BLACK_MAP } from '../common/config';
import { store } from '../common/store';
import ExampleCard from './ExampleCard.vue';
import LazyLoad from 'vanilla-lazyload/dist/lazyload.esm';

const icons = {};

[
  'line',
  'bar',
  'scatter',
  'pie',
  'radar',
  'funnel',
  'gauge',
  'map',
  'graph',
  'treemap',
  'parallel',
  'sankey',
  'candlestick',
  'boxplot',
  'heatmap',
  'pictorialBar',
  'themeRiver',
  'calendar',
  'custom',
  'sunburst',
  'tree',
  'dataset',
  'geo',
  'lines',
  'dataZoom',
  'rich',
  'graphic'
].forEach(function (category) {
  icons[category] = require('../asset/icon/' + category + '.svg');
});

const glIcon = require('../asset/icon/gl.svg');
[
  'globe',
  'bar3D',
  'scatter3D',
  'surface',
  'map3D',
  'lines3D',
  'line3D',
  'scatterGL',
  'linesGL',
  'flowGL',
  'graphGL',
  'geo3D'
].forEach(function (category) {
  icons[category] = glIcon;
});

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
              };
              exampleListByCategory[categoryStr] = categoryObj;
            }
            example.isGL = isGL;

            categoryObj.examples.push(example);
          }
        }

        if (!added) {
          break;
        }
      } while (++categoryOrder && categoryOrder < 4); // At most 4 category
    }

    addExamples(CHART_LIST, false);
    addExamples(CHART_LIST_GL, true);

    return {
      shared: store,

      icons,

      EXAMPLE_CATEGORIES,
      // [{
      //  category: '',
      //  isGL: false
      //  examples: []
      // }]
      exampleListByCategory
    };
  },

  watch: {
    'shared.darkMode'() {
      const imgs = this.$el.querySelectorAll('img.chart-area');
      for (let i = 0; i < imgs.length; i++) {
        // Force lazyload to update
        LazyLoad.resetStatus(imgs[i]);
      }
      this._lazyload.update();
    }
  },

  computed: {
    exampleList() {
      const list = [];
      for (let i = 0, len = EXAMPLE_CATEGORIES.length; i < len; i++) {
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
      elements_selector: '.chart-area',
      load_delay: 400,
      class_loaded: LAZY_LOADED_CLASS,
      callback_error(img) {
        const fallbackSrc = img.src;
        const children = img.parentElement.children;
        for (let i = 0, len = children.length; i < len; i++) {
          const el = children[i];
          if (el !== img) {
            el.srcset = fallbackSrc;
          }
        }
      }
    });

    setTimeout(() => {
      location.hash && this.onHashChange();
      window.addEventListener('hashchange', this.onHashChange);
    }, 0);
  },

  methods: {
    onHashChange(e) {
      console.log('onHashChange');
      e && e.preventDefault();

      const hash = location.hash;
      const items = this.$refs.scrollactive.items;
      let activeItem;
      for (let i = 0, len = items.length, item; i < len; i++) {
        item = items[i];
        if (item.hash === hash) {
          activeItem = item;
          break;
        }
      }
      if (!activeItem) {
        return;
      }
      activeItem.click();
      this.scrollNav(activeItem);
    },
    onActiveNavChanged(event, currentItem) {
      if (!currentItem) {
        return;
      }

      const isByScroll = event && event.type === 'scroll';
      isByScroll && this.scrollNav(currentItem);

      // change url
      if (location.href !== currentItem.href) {
        history.pushState(null, null, currentItem.href);
      }
    },
    scrollNav(currentItem) {
      // scroll nav
      const leftContainer = this.$refs.leftContainer;
      const containerOffsetHeight = leftContainer.offsetHeight;
      const rect = currentItem.parentElement.getBoundingClientRect();
      if (rect.top < 0 || rect.bottom > containerOffsetHeight) {
        const scrollTop =
          currentItem.offsetTop -
          containerOffsetHeight +
          currentItem.offsetHeight;
        leftContainer.scrollTo
          ? leftContainer.scrollTo(0, scrollTop)
          : (leftContainer.scrollTop = scrollTop);
      }
    }
  }
};
</script>

<style lang="scss">
@import '../style/color.scss';
@import '../style/config.xl.scss';

$chart-nav-width: 200px;
$chart-icon-width: 25px;
$chart-icon-border: 1px;

$toolbar-height: 30px;

$nav-height: 50px;
$nav-active-bg: #5470c6;
$nav-hover-border: $nav-active-bg;

$nav-text-color: #6e7079;
$nav-hover-text-color: #464646;

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

  ::-webkit-scrollbar {
    height: 4px;
    width: 4px;
    -webkit-transition: all 0.3s ease-in-out;
    transition: all 0.3s ease-in-out;
    border-radius: 2px;
    background: #fff;
  }

  ::-webkit-scrollbar-button {
    display: none;
  }

  ::-webkit-scrollbar-thumb {
    width: 4px;
    min-height: 15px;
    background: rgba(50, 50, 50, 0.2) !important;
    -webkit-transition: all 0.3s ease-in-out;
    transition: all 0.3s ease-in-out;
    border-radius: 2px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.5) !important;
  }
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
    border-bottom: 1px solid #e1e5f2;
    font-weight: normal;
    color: #464646;
    font-size: 20px;
  }
  .chart-type-head span {
    font-size: 16px;
    padding-left: 5px;
    color: #949cb1;
    font-weight: 200;
  }
}

#left-container {
  position: sticky;
  left: 0;
  top: 0;
  float: left;
  height: calc(100%);
  width: $chart-nav-width;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  // scroll-behavior: smooth;
  overscroll-behavior: contain;
}

#toolbar {
  position: fixed;
  right: 30px;
  top: 20px;
  height: $toolbar-height;
  background-color: #fff;
  border-radius: $toolbar-height / 2;
  // color: #fff;
  padding: 4px 15px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

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
  background-color: #fff;
  overflow-y: hidden;
  color: #111;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);

  &:hover {
    overflow-y: auto;

    a {
      text-decoration: none;
    }
  }

  li {
    // transition: background-color 0.5s;

    a {
      height: 45px;
      padding: 10px 0 10px 20px;
      display: block;
      // transition: background-color 0.5s;
      text-decoration: none;
      color: $nav-text-color;

      .chart-name {
        display: inline-block;
        position: relative;
        vertical-align: middle;
        margin-left: 10px;
      }

      .chart-icon {
        content: '';
        width: 20px;
        display: inline-block;
        border-radius: 50%;
        vertical-align: middle;

        svg {
          width: 100% !important;
          height: auto !important;
        }
      }

      &.active {
        background-color: $nav-active-bg;
        color: #fff;

        .chart-icon * {
          fill: #fff;
        }
      }

      &.active:hover {
        color: #fff;
      }
    }

    &:hover {
      border-right: 4px solid $nav-hover-border;

      a {
        color: $nav-hover-text-color;
      }
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
</style>
