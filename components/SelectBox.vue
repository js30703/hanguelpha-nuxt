<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: ["content"],
  data: () => ({
    _isOpen: false,
  }),
  methods: {
    toggleModal: async function () {
      this._isOpen = !this._isOpen;
    },
  },
});
</script>

<template>
  <div class="SelectBox" @click="toggleModal" v-wave>
    <div class="dropdown">
      <div class="SelectBox-input">
        <div class="SelectBox-title" :class="{ activated: _isOpen }">
          {{ content }}
        </div>
        <img
          class="select2-icon-right"
          :class="{ activated: _isOpen }"
          src="/svg/chevron-down.svg"
          alt="header-dropdown"
        />
      </div>
      <Transition name="dropdown-content">
        <div v-if="_isOpen" class="dropdown-content">
          <ul>
            <slot />
          </ul>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style lang="scss" >
@import "~/assets/scss/_base.scss";
.SelectBox {
  @extend .row;

  margin: 5px;
  &-input {
    @extend .row;
    input {
      display: none;
    }
  }
  &-title {
    font-family: "Pretendard-Regular";
    font-size: 14px;
    width: 100%;
    &.activated {
      color: $primary;
    }
  }
  .select2-icon-right {
    top: 1px;
    margin-left: auto;
    rotate: 45deg;
    transition: all 0.1s ease;
    &.activated {
      rotate: -135deg;
      filter: invert(30%) sepia(92%) saturate(389%) hue-rotate(128deg)
        brightness(92%) contrast(93%);
    }
  }
  .dropdown {
    position: relative;
    display: inline-block;
    width: 100%;
    border-radius: 4px;
    border: solid 1px #e5e5e5;
    background-color: #fff;
    padding: 10px;

    &-content {
      position: absolute;
      border: solid 1px #e5e5e5;
      background-color: #fff;
      width: 100%;
      @include border-radius($radius-md);
      box-shadow: $shadow-md;
      left: 0px;
      top: 100%;
      z-index: 1;
      ul {
        padding: 12px 2px;
        list-style-type: none;
      }
      li {
        font-family: "Pretendard-Regular";
        padding: 10px 20px;
        text-align: center;
        font-size: 14px;
        cursor: pointer;
        @include border-radius($radius-md);
        &.selected {
          color: $primary;
        }
        &:hover {
          background: rgba(17, 106, 102, 0.06);
        }
      }
      &-enter-active,
      &-leave-active {
        transition: all 0.3s ease;
      }
      &-enter-from,
      &-leave-to {
        top: 0px;
        translate: transformY(00px);
        opacity: 0;
      }
      &-enter-to,
      &-leave-from {
        translate: transformY(-40px);
        opacity: 1;
      }
    }
  }
}
</style>
