<template>
  <div class="example-list-item">
    <a target="_blank" class="example-link" :href="exampleLink">
      <picture class="chart-area">
        <source :data-srcset="screenshotURLWebP" type="image/webp" />
        <source :data-srcset="screenshotURLPNG" type="image/png" />
        <img
          class="chart-area"
          src="../asset/placeholder.jpg"
          :data-src="screenshotURLPNG"
        />
      </picture>
      <!-- <img
        class="chart-area"
        src="../asset/placeholder.jpg"
        :data-src="screenshotURL"
      /> -->
    </a>
    <div>
      <div class="example-langs">
        <a class="js" :href="exampleLink" target="_blank">JS</a>
        <a
          class="ts"
          :href="exampleLink + '&lang=ts'"
          v-if="example.ts"
          target="_blank"
          >TS</a
        >
      </div>
      <div>
        <div class="example-title">{{ title }}</div>
        <div class="example-subtitle" v-if="showSubtitle">{{ subtitle }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { store } from '../common/store';
import { URL_PARAMS } from '../common/config';

export default {
  props: ['example'],

  computed: {
    title() {
      return (
        (store.locale === 'zh' ? this.example.titleCN : this.example.title) ||
        this.example.title ||
        ''
      );
    },

    showSubtitle() {
      return store.locale === 'zh';
    },

    subtitle() {
      return this.example.title || '';
    },

    exampleTheme() {
      const example = this.example;
      return example.theme || (store.darkMode ? 'dark' : '');
    },

    exampleLink() {
      const example = this.example;
      const hash = ['c=' + example.id];
      const exampleTheme = this.exampleTheme;
      if (example.isGL) {
        hash.push('gl=1');
      }
      if (exampleTheme) {
        hash.push('theme=' + exampleTheme);
      }
      if ('local' in URL_PARAMS) {
        hash.push('local');
      }
      if ('useDirtyRect' in URL_PARAMS) {
        hash.push('useDirtyRect');
      }
      return './editor.html?' + hash.join('&');
    },

    screenshotURLWithoutExt() {
      const example = this.example;
      const themePostfix = this.exampleTheme ? '-' + this.exampleTheme : '';
      const folder = example.isGL ? 'data-gl' : 'data';
      return `${store.cdnRoot}/${folder}/thumb${themePostfix}/${example.id}`;
    },

    screenshotURLWebP() {
      return this.screenshotURLWithoutExt + `.webp?_v_=${store.version}`;
    },

    screenshotURLPNG() {
      return this.screenshotURLWithoutExt + `.png?_v_=${store.version}`;
    }
  }
};
</script>

<style lang="scss">
@import '../style/color.scss';

.example-list-item {
  width: 100%;
  max-width: 350px;
  margin-bottom: 30px;
  position: relative;

  .example-link {
    margin-top: 10px;
    border-radius: 5px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
    overflow: hidden;
    display: block;
  }

  .chart-area {
    width: 100%;
    height: 100%;
    cursor: pointer;
    transition: 0.3s ease-in-out;

    &:hover {
      transform: scale(1.2);
    }
  }

  .example-title {
    color: $clr-primary;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    padding: 10px 10px 2px 10px;
    margin: 0;
    display: block;
    font-size: 14px;
    text-align: left;
  }

  .example-subtitle {
    font-size: 12px;
    text-align: left;
    color: #aaa;
    display: block;
    // font-weight: 200;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin: 3px 0 0 0;
    padding-left: 10px;
  }

  .example-langs {
    margin-top: 10px;
    float: right;

    & > * {
      display: inline-block;
      padding: 1px 6px;
      margin-left: 5px;
      vertical-align: middle;
      border-radius: 3px;
      font-size: 10px;
      // font-weight: bold;
      opacity: 0.8;

      &:hover {
        opacity: 1;
      }
    }

    .js {
      background: #f7df1e;
      color: #444;
    }

    .ts {
      background: #3178c6;
      color: #eee;
    }
  }

  .example-info {
    padding: 5px 0;

    font-weight: bold;

    .chart-icon {
      float: right;

      .chart-delete {
        display: none;

        transition: 1s;
      }
    }
  }

  &:hover .example-info .chart-icon .chart-delete {
    display: block;

    text-decoration: none;
  }
}
</style>
