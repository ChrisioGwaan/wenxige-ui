<script lang="ts" setup>
import { useDevice } from "@/hooks/useDevice"

interface Props {
  total: number
}

const props = defineProps<Props>()

const { isMobile } = useDevice()
</script>

<template>
  <div class="search-footer">
    <template v-if="!isMobile">
      <span class="search-footer-item">
        <SvgIcon name="keyboard-enter" />
        <span>Confirm</span>
      </span>
      <span class="search-footer-item">
        <SvgIcon name="keyboard-up" />
        <SvgIcon name="keyboard-down" />
        <span>Switch</span>
      </span>
      <span class="search-footer-item">
        <SvgIcon name="keyboard-esc" />
        <span>Close</span>
      </span>
    </template>
    <span class="search-footer-total">Total {{ props.total }} {{ props.total === 1 ? "result" : "results" }}</span>
  </div>
</template>

<style lang="scss" scoped>
.search-footer {
  display: flex;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  &-item {
    display: flex;
    align-items: center;
    margin-right: 12px;
    .svg-icon {
      margin-right: 5px;
      padding: 2px;
      font-size: 20px;
      background-color: var(--el-fill-color);
    }
  }
  &-total {
    margin: 0 0 0 auto;
  }
}
</style>
