<template>
  <nav class="editor-nav container-fluid">
    <div
      class="navbar"
      v-for="categoryObj in exampleList"
      :key="categoryObj.category"
    >
      <ul class="nav">
        <h3 class="chart-type-head" :id="'chart-type-' + categoryObj.category">
          {{ $t('chartTypes.' + categoryObj.category) }}
        </h3>
        <li class="row" :id="'chart-row-' + categoryObj.category">
          <div
            class="col-1"
            v-for="exampleItem in categoryObj.examples"
            :key="exampleItem.id"
          >
            <ExampleCard :example="exampleItem" :embedded="true"></ExampleCard>
          </div>
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
      EXAMPLE_CATEGORIES: [],
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
      width: 72px;
      flex: 0 0 72px;
    }

    .example-info {
      flex: 1;
      min-width: 0;
    }
  }
}
</style>
