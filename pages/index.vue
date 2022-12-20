<script lang="ts" setup>
</script>

<template>
  <div class="home">
    <div class="home-ctn">
      <h1>
        테마주를 모아보자! <br />
        테마모아
      </h1>
      <h3>최근 10거래일 상승 데이터를 정리해요</h3>
      <h3>매일 갱신하고 있어요</h3>
    </div>
  </div>
</template>


<style lang="scss" scoped>
@import "@/assets/scss/_base.scss";

.home {
  @extend .center;
  background: white;
  &-ctn {
    margin-top: 20px;
    @extend .v-stack;

    width: 95%;
    padding: 20px;
    * {
      padding: 10px 0;
      width: 100%;
      text-align: center;
    }
  }
}
</style>
