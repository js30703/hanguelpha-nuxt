
<script lang="ts" setup>
import { saveErrorLogSync } from "@/utils/error.js";
const props = defineProps({
  error: Object,
});

const handleError = () => clearError({ redirect: "/" });
saveErrorLogSync(props.error);
</script>

<template>
  {{ error }}
  <button @click="handleError">Clear errors</button>
</template>

<style lang="scss" >
@import "~/assets/scss/_base.scss";
</style>