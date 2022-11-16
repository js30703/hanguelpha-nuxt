<script lang="ts" setup>
import { fetchRank } from "@/axiosCS";
import { io } from "socket.io-client";
const socket = io("wss://socket.stocks-for-scalping.com", {
  reconnectionDelayMax: 10000,
});
const { date, ranks } = await fetchRank();

function dateFormat(date: string) {
  const _date = new Date(date);
  const date_kor = `${_date.getFullYear()}년 ${
    _date.getMonth() + 1
  }월 ${_date.getDate()}일`;
  return date_kor;
}
</script>

<template>
  <div class="main">
    <section class="main-ctn">
      <h1>한국 급등주 목록</h1>
      <h2 class="date">기간 : 10 거래일 전 ~ {{ dateFormat(date) }}</h2>
      <div class="Card" :key="rank.name" v-for="rank in ranks">
        <div class="Card-header">
          <div class="name">{{ rank.name }}</div>
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
              <div class="date">{{ dateFormat(detail.date) }}</div>
              <div class="close">{{ detail.close }} 원</div>
              <div class="ratio">{{ detail.ratio }} %</div>
              <div class="value">
                {{ detail.value.toLocaleString() }} 백만원
              </div>
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
  }
}
</style>