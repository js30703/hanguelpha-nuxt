<script lang="ts" setup>
import { io } from "socket.io-client";
import { onBeforeRouteLeave } from "vue-router";

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
      ratioToday: (((message.price - _close) / _close) * 100).toFixed(2),
    };

    let tempt = {};

    Object.entries(ranks.value)
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

    ranks.value = tempt;
  });
});
function getRatioColor(ratio) {
  if (ratio > 0) {
    return "color:red";
  }
  if (ratio < 0) {
    return "color:blue";
  }
  return "color:gray";
}

function deleteIO() {
  if (!io_client) return;
  io_client.disconnect();
  io_client = null;
}

onBeforeRouteLeave(deleteIO);
onUnmounted(deleteIO);
</script>

<template>
  <div class="live">
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
  @extend .center;
  background: white;
  &-ctn {
    @extend .v-stack;
    width: 95vw;
    margin: 20px;
    .rank-item {
      @extend .h-stack;
      margin: 8px;
      width: 80vw;
      justify-content: space-between;
      .name {
        width: 50%;
        text-align: left;
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