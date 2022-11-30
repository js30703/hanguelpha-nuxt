<script lang="ts" setup>
</script>

<template>
  <div class="layout">
    <Nav></Nav>
    <slot />
    <div class="scroll-top">
      <a href="#top">
        <Icon name="la:arrow-up" />
      </a>
    </div>
  </div>
</template>


<style lang="scss">
@import "@/assets/scss/_base.scss";
.scroll-top {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  z-index: 100;
  a {
    @extend .center;
    width: 2rem;
    height: 2rem;
    background-color: $primary;
    border-radius: 50%;
    color: white;
  }
}
</style>