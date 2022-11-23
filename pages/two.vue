<script lang="ts" setup>
import { useDateFormat } from "@vueuse/core";

const { data } = useFetch("/api/rank", {
  onRequestError: (err) => {
    throw err;
  },
  onResponseError: (err) => {
    throw err;
  },
});
</script>

<template>
  <div class="main">
    <section class="main-ctn">
      <h1>한국 급등주 목록 ({{ data.ranks.length }})</h1>
      <h2 class="date">
        {{ useDateFormat(data.date, "YYYY년 MM월 DD일").value }} 종가 기준
      </h2>
      <div class="cards">
        <RankCard :key="rank?.name" v-for="rank in data.ranks" :rank="rank" />
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/scss/_base.scss";
.main {
  @extend .center;
  background: white;
  &-ctn {
    @extend .v-stack;
    width: 95vw;
    margin: 20px;
    .cards {
      @extend .h-stack;
      @extend .center;
      flex-wrap: wrap;
    }
  }
}
</style>