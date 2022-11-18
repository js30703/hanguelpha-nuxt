<script lang="ts" setup>
import { useDateFormat } from "@vueuse/core";
import { useRankStore } from "@/store/ranks";

const { data } = useFetch("/api/rank", {
  onRequestError: (err) => {
    throw err;
  },
  onResponseError: (err) => {
    throw err;
  },
});
const rankStore = useRankStore();
rankStore.setRanks(data.value);
</script>

<template>
  <div class="main">
    <section class="main-ctn">
      <NuxtLink to="live">LIVE</NuxtLink>
      <h1>한국 급등주 목록</h1>
      <h2 class="date">
        기간 : 10 거래일 전 ~
        {{ useDateFormat(data.date, "YYYY년 MM월 DD일").value }}
      </h2>
      <RankCard :key="rank?.name" v-for="rank in data.ranks" :rank="rank" />
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
  }
}
</style>