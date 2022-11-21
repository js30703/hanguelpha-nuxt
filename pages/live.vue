<script lang="ts" setup>
import { io } from "socket.io-client";
import { onBeforeRouteLeave } from "vue-router";

let io_client = null;
const ranks = ref({
  test: {
    name: "name",
    code: "name",
    ratioToday: "name",
    close: 55555,
    price: 44444,
  },
});

function secondsToHms(d) {
  d = Number(d);
  var h = Math.floor(d / 3600);
  var m = Math.floor((d % 3600) / 60);
  var s = Math.floor((d % 3600) % 60);

  var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
  var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
  var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
  return hDisplay + mDisplay + sDisplay;
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
    console.log(secondsToHms(message.time));
    let item = ranks.value[message.code];

    ranks.value[message.code] = {
      ...ranks.value[message.code],
      ...message,
      ratioToday: ((item.close - message.now) / item.close).toFixed(2),
    };

    let tempt = {};

    Object.entries(ranks.value)
      .sort((b: [string, any], a: [string, any]) => {
        return a[1].ratioToday - b[1].ratioToday;
      })
      .map((v: [string, object]) => (tempt[v[0]] = v[1]));

    Object.assign(ranks.value, tempt);
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
  <div class="live">
    <div class="live-ctn">
      <div class="rank-item" v-for="rank in ranks" :key="rank?.code">
        <div class="name">
          {{ rank?.name }}
        </div>
        <div class="close">
          {{ rank?.close }}
        </div>
        <div class="now">
          {{ rank?.price }}
        </div>
        <div class="ratio">{{ rank?.ratioToday }}%</div>
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
    }
  }
}
</style>