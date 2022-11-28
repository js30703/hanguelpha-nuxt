<script lang="ts" setup>
import { io } from "socket.io-client";
import { onBeforeRouteLeave } from "vue-router";
import { getStandardDeviation, cutFixed } from "@/utils/mean";
let io_client = null;

const ranks = ref({
  test: {
    name: "name",
    code: "name",
    ratioToday: 555555,
    close: 555555,
    price: 555555,
  },
} as any);
const std_list = ref([0, 0, 0, 0, 0]);

function getDeviationList(mean, std) {
  return [3, 2, 1, 0, -1, -2, -3].map((i) => cutFixed(mean + i * std));
}
function getPercent() {
  return cutFixed(
    (Object.values(ranks.value).filter((v: any) => {
      return v?.ratioToday;
    }).length /
      Object.values(ranks.value).length) *
      100
  );
}

function getRatioColor(ratio) {
  if (ratio > 1) return "color:red";
  if (ratio < -1) return "color:blue";
  return "color:gray";
}

// 페이지에 안그려짐
onMounted(() => {
  io_client = io("wss://socket.stocks-for-scalping.com", {
    reconnectionDelayMax: 10000,
  });

  io_client.on("liveList", (message) => {
    delete ranks.value.test;
    message.data.map((item) => {
      ranks.value[item.code] = item;
    });
  });

  io_client.on("receiveMessage", (message) => {
    let item = ranks.value[message.code];
    let _close = Number(item.close.replaceAll(",", ""));
    ranks.value[message.code] = {
      ...item,
      ...message,
      ratioToday: cutFixed(((message.price - _close) / _close) * 100),
    };

    let tempt = {};

    let array = Object.entries(ranks.value)
      .sort((b: [string, any], a: [string, any]) => {
        if (a[1].ratioToday && b[1].ratioToday) {
          return a[1].ratioToday - b[1].ratioToday;
        }
        if (a[1].ratioToday) {
          return 1;
        }
        return -1;
      })
      .map((v: [string, object]) => (tempt[v[0]] = v[1]));
    let [_mean, std] = getStandardDeviation(
      array.map((v: any) => {
        if (v.ratioToday) {
          return Number(v.ratioToday);
        }
        return 0;
      })
    );
    std_list.value = getDeviationList(_mean, std);
    ranks.value = tempt;
  });
});

function deleteIO() {
  if (!io_client) return;
  io_client.disconnect();
  io_client = null;
}

onBeforeRouteLeave(deleteIO);
onUnmounted(deleteIO);
</script>

<template>
  <div class="live" v-if="ranks.test">
    <div class="mean-board">금일장은 마감되었습니다.</div>
  </div>
  <div class="live" v-else>
    <div class="mean-board">
      <div class="row">{{ getPercent() }}%</div>
      <div class="row">
        <span
          v-for="std in ['3', '2', '1', 'mean', '-1', '-2', '-3']"
          :key="std"
          style="padding: 0 5px"
          >{{ std }}</span
        >
      </div>
      <div class="row">
        <span v-for="std in std_list" :key="std">{{ std }}</span>
      </div>
    </div>
    <div class="live-ctn">
      <div
        class="rank-item"
        v-for="rank in ranks"
        :key="rank?.code"
        v-show="rank.ratioToday"
      >
        <NuxtLink
          class="name"
          :to="`https://m.stock.naver.com/domestic/stock/${
            rank.code.split('A')[1]
          }/total`"
          target="_blank"
        >
          <div
            v-show="getPercent() > 80"
            :class="{
              signal: true,
              high:
                std_list[1] > rank.ratioToday && rank.ratioToday > std_list[2],
              low:
                std_list[4] > rank.ratioToday && rank.ratioToday > std_list[5],
            }"
          ></div>
          {{ rank.name }}
        </NuxtLink>

        <div class="now" :style="getRatioColor(rank.ratioToday)">
          {{ rank?.price }}
        </div>
        <div class="ratio" :style="getRatioColor(rank.ratioToday)">
          {{ rank?.ratioToday }}%
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/scss/_base.scss";
.live {
  @extend .v-stack;

  background: white;
  .mean-board {
    @extend .v-stack;
    flex-direction: column;
    margin: 15px 0;
    span {
      width: 10%;
      padding: 5px;
      text-align: center;
    }
  }
  &-ctn {
    @extend .v-stack;
    width: 95vw;
    margin: 20px;
    flex-direction: column-reverse;
    .rank-item {
      @extend .h-stack;
      margin: 8px;
      width: 80vw;
      justify-content: space-between;
      .name {
        @extend .h-stack;
        justify-content: flex-start;
        width: 50%;
        text-align: left;
        .signal {
          width: 15px;
          aspect-ratio: 1;
          border-radius: 100%;

          margin-right: 5px;
          &.high {
            background: red;
          }
          &.low {
            background: blue;
          }
        }
      }
      .now {
        width: 25%;
        text-align: right;
      }
      .ratio {
        width: 25%;
        text-align: right;
      }
    }
  }
}
</style>