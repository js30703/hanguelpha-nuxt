<script lang="ts" setup>
</script>

<template>
  <div class="home">
    <div class="home-ctn">
      <h1>주식 정보를 열람하는 웹 앱</h1>
      <strong>페이지 설명</strong>
      <span
        >board 페이지에서 근 10거래일 간 상승률 높은 주식의 랭킹을 매김</span
      >
      <span
        >live 페이지에서 랭킹 내 주식들의 실시간 거래 정보를 볼 수 있음 <br />
        * 개인 사정으로 서버를 못 열어서 동작이 안 될 수 있음.
      </span>

      <strong>사용된 기술</strong>
      <ul>
        <li>VERCEL : ci/cd serverless deployment</li>
        <li>NUXT3 : vue framework</li>
        <li>PRISMA : orm</li>
        <li>KacorchDB : serverless db</li>
        <li>Scss : css tool</li>
        <li>Axiom : log collect</li>
      </ul>

      <NuxtLink to="https://github.com/js30703/hanguelpha-nuxt" target="_blank">
        코드보기
      </NuxtLink>
    </div>
  </div>
</template>


<style lang="scss" scoped>
@import "@/assets/scss/_base.scss";

.home {
  @extend .center;
  background: white;
  &-ctn {
    @extend .v-stack;
    width: 100%;
    padding: 20px;
    span {
      width: 100%;
      margin: 5px;
    }
    strong {
      font-size: 20px;
      width: 100%;
      margin: 10px;
    }
    ul {
      width: 100%;
      margin: 1px;

      list-style-type: none;
      li {
        margin: 1px;
        width: 100%;
      }
    }
  }
}
</style>
