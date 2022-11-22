<script lang="ts" setup>
const props = defineProps(["tooltip"]);
</script>

<template>
  <div class="tooltip">
    <slot />
    <span>{{ props.tooltip }}</span>
  </div>
</template>


<style lang="scss" scoped>
@import "@/assets/scss/_base.scss";
.tooltip {
  font-size: 20px;
  margin: 8px;
  cursor: pointer;
  font-weight: bold;
  margin-left: 10px;

  position: relative;
  display: inline-block;
  border-bottom: 1px dotted black;
}

/* Tooltip text */
.tooltip span {
  visibility: hidden;
  width: 120px;
  background-color: $primary;
  color: #fff;
  font-size: 12px;
  text-align: center;
  padding: 5px 0;
  border-radius: 6px;

  /* Position the tooltip text - see examples below! */
  position: absolute;

  z-index: 1;
  width: 120px;
  bottom: 100%;
  left: 50%;
  margin-left: -60px;
}

/* Show the tooltip text when you mouse over the tooltip container */
.tooltip:hover span {
  visibility: visible;
}
</style>
