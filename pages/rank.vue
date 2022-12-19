<script lang="ts" setup>
import { useDateFormat } from "@vueuse/core";
import { cutFixed } from "@/utils/mean";
const { data } = useFetch<any>(`/api/rank`, {
  date: "2021-09-10",
  ranks: [],
} as any);

const count = ref(0);
const marketCapRange = ref([0, 1000]);
const volumeRatio = ref([0, 100]);
const tradeAmount = ref([0, 100]);

const showFilter = ref(false);
const toggleFilter = () => {
  showFilter.value = !showFilter.value;
  const layout = document.querySelector("body").classList;
  showFilter.value ? layout.add("openModal") : layout.remove("openModal");
};
let _ranks = computed(() => {
  if (data.value) {
    let ranks = data.value.ranks;
    if (count.value > 0) {
      ranks = ranks.filter((rank) => {
        if (count.value == 5) return rank.detail.length >= Number(count.value);
        return rank.detail.length === Number(count.value);
      });
    }

    ranks = ranks.filter((rank) => {
      const num_marketCap = cutFixed(rank.marketValue) * 0.01;
      return (
        num_marketCap > marketCapRange.value[0] &&
        num_marketCap < marketCapRange.value[1]
      );
    });

    ranks = ranks.filter(
      (rank) =>
        rank.ratioTradingMarketCap > volumeRatio.value[0] &&
        rank.ratioTradingMarketCap < volumeRatio.value[1]
    );

    ranks = ranks.filter((rank) => {
      const num_tradingValue = rank.tradingValue * 0.0001;
      return (
        num_tradingValue > tradeAmount.value[0] &&
        num_tradingValue < tradeAmount.value[1]
      );
    });

    return ranks;
  }
  return [];
});
</script>

<template>
  <main class="main">
    <div class="main-ctn">
      <div class="ft-btn" @click="toggleFilter">
        <Icon name="ic:twotone-close" v-if="showFilter" />
        <Icon name="la:search" v-else />
      </div>
      <div class="header">
        <h1>테마모아 순위</h1>
        <h5 class="date">
          {{ useDateFormat(data.date, "YYYY년 MM월 DD일").value }} 종가 기준,
          {{ _ranks.length }} 종목
        </h5>
        <p>
          ** 본 페이지에서 언급하는 내용은 개인적인 의견과 판단이며, 시장에
          참여하시는 분들의 이해를 돕기 위한 목적으로 제작되었습니다.
          <br />투자결정에 대한 최종판단은 오로지 자신의 판단으로 하여야 하며,
          그로 인한 투자결과에 따른 책임도 본인에게 귀속됩니다.
        </p>
      </div>
      <Transition name="bounce">
        <div class="filter" v-if="showFilter">
          <div class="filter-header">
            <h5 class="date">
              {{ useDateFormat(data.date, "YYYY년 MM월 DD일").value }} 종가
              기준, {{ _ranks.length }} 종목
            </h5>
          </div>
          <div class="filter-ctn">
            <div class="filter-item">
              <label for="count">신호 횟수</label>
              <select v-model="count" id="count">
                <option value="0">전체</option>
                <option value="2">2개</option>
                <option value="3">3개</option>
                <option value="4">4개</option>
                <option value="5">5회 이상</option>
              </select>
            </div>
            <div class="filter-item">
              <label for="market-cap">시가총액 (백억)</label>
              <InputRange :range="marketCapRange" />
            </div>
            <div class="filter-item">
              <label for="market-cap">거래대금합 (백억)</label>
              <InputRange :range="tradeAmount" :max="100" />
            </div>
            <div class="filter-item">
              <label for="market-cap">거래대금 평균 / 시가총액 (%)</label>
              <InputRange :range="volumeRatio" :max="100" />
            </div>
          </div>
        </div>
      </Transition>
      <div class="cards">
        <RankCard :key="rank?.name" v-for="rank in _ranks" :rank="rank" />
      </div>
    </div>
  </main>
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
      * {
        padding: 10px 0;
      }
      h1 {
        padding: 10px 0;
      }
      h5 {
        padding: 2px 0;
      }
      p {
        font-size: 10px;
        color: gray;
      }
    }
    .ft-btn {
      @extend .center;
      position: fixed;
      bottom: 1rem;
      left: 1rem;
      z-index: 100;
      color: white;
      border-radius: 50%;
      padding: 5px;
      background: $primary;
      cursor: pointer;
      width: 1.6rem;
      height: 1.6rem;
      box-shadow: $shadow-1;
      font-size: 20px;
    }
    .filter {
      @extend .v-stack;
      @include responsive(width, (max(200px, 80%), 500px, 80%));
      @include responsive(bottom, (60px, 10px, 10px));
      align-items: flex-start;
      position: fixed;
      background-color: white;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 10px;

      height: 50vh;
      bottom: 0;

      z-index: 50;
      box-shadow: $shadow-1;
      .filter-header {
        width: 100%;
        h5 {
          font-size: 15px;
        }
      }

      .filter-ctn {
        @extend .v-stack;
        padding-bottom: 20px;
        overflow-y: scroll;
        overflow-x: hidden;
        margin-top: 10px;
        .filter-item {
          @extend .v-stack;
          margin: 10px;
          label {
            font-size: 13px;
            color: black;
            width: 100%;
            padding: 5px;
          }
          select {
            width: 100%;
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 5px;
            font-size: 1.6em;
            color: gray;
          }
        }
      }
    }
    .cards {
      @extend .h-stack;
      @extend .center;
      flex-wrap: wrap;
    }
  }
}
.bounce-enter-active {
  animation: bounce-in 0.4s;
}
.bounce-leave-active {
  animation: bounce-in 0.2s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
</style>

