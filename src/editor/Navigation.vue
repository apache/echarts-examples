<template>
  <nav class="editor-nav container-fluid navbar">
    <div
      class="nav"
      v-for="categoryObj in exampleList"
      :key="categoryObj.category"
    >
      <h3 class="chart-type-head" :id="'chart-type-' + categoryObj.category">
        {{ $t('chartTypes.' + categoryObj.category) }}
      </h3>

      <ul class="row" :id="'chart-row-' + categoryObj.category">
        <li
          class="col-xs-12"
          v-for="exampleItem in categoryObj.examples"
          :key="exampleItem.id"
        >
          <ExampleCard
            :example="exampleItem"
            :embedded="true"
            @select-example="onSelectExample"
          ></ExampleCard>
        </li>
      </ul>
    </div>
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
      exampleListByCategory: buildExampleListByCategory(
        CHART_LIST,
        CHART_LIST_GL
      )
    };
  },

  computed: {
    exampleList() {
      return createExampleList(this.exampleListByCategory);
    }
  },

  mounted() {
    this._lazyload = createLazyLoader();
  },

  beforeDestroy() {
    this._lazyload.destroy();
  },

  methods: {
    onSelectExample(example) {
      this.$emit('select-example', example);
    }
  }
};
</script>

<style lang="scss">
.editor-nav {
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
