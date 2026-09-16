<template>
  <section class="editor-navigation">
    <div class="menu-button" @click="toggleNav" role="button">
      <span :class="isNavOpen ? 'close-icon' : 'hamburger-icon'"></span>
    </div>
    <nav class="navbar" :class="{ 'nav-closed': !isNavOpen }">
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
            :id="exampleItem.id"
            v-for="exampleItem in categoryObj.examples"
            :key="exampleItem.id"
            :class="{ 'is-active': currentExample.id === exampleItem.id }"
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
  </section>
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

  props: {
    currentExample: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      rawCategoryData: null,
      isNavOpen: false
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
    this.markExampleActive();
  },

  beforeDestroy() {
    if (this._lazyload && typeof this._lazyload.destroy === 'function') {
      this._lazyload.destroy();
    }
  },

  methods: {
    onSelectExample(example) {
      this.$emit('select-example', example);
      this.isNavOpen = false;
    },
    toggleNav() {
      this.isNavOpen = !this.isNavOpen;
    },
    markExampleActive() {
      if (!this.currentExample || !this.currentExample.id) return;
      this.$nextTick(() => {
        const id = String(this.currentExample.id);
        const exampleNode = document.getElementById(id);

        if (!exampleNode) return;
        const detailsElement = exampleNode.closest
          ? exampleNode.closest('details')
          : null;
        if (detailsElement) detailsElement.open = true;
        if (exampleNode.scrollIntoView)
          exampleNode.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (exampleNode.focus) exampleNode.focus();
      });
    }
  }
};
</script>

<style lang="scss">
$breakpoint-sm: 768px;
$primary-color: #fb628b;
$light-gray: #f0f0f0;
$dark-gray: #666;
$transition-speed: 0.3s;

@mixin icon-bar {
  position: absolute;
  width: 25px;
  height: 2px;
  background-color: #fff;
  transition: all $transition-speed ease-in-out;
}

.editor-navigation {
  nav.navbar {
    overflow: auto;
    width: 100%;
    height: 100%;

    @media (max-width: $breakpoint-sm) {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 1000;
      background-color: #fff;
      overflow-y: auto;
      transform: translateX(0);
      transition: transform $transition-speed ease-in-out;
      padding-bottom: 20px;

      &.nav-closed {
        transform: translateX(-100%);
      }
    }
  }

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
        background-color: $light-gray;
      }

      .arrow {
        border: solid $dark-gray;
        border-width: 0 2px 2px 0;
        display: inline-block;
        padding: 3px;
        transform: rotate(45deg);
        transition: transform 0.2s ease;
      }
    }

    &[open] {
      summary.chart-type-head {
        background-color: $light-gray;

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
        background-color: $light-gray;
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

.menu-button {
  position: fixed;
  bottom: 10px;
  right: 10px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: $primary-color;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 1001;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);

  @media (min-width: $breakpoint-sm) {
    display: none;
  }
}

.hamburger-icon,
.close-icon {
  position: relative;
  width: 25px;
  height: 2px;
  background-color: #fff;
  transition: all $transition-speed ease-in-out;

  &::before,
  &::after {
    content: '';
    @include icon-bar;
  }
}

.hamburger-icon::before {
  top: -8px;
}

.hamburger-icon::after {
  top: 8px;
}

.close-icon {
  transform: rotate(45deg);

  &::before {
    transform: rotate(90deg);
    top: 0;
  }

  &::after {
    transform: rotate(0deg);
    top: 0;
    opacity: 0;
  }
}
</style>
