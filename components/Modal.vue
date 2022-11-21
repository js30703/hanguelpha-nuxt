<script lang="ts" setup>
const { isOpen } = defineProps(["isOpen"]);
</script>

<template>
  <Transition name="modal" :duration="{ enter: 550, leave: 80 }">
    <div class="modal" v-show="isOpen" :class="{ 'modal-open': isOpen }">
      <div class="modal-ctn">
        <slot />
      </div>
    </div>
  </Transition>
</template>

<style lang="scss" >
@import "@/assets/scss/_base.scss";
.modal {
  @extend .center;
  top: 0px;
  left: 0px;
  height: 100vh;
  width: 100vw;
  z-index: 15;
  position: fixed;
  overflow: hidden;
  margin: 0px;
  padding: 0px;
  background-color: rgba(0, 0, 0, 0.6);

  &-enter-active,
  &-leave-active {
    transition: all 0.25s ease;
  }
  &-enter-from,
  &-leave-to {
    opacity: 0.6;
  }
  &-enter-to,
  &-leave-from {
    opacity: 1;
  }

  &-ctn {
    @extend .v-stack;
    @include responsive(max-width, (100vw, 100vw, 40vw));
    @include responsive(height, (100vh, 100vh, auto));
    margin: 0px;
    z-index: 16;
    padding: 0px;
    background: #fefefe;
    position: static;
    border-radius: 20px;
  }
  &-enter-active &-ctn {
    transition-delay: 0.25s;
  }
  &-enter-active &-ctn,
  &-leave-active &-ctn {
    transition: all 0.3s ease-in-out;
  }

  &-enter-from &-ctn,
  &-leave-to &-ctn {
    transform: translateY(30%);
    opacity: 0.5;
  }
  &-enter-to &-ctn,
  &-leave-from &-ctn {
    opacity: 1;
  }

  &-header {
    @extend .row;
    @include responsive(width, (90%, 90%, 95%));
    padding: 20px;

    .title-modal {
      width: 100%;
      font-family: "Pretendard-Bold";
      font-size: 20px;
    }
    .close {
      cursor: pointer;
      width: 20px;
      height: 20px;
      margin: 10px;
    }
  }

  &-body {
    @extend .v-stack;
    @include responsive(height, (90vh, 90vh, 60vh));
    border-radius: 20px;
    overflow-x: hidden;
    overflow-y: auto;
    width: 100%;
    background-color: white;
    padding-bottom: 10px;
    &::-webkit-scrollbar {
      width: 5px;
    }
    &::-webkit-scrollbar-track {
      background: white;
    }
    .input-row {
      @extend .v-stack;
      width: 90%;
      .title-label {
        font-family: "Pretendard-Bold";
        @include responsive(font-size, (12px, 12px, 14px));
        margin: 5px 0;
        width: 100%;
        span {
          font-family: "Pretendard-Bold";
          color: $primary;
          padding: 1px;
        }
      }
    }
    .btnFull {
      margin: 20px 0;
      width: 80%;
    }
  }
  &-footer {
    width: 100%;
    padding: 10px;
  }
}
</style>
