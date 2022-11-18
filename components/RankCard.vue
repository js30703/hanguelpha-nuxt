<script lang="ts" setup>
import { useDateFormat } from "@vueuse/core";
const { rank } = defineProps(["rank"]);
</script>

<template>
  <div class="Card">
    <div class="Card-header">
      <NuxtLink
        class="name"
        :to="`https://m.stock.naver.com/domestic/stock/${rank.code}/total`"
        target="_blank"
      >
        {{ rank.name }}
      </NuxtLink>
      <div class="price">{{ rank.ratioTradingMarketCap }}%</div>
      <div class="price">{{ rank.closeToday }}원</div>
    </div>
    <div class="Card-body">
      거래 상세
      <div class="detail">
        <div
          class="detail-ctn"
          v-for="detail in rank.detail"
          :key="detail.date"
        >
          <div class="date">
            {{ useDateFormat(detail.date, "MM월 DD일").value }}
          </div>
          <div class="close">{{ detail.close }} 원</div>
          <div class="ratio">{{ detail.ratio }} %</div>
          <div class="value">{{ detail.value.toLocaleString() }} 백만원</div>
        </div>
      </div>
    </div>
    <div class="text-left m-1">자세히보기</div>
    <div class="text-left m-1">시가총액: {{ rank.marketValue }}</div>
    <div class="text-left m-1">
      거래 대금 합: {{ rank.tradingValue.toLocaleString() }} 백만원
    </div>
    <div class="text-left m-1">시가총액: {{ rank.marketValue }}</div>
    <div class="text-left m-1">eps: {{ rank.eps }}</div>
    <div class="text-left m-1">bps: {{ rank.bps }}</div>
    <div class="text-left m-1">매출액(억원): {{ rank.매출액 }}</div>
    <div class="text-left m-1">영업이익(억원): {{ rank.영업이익 }}</div>
    <div class="text-left m-1">당좌비율(%): {{ rank.당좌비율 }}</div>
  </div>
</template>


<style lang="scss" scoped>
@import "@/assets/scss/_base.scss";
.Card {
  @extend .v-stack;
  @extend .center;
  margin: 20px;
  width: 100%;
  max-width: 480px;
  height: 100%;
  border: 1px solid black;
  border-radius: 10px;
  padding: 10px;
  &-header {
    @extend .h-stack;
    @extend .center;
    width: 100%;
    justify-content: space-between;
    .name {
      font-size: 20px;
      font-family: "Pritandard-Bold";
    }
    .price {
      font-size: 20px;
      font-weight: bold;
      margin-left: 10px;
    }
  }
  &-body {
    @extend .v-stack;
    width: 100%;

    .detail {
      @extend .v-stack;
      width: 100%;
      flex-direction: column-reverse;
      &-ctn {
        @extend .h-stack;
        @extend .center;
        width: 100%;
        justify-content: space-between;
        .date {
          font-size: 15px;
          font-family: "Pritandard-Bold";
        }
        .ratio {
          font-size: 15px;
          font-weight: bold;
          margin-left: 10px;
        }
        .close {
          font-size: 15px;
          font-weight: bold;
          margin-left: 10px;
        }
        .value {
          font-size: 15px;
          font-weight: bold;
          margin-left: 10px;
        }
      }
    }
  }
}
</style>
