<script lang="ts" setup>
import { io } from "socket.io-client";
import { onBeforeRouteLeave } from "vue-router";
import { useRankStore } from "@/store/ranks";

const { ranks } = useRankStore();

let io_client = null;
// const i_ = ranks.ranks
// console.log("ranks", ranks.ranks.length);

// 페이지에 안그려짐
onMounted(() => {
  io_client = io("wss://socket.stocks-for-scalping.com", {
    reconnectionDelayMax: 10000,
  });
  io_client.on("connect", () => {
    console.log("connected");
  });
  io_client.on("disconnect", () => {
    console.log("disconnected");
  });
  io_client.on("receiveMessage", (message) => {
    console.log(message);
    // _ranks[message.code].closeToday = message.closeToday;
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
      {{ ranks }}
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
  }
}
</style>