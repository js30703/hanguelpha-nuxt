<script lang="ts" setup>
const description = "테마주를 한 눈에 모아서!";
const pageTitle = "테마모아";
const pageUrl = "https://stocks-for-scalping.com"; // Tema
const ogImage = "/og-image.png";

("테마모아");
useHead({
  htmlAttrs: {
    lang: "kr",
  },
  meta: [
    {
      charset: "utf-8",
    },
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1",
    },
    { hid: "description", name: "description", content: description },
    { hid: "og:title", property: "og:title", content: pageTitle },
    { hid: "og:url", property: "og:url", content: pageUrl },
    {
      hid: "og:description",
      property: "og:description",
      content: description,
    },
    {
      hid: "og:image",
      property: "og:image",
      content: ogImage,
    },

    // twitter card
    { hid: "twitter:title", name: "twitter:title", content: pageTitle },
    { hid: "twitter:url", name: "twitter:url", content: pageUrl },
    {
      hid: "twitter:description",
      name: "twitter:description",
      content: description,
    },
    {
      hid: "twitter:image",
      name: "twitter:image",
      content: ogImage,
    },
  ],
  title: `${description} ${pageTitle}`,
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