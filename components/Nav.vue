<script lang="ts" setup>
import { useMediaQuery } from "@vueuse/core";
const isLarge = useMediaQuery("(min-width: 768px)");
</script>

<template>
  <nav class="Nav">
    <div class="Nav-ctn">
      <NuxtLink to="/">
        <span v-if="isLarge">HOME</span>
        <Icon name="la:home" v-else />
      </NuxtLink>
      <NuxtLink to="/board">
        <span v-if="isLarge">BOARD</span>
        <Icon name="icon-park-outline:ranking" v-else />
      </NuxtLink>
      <NuxtLink to="/live">
        <span v-if="isLarge">LIVE</span>
        <Icon name="fluent:live-24-filled" v-else />
      </NuxtLink>
      <NuxtLink to="/login">
        <span v-if="isLarge">LOGIN</span>
        <Icon name="clarity:login-line" v-else />
      </NuxtLink>
    </div>
  </nav>
</template>


<style lang="scss" scoped>
@import "@/assets/scss/_base.scss";
.Nav {
  @extend .center;
  height: 50px;
  &-ctn {
    @extend .h-stack;
    width: 70vw;
    justify-content: space-between;
    a {
      @extend .center;
      width: 80%;
      height: 100%;
      text-decoration: none;
      color: white;
      font-size: 1.5rem;
      font-weight: 600;
      transition: all 0.3s ease;
      border-radius: 5px;
      &:hover {
        color: $primary;
        background: white;
      }
    }
  }
}
</style>
