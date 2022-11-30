<script lang="ts" setup>
import { useDateFormat } from "@vueuse/core";
const route = useRoute();
let count = route.query.count ? Number(route.query.count) : 0;
if (count == NaN || 4 < count || count < 2) {
  count = 0;
}

const { data } = useFetch<any>(`/api/rank?count=${count}`, {
  onRequestError: (err) => {
    throw err;
  },
  onResponseError: (err) => {
    throw err;
  },
});
</script>

<template>
  <div class="main">
    <section class="main-ctn">
      <div class="header">
        <h1>테마모아 순위</h1>
        <h5 class="date">
          {{ useDateFormat(data.date, "YYYY년 MM월 DD일").value }} 종가 기준,
          {{ data.ranks.length }} 종목
        </h5>
        <p>
          ** 본 페이지에서 언급하는 내용은 개인적인 의견과 판단이며, 시장에
          참여하시는 분들의 이해를 돕기 위한 목적으로 제작되었습니다.
          <br />투자결정에 대한 최종판단은 오로지 자신의 판단으로 하여야 하며,
          그로 인한 투자결과에 따른 책임도 본인에게 귀속됩니다.
        </p>
      </div>
      <div class="cards">
        <RankCard :key="rank?.name" v-for="rank in data.ranks" :rank="rank" />
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
    .cards {
      @extend .h-stack;
      @extend .center;
      flex-wrap: wrap;
    }
  }
}
</style>