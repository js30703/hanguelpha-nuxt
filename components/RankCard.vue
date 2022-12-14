<script lang="ts" setup>
import axios from "axios";
import { useDateFormat, useMediaQuery } from "@vueuse/core";
const { rank } = defineProps(["rank"]);
function moneyScaleUp(money: number) {
  return (
    (money * 0.01).toLocaleString("kr", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }) + "억"
  );
}
const isOpen = ref(false);
const pending = ref(true);
const prices = ref([]);
function getPrices() {
  axios.get(`/api/price?code=${rank.code}`).then((res) => {
    res.data.result.forEach((item: any) => {
      rank.detail.forEach((detail: any) => {
        if (item.date === detail.date) {
          item.signal = true;
        }
      });
    });

    prices.value = res.data.result;
    pending.value = false;
  });
}
const toggleOpen = () => {
  isOpen.value = !isOpen.value;
  const layout = document.querySelector("body").classList;
  isOpen.value ? layout.add("openModal") : layout.remove("openModal");
  isOpen.value
    ? getPrices()
    : () => {
        prices.value = [];
        pending.value = true;
      };
};
let commentsOpen = ref(false);
const toggleComments = () => {
  commentsOpen.value = !commentsOpen.value;
};
const isSmallScreen = useMediaQuery("(max-width: 768px)");
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

      <Tooltip tooltip="거래대금 합 / 시가총액">
        {{ rank.ratioTradingMarketCap }}%
      </Tooltip>

      <Button @click="toggleOpen">자세히</Button>
    </div>
    <Modal :isOpen="isOpen">
      <div class="modal-header">
        <div class="row">
          <NuxtLink
            class="name"
            :to="`https://m.stock.naver.com/fchart/domestic/stock/${rank.code}`"
            target="_blank"
          >
            {{ rank.name }}
          </NuxtLink>
          <div class="v-stack">
            <Tooltip tooltip="거래대금 합 / 시가총액">
              {{ rank.ratioTradingMarketCap }}%
            </Tooltip>
            <div class="close">{{ rank.closeToday }}원</div>
          </div>
        </div>
        <Button @click="toggleOpen">
          {{ isSmallScreen ? "X" : "닫기" }}
        </Button>
      </div>
      <div class="Card-body modal-body">
        <table>
          <thead>
            <h4>거래량</h4>
            <tr class="bold">
              <th>날짜</th>
              <th>종가</th>
              <th>상승률</th>
              <th>거래대금</th>
            </tr>
          </thead>
          <tbody v-if="pending">
            <tr v-for="detail in rank.detail" :key="detail.date">
              <td class="bold">
                {{ useDateFormat(detail.date, "MM월 DD일").value }}
              </td>
              <td>{{ detail.close }} 원</td>
              <td>{{ detail.ratio }} %</td>
              <td>{{ moneyScaleUp(detail.value) }}</td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr
              v-for="post in prices"
              :key="post"
              :style="{ color: post.signal ? 'red' : 'black' }"
            >
              <td class="bold">
                {{ useDateFormat(post.date, "MM월 DD일").value }}
              </td>
              <td>{{ post.close }} 원</td>
              <td>{{ post.ratio }} %</td>
              <td>{{ moneyScaleUp(post.value) }}</td>
            </tr>
          </tbody>
        </table>

        <div class="finance">
          <h4>개요</h4>
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
          <div class="row m-1">
            <div class="row">
              <div class="name">거래 대금 합</div>
              <div class="value">{{ moneyScaleUp(rank.tradingValue) }}</div>
            </div>
            <div class="row">
              <div class="name">시가총액</div>
              <div class="value">{{ rank.marketValue }}</div>
            </div>
          </div>
          <Button @click="toggleComments">
            {{ !commentsOpen ? "더 보기" : "닫기" }}</Button
          >
          <div class="v-stack m-3" v-show="commentsOpen">
            <div class="m-3" v-for="(sent, idx) in rank.summary" :key="idx">
              {{ sent }}
            </div>
          </div>
        </div>

        <div class="finance">
          <table>
            <thead>
              <h4>재무</h4>
              <tr>
                <th></th>
                <th v-for="year in rank.매출액" :key="year">
                  {{ year.split("::")[0] }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>매출액</td>
                <td v-for="year in rank.매출액" :key="year">
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
                <td>당좌비율</td>
                <td v-for="year in rank.당좌비율" :key="year">
                  {{ year.split("::")[1] }}
                </td>
              </tr>
            </tbody>
            <div class="info">단위: 억, %</div>
          </table>
        </div>
      </div>
      <div class="modal-footer"></div>
    </Modal>
  </div>
</template>


<style lang="scss" scoped>
@import "@/assets/scss/_base.scss";
.Card {
  @extend .center;
  @include responsive(margin, (10px, 20px, 20px));
  @include responsive(padding, (5px 10px, 10px 20px, 10px 20px));
  @include responsive(width, (110px, 130px, 130px));
  aspect-ratio: 1 / 1.5;
  position: relative;
  overflow-y: auto;
  box-shadow: $shadow-1;
  border-radius: 10px;

  &-header {
    @extend .v-stack;
    @extend .center;
    width: 100%;
    justify-content: space-between;

    .name {
      font-size: 20px;
      margin: 8px 0;
      font-family: "Pritandard-Bold";
    }
  }

  &-body {
    @extend .v-stack;
    @include responsive(width, (80%, 95%, 95%));

    h4 {
      width: 100%;
      text-align: left;
      margin: 10px 0;
      font-family: "Pritandard-Regular";
      color: gray;
    }
    table {
      width: 100%;
      text-align: center;
      .info {
        width: 100%;
        text-align: right;
        font-size: 12px;
      }
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
        @extend .v-stack;
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
  .modal {
    &-header {
      .name {
        margin-left: 20px;
        font-family: "Pritandard-Bold";
        font-size: 25px;
        font-weight: 600;
        min-width: 150px;
      }
      .row {
        @extend .h-stack;
        justify-content: space-between;
        width: 100%;
      }
      .v-stack {
        @extend .v-stack;
        width: 30%;
      }
      .close {
        min-width: 80px;
        text-align: center;
        margin: 0;
      }
      .button {
        min-width: 80px;
        text-align: center;
      }
    }
    &-body {
      border-radius: 0;
    }
  }
}
</style>
