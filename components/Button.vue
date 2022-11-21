<script lang="ts" setup>
</script>

<template>
  <div class="button">
    <div class="button-ctn">
      <slot />
    </div>
  </div>
</template>


<style lang="scss" scoped>
@import "@/assets/scss/_base.scss";
.button {
  margin: 5px;
  &-ctn {
    cursor: pointer;
    color: $primary;
    border: 1px solid $primary;
    padding: 5px 15px;
    border-radius: 20px;
    // box-shadow: $shadow-1;
    &:hover {
      background-color: $primary;
      color: white;
    }
  }
}
</style>
