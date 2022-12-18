<script lang="ts" setup>
const onTop = ref(true);
function onScrollHandler() {
  onTop.value = window.scrollY < 5;
}
onMounted(() => {
  document.addEventListener("scroll", onScrollHandler);
});
onBeforeUnmount(() => {
  document.removeEventListener("scroll", onScrollHandler);
});
</script>

<template>
  <div class="layout">
    <div class="layout-header">
      <Nav :class="{ onTop: onTop }"></Nav>
    </div>
    <div class="layout-body">
      <slot />
    </div>
    <div class="scroll-top">
      <a href="#top">
        <Icon name="la:arrow-up" />
      </a>
    </div>
  </div>
</template>


<style lang="scss">
@import "@/assets/scss/_base.scss";
.layout {
  min-height: 100vh;
  &-header {
    @extend .v-stack;
    height: 100%;
  }
  &-body {
    padding-top: 50px;
  }
}

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
    box-shadow: $shadow-1;
  }
}
</style>