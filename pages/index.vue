<script lang="ts" setup>
</script>

<template>
  <div class="home">
    <div class="home-ctn">
      <h1>테마주를 모아보자!</h1>
      <h2>최근 10거래일 상승 데이터를 정리해요</h2>
      <h2>무료이고 매일 갱신하고 있어요</h2>
      <h3>매수 매도 추천 아닙니다. 잘 보고 판단하세요</h3>
    </div>
  </div>
</template>


<style lang="scss" scoped>
@import "@/assets/scss/_base.scss";

.home {
  @extend .center;
  background: white;
  &-ctn {
    @extend .v-stack;
    min-height: 100vh;
    width: 95%;
    padding: 20px;
    * {
      padding: 10px 0;
    }
  }
}
</style>
