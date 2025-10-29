import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import messages from './common/i18n';
import EditorPage from './editor/Editor.vue';
import ExplorePage from './explore/Explore.vue';
import ViewPage from './editor/View.vue';
import { store } from './common/store';

/**
 *
 * @param {*} el
 * @param {Object} option
 * @param {string} [option.cdnRoot]
 * @param {string} [option.page] editor | explore
 * @param {string} [option.locale] zh | en
 * @param {string} [option.version]
 */
export function init(el, option) {
  const i18n = createI18n({
    legacy: false,
    locale: option.locale,
    fallbackLocale: 'en',
    messages
  });
  store.cdnRoot = option.cdnRoot;
  store.version = option.version;
  store.locale = option.locale || 'en';

  if (typeof el === 'string') {
    el = document.querySelector(el);
  }
  if (!el) {
    throw new Error("Can't find el.");
  }

  const container = document.createElement('div');
  el.appendChild(container);

  const page = option.page;
  if (page && page !== 'explore') {
    const v4Link = document.getElementById('v4-link');
    v4Link && v4Link.remove();
  }

  const RootComponent =
    {
      editor: EditorPage,
      explore: ExplorePage,
      view: ViewPage
    }[page] || ExplorePage;

  const app = createApp(RootComponent);
  app.use(i18n);
  app.use(ElementPlus);
  app.mount(container);
}
