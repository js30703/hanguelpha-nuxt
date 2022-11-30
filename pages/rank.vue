<script lang="ts" setup>
import { useDateFormat } from "@vueuse/core";
const route = useRoute();
let count = route.query.count ? Number(route.query.count) : 0;
if (count == NaN || 4 < count || count < 2) {
  count = 0;
}

const { data } = useFetch<any>(`/api/rank?count=${count}`, {
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
      <div class="header">
        <h1>한국 급등주 목록</h1>
        <h5 class="date">
          {{ useDateFormat(data.date, "YYYY년 MM월 DD일").value }} 종가 기준,
          ({{ data.ranks.length }}) 종목
        </h5>
        <h5>M{{ data.mean.toFixed(2) }}, D{{ data.std.toFixed(2) }}</h5>
      </div>
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
    .header {
      padding: 20px;
      width: 95%;
      h1 {
        padding: 10px 0;
      }
      h5 {
        padding: 2px 0;
      }
    }
    .cards {
      @extend .h-stack;
      @extend .center;
      flex-wrap: wrap;
    }
  }
}
</style>