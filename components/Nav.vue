<script lang="ts" setup>
import { useMediaQuery } from "@vueuse/core";
const isLarge = useMediaQuery("(min-width: 768px)");
</script>

<template>
  <nav class="Nav">
    <div class="Nav-ctn">
      <div class="logo" @click="navigateTo('/')">
        <img src="@/assets/logo.svg" alt="logo" />
      </div>
      <div class="items">
        <NuxtLink to="/rank">
          <span v-if="isLarge">랭 킹</span>
          <Icon name="icon-park-outline:ranking" v-else />
        </NuxtLink>
        <NuxtLink to="/live">
          <span v-if="isLarge">실시간</span>
          <Icon name="fluent:live-24-filled" v-else />
        </NuxtLink>
        <NuxtLink to="/login">
          <span v-if="isLarge">로그인</span>
          <Icon name="clarity:login-line" v-else />
        </NuxtLink>
      </div>
    </div>
  </nav>
</template>


<style lang="scss" scoped>
@import "@/assets/scss/_base.scss";
.Nav {
  @extend .center;
  @include responsive(height, (50px, 60px, 80px));
  @include responsive(border-bottom-left-radius, (15px, 15px, 20px));
  @include responsive(border-bottom-right-radius, (15px, 15px, 20px));

  position: fixed;
  padding-top: 0px;
  z-index: 10;
  background: $primary;
  transition: all 0.3s ease;
  width: 100vw;
  box-shadow: $shadow-1;

  &-ctn {
    @extend .h-stack;
    width: 95vw;
    justify-content: space-between;
    .logo {
      @include responsive(margin-left, (10px, 10px, 30px));
      cursor: pointer;
      img {
        @include responsive(width, (25px, 25px, 30px));

        aspect-ratio: 1;
      }
    }
    .items {
      @extend .h-stack;
      width: 80%;

      a {
        @extend .center;
        @include responsive(font-size, (1.5rem, 1.5rem, 1.6rem));
        height: 100%;
        text-decoration: none;
        color: white;
        font-weight: 600;
        transition: all 0.3s ease;
        border-radius: 5px;
        width: 100%;
        padding: 5px 0;
        margin: 5px 10px;
        &:hover {
          color: $primary;
          background: white;
        }
      }
    }
  }
}
.Nav.onTop {
  padding-top: 20px;
}
</style>
