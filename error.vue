
<script lang="ts" setup>
import { saveErrorLog } from "@/utils/error.js";

interface ErrorProps {
  error: {
    url: string;
    statusCode: string;
    message: string;
    stack: string;
    data: string;
  };
}
const props = defineProps<ErrorProps>();
const handleError = () => clearError({ redirect: "/" });
props.error?.statusCode == "500" && typeof window == "undefined"
  ? saveErrorLog(props.error)
  : null;
const debug = process.env.NODE_ENV == "development";
</script>

<template>
  <div class="error">
    <div class="error-ctn">
      <div class="status">{{ error.statusCode }}</div>

      <div class="message" v-show="debug">{{ error.message }}</div>
      <div class="stack" v-show="debug" v-html="error.stack"></div>

      <Button class="btnError" @click="handleError">HOME</Button>
    </div>
  </div>
</template>

<style lang="scss" >
@import "~/assets/scss/_base.scss";
.error {
  @extend .center;
  height: 100vh;
  &-ctn {
    @extend .v-stack;
    padding: 20px 0;
    justify-content: center;
    height: 80%;
    width: 100%;
    background: white;
    .status {
      font-size: 5rem;
      font-weight: 700;
      width: 90%;
    }
    .message {
      width: 90%;
      font-size: 2rem;
      font-weight: 700;
      height: auto;
    }
    .stack {
      margin: 20px;
      width: 90%;
      font-size: 1rem;
      font-weight: 700;
      overflow: auto;
    }
    .btnError {
      margin: 30px;
    }
  }
}
</style>