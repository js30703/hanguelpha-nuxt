<script lang="ts" setup>
import { fetchRank } from "@/axiosCS";
const { date, ranks } = await fetchRank();
console.log(ranks);
const _date = new Date(date);
const date_kor = `${_date.getFullYear()}년 ${
  _date.getMonth() + 1
}월 ${_date.getDate()}일`;
// <!--  "name", "code", "tradingValue", "detail", "summary", "closeToday", "ratioTradingMarketCap", "marketValue", "eps", "bps", "매출액", "영업이익", "당좌비율" ] -->
</script>

<template>
  <div class="main">
    <section class="main-ctn">
      <h1>한국 급등주 목록</h1>
      <h2 class="date">기간 : 11 거래일 전 ~ {{ date_kor }}</h2>
      <div class="rankCard" :key="rank.name" v-for="rank in ranks">
        <div class="rankCard__name">{{ rank.name }}</div>
        <div class="rankCard__price">{{ rank.closeToday }}</div>
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
    .rankCard {
      @extend .h-stack;
      @extend .center;
      margin: 20px;
      width: 100%;
      height: 100%;
      border: 1px solid black;
      border-radius: 10px;
      padding: 10px;
    }
  }
}
</style>