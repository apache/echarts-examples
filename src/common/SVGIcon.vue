<template>
  <svg
    role="img"
    class="svg-icon"
    :class="className"
    :width="size"
    :height="size"
    v-bind="$attrs"
  >
    <use :href="symbolHref"></use>
  </svg>
</template>

<script>
export default {
  name: 'SVGIcon',
  props: {
    name: { type: String, required: true },
    size: { type: [Number, String], default: 12 },
    className: { type: [String, Array, Object], default: '' }
  },
  computed: {
    symbolHref() {
      return `../asset/sprite.svg#${this.name}`;
    }
  }
};
</script>

<style scoped>
.svg-icon {
  display: inline-block;
  vertical-align: middle;
}
</style>
