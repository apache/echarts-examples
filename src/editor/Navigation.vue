<template>
  <nav class="editor-nav navbar">
    <details
      class="nav"
      v-for="categoryObj in exampleList"
      :key="categoryObj.category"
    >
      <summary
        class="chart-type-head"
        :id="'chart-type-' + categoryObj.category"
      >
        {{ $t('chartTypes.' + categoryObj.category) }}
        <span class="arrow"></span>
      </summary>

      <ul class="row" :id="'chart-row-' + categoryObj.category">
        <li
          class="col-xs-12"
          v-for="exampleItem in categoryObj.examples"
          :key="exampleItem.id"
          :class="{ 'is-active': currentExampleId === exampleItem.id }"
        >
          <ExampleCard
            :example="exampleItem"
            :embedded="true"
            @select-example="onSelectExample"
          ></ExampleCard>
        </li>
      </ul>
    </details>
  </nav>
</template>

<script>
import {
  buildExampleListByCategory,
  createExampleList,
  createLazyLoader
} from '../common/exampleCatalogUtils.js';
import CHART_LIST from '../data/chart-list-data';
import CHART_LIST_GL from '../data/chart-list-data-gl';
import ExampleCard from '../explore/ExampleCard.vue';

export default {
  components: {
    ExampleCard
  },

  props: {},

  data() {
    return {
      rawCategoryData: null,
      currentExampleId: ''
    };
  },

  computed: {
    exampleList() {
      if (!this.rawCategoryData) {
        return [];
      }
      return createExampleList(this.rawCategoryData);
    }
  },

  created() {
    this.rawCategoryData = buildExampleListByCategory(
      CHART_LIST,
      CHART_LIST_GL
    );
  },

  mounted() {
    this._lazyload = createLazyLoader();
  },

  beforeDestroy() {
    if (this._lazyload && typeof this._lazyload.destroy === 'function') {
      this._lazyload.destroy();
    }
  },

  methods: {
    onSelectExample(example) {
      this.currentExampleId = example.id;
      this.$emit('select-example', example);
    }
  }
};
</script>

<style lang="scss">
.editor-nav {
  details.nav {
    summary.chart-type-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      margin: 0;
      cursor: pointer;
      list-style: none;
      outline: none;
      user-select: none;

      &::-webkit-details-marker {
        display: none;
      }

      &:hover {
        background-color: #f0f0f0;
      }

      .arrow {
        border: solid #666;
        border-width: 0 2px 2px 0;
        display: inline-block;
        padding: 3px;
        transform: rotate(45deg);
        transition: transform 0.2s ease;
      }
    }

    &[open] {
      summary.chart-type-head {
        background-color: #f0f0f0;

        .arrow {
          transform: rotate(-135deg) translate(-2px, -2px);
        }
      }

      .row {
        max-height: 100%;
        opacity: 1;
      }
    }

    .row {
      list-style: none;
      margin: 0;
      max-height: 0;
      overflow: hidden;
      opacity: 0;
      transition: max-height 0.3s cubic-bezier(0, 1, 0, 1), opacity 0.2s ease,
        padding 0.3s ease;
    }

    li {
      padding: 4px;

      &.is-active {
        background-color: #f0f0f0;
      }
    }
  }

  .example-list-item {
    margin: 0;
  }

  .example-link {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 10px;

    .example-link-image {
      margin-top: 0;
      width: 48px;
      flex: 0 0 48px;
    }

    .example-info {
      flex: 1;
      min-width: 0;

      .example-version-since {
        display: none;
      }
    }
  }
}
</style>
