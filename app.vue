<script lang="ts" setup>
useHead({
  htmlAttrs: {
    lang: "en",
  },
});
</script>

<template>
  <NuxtLayout>
    <NuxtLoadingIndicator color="white" />
    <NuxtPage />
  </NuxtLayout>
</template>

<style lang="scss" >
@import "~/assets/scss/_base.scss";
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>