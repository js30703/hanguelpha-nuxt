<script lang="ts" setup>
import { useDateFormat } from "@vueuse/core";
const { rank } = defineProps(["rank"]);
function moneyScaleUp(money: number) {
  return (
    (money * 0.01).toLocaleString("kr", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }) + "억"
  );
}
const open = ref(false);
const toggleOpen = () => {
  open.value = !open.value;
};
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
      <!-- <div class="price">{{ rank.closeToday }}원</div> -->
      <div class="price">{{ rank.ratioTradingMarketCap }}%</div>
      <!-- <button @click="toggleOpen">자세히</button> -->
    </div>
    <div class="Card-body">
      <table>
        <thead>
          <h5>거래량</h5>
          <tr class="bold">
            <th>날짜</th>
            <th>종가</th>
            <th>상승률</th>
            <th>거래대금</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="detail in rank.detail" :key="detail.date">
            <td class="bold">
              {{ useDateFormat(detail.date, "MM월 DD일").value }}
            </td>
            <td>{{ detail.close }} 원</td>
            <td>{{ detail.ratio }} %</td>
            <td>{{ moneyScaleUp(detail.value) }}</td>
          </tr>
        </tbody>
      </table>

      <div class="finance">
        <h5>개요</h5>
        <div class="row m-1">
          <div class="row">
            <div class="name">EPS</div>
            <div class="value">{{ rank.eps }}</div>
          </div>
          <div class="row">
            <div class="name">BPS</div>
            <div class="value">{{ rank.bps }}</div>
          </div>
        </div>

        <div class="row">
          <div class="name">거래 대금 합</div>
          <div class="value">{{ moneyScaleUp(rank.tradingValue) }}</div>
        </div>
        <div class="row">
          <div class="name">시가총액</div>
          <div class="value">{{ rank.marketValue }}</div>
        </div>
        <div class="v-stack m-3">
          <div class="m-3" v-for="(sent, idx) in rank.summary" :key="idx">
            {{ sent }}
          </div>
        </div>
      </div>

      <div class="finance">
        <table>
          <thead>
            <h5>재무</h5>
            <tr>
              <th></th>
              <th v-for="year in rank.매출액" :key="year">
                {{ year.split("::")[0] }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>당좌비율</td>
              <td v-for="year in rank.당좌비율" :key="year">
                {{ year.split("::")[1] }}
              </td>
            </tr>
            <tr>
              <td>영업이익</td>
              <td v-for="year in rank.영업이익" :key="year">
                {{ year.split("::")[1] }}
              </td>
            </tr>
            <tr>
              <td>매출액</td>
              <td v-for="year in rank.매출액" :key="year">
                {{ year.split("::")[1] }}
              </td>
            </tr>
          </tbody>
          단위: 억, %
        </table>
      </div>
    </div>
  </div>
</template>


<style lang="scss" scoped>
@import "@/assets/scss/_base.scss";
.Card {
  @extend .v-stack;
  @extend .center;
  position: relative;
  margin: 20px;
  width: 300px;
  aspect-ratio: 3/2;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 5px;
  }
  // border: 1px solid gray;
  box-shadow: $shadow-1;
  border-radius: 10px;
  padding: 20px 30px;
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

    h5 {
      width: 100%;
      text-align: left;
      margin-top: 10px;
      font-family: "Pritandard-Regular";
    }
    table {
      margin: 10px 0;
      width: 100%;
      text-align: center;

      thead {
        width: 100%;
        tr {
          @extend .h-stack;
          justify-content: space-between;
          th {
            width: 100%;
            font-family: "Pritandard-Bold";
            padding: 5px 0px;
            font-size: 13px;
          }
        }
      }

      tbody {
        flex-direction: column-reverse;
        @extend .h-stack;
      }

      tr {
        @extend .h-stack;
        justify-content: space-between;
        width: 100%;
        td {
          width: clamp(20px, 100%, 100px);
          padding: 5px 0px;
          font-size: 13px;
        }
      }
    }

    .finance {
      @extend .v-stack;

      width: 100%;
      .name {
        width: 50%;
        text-align: center;
        font-family: "Pritandard-Bold";
        font-size: 15px;
      }
      .value {
        width: 50%;
        text-align: center;

        font-size: 15px;
      }
    }
  }
}
</style>
