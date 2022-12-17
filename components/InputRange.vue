<script lang="ts" setup>
//https://medium.com/@predragdavidovic10/native-dual-range-slider-html-css-javascript-91e778134816
const props = defineProps({
  range: {
    type: Array,
    default: [0, 1000],
  },
  max: {
    type: Number,
    default: 1000,
  },
});

const fromSliderHandler = computed({
  get() {
    return props.range[0];
  },
  set(newValue) {
    if (Number(newValue) > props.range[1]) {
      props.range[1] = Number(newValue);
    }
    props.range[0] = Number(newValue);
  },
});

const toSliderHandler = computed({
  get() {
    return props.range[1];
  },
  set(newValue) {
    if (props.range[0] > Number(newValue)) {
      props.range[0] = Number(newValue);
    }
    props.range[1] = Number(newValue);
  },
});
</script>

<template>
  <div class="range-slider">
    <input
      type="range"
      min="0"
      :max="props.max"
      step="1"
      v-model="fromSliderHandler"
    />
    <input
      type="number"
      min="0"
      :max="props.max"
      step="1"
      v-model="fromSliderHandler"
    />
    <input
      type="range"
      min="0"
      :max="props.max"
      step="1"
      v-model="toSliderHandler"
    />
    <input
      type="number"
      min="0"
      :max="props.max"
      step="1"
      v-model="toSliderHandler"
    />
  </div>
</template>


<style lang="scss" scoped>
@import "@/assets/scss/_base.scss";
.range-slider {
  width: 100%;
  text-align: center;
  position: relative;
  height: 45px;
  display: flex;
  padding-bottom: 35px;
  justify-content: space-between;
}

.range-slider input[type="range"] {
  position: absolute;
  left: 0;
  bottom: 0;
}

input[type="number"] {
  border: 1px solid #ddd;
  text-align: center;
  font-size: 1.6em;
  padding: 2px;
  -moz-appearance: textfield;
  border-radius: 10px;
}

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

input[type="number"]:invalid,
input[type="number"]:out-of-range {
  border: 2px solid #ff6347;
}

input[type="range"] {
  -webkit-appearance: none;
  width: 100%;
}

input[type="range"]:focus {
  outline: none;
}

input[type="range"]:focus::-webkit-slider-runnable-track {
  background: $primary;
}

input[type="range"]:focus::-ms-fill-lower {
  background: $primary;
}

input[type="range"]:focus::-ms-fill-upper {
  background: $primary;
}

input[type="range"]::-webkit-slider-runnable-track {
  width: 100%;
  height: 5px;
  cursor: pointer;
  animate: 0.2s;
  background: $primary;
  border-radius: 1px;
  box-shadow: none;
  border: 0;
}

input[type="range"]::-webkit-slider-thumb {
  z-index: 2;
  position: relative;
  box-shadow: 0px 0px 0px #000;
  border: 1px solid $primary;
  height: 18px;
  width: 18px;
  border-radius: 25px;
  background: white;
  cursor: pointer;
  -webkit-appearance: none;
  margin-top: -7px;
}
</style>
