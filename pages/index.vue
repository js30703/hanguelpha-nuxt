<script lang="ts" setup>
import axios from "axios";

/*
TODO
1. 타자연습앱
2. 종이로 인쇄해서 연습 할 수 있는 무언가
3. 멋진 랜딩페이지
4. 회원가입
5. 로그인
6. 인증 페이지
7. 로그아웃
8. 회원정보 수정
9. 회원탈퇴
10. 회원정보 보기
*/
const { data: count } = await axios.get("http://localhost:3000/api/hello");
// axois 가 api 에러를 보고하도록 하자
</script>

<template>
  <div class="main">
    <div class="main-ctn">
      hi {{ count }}
      <input type="text" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
input {
  border: 1px solid red;
}
</style>