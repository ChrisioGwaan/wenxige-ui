<script lang="ts" setup>
import { computed, ref, watchEffect } from "vue"
import { ElMessage } from "element-plus"
import screenfull from "screenfull"

interface Props {
  /** 全屏的元素，默认是 html */
  element?: string
  /** 打开全屏提示语 */
  openTips?: string
  /** 关闭全屏提示语 */
  exitTips?: string
  /** 是否只针对内容区 */
  content?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  element: "html",
  openTips: "Fullscreen",
  exitTips: "Exit fullscreen",
  content: false
})

//#region 全屏
const isFullscreen = ref<boolean>(false)
const fullscreenTips = computed(() => {
  return isFullscreen.value ? props.exitTips : props.openTips
})
const fullscreenSvgName = computed(() => {
  return isFullscreen.value ? "fullscreen-exit" : "fullscreen"
})
const handleFullscreenClick = () => {
  const dom = document.querySelector(props.element) || undefined
  screenfull.isEnabled ? screenfull.toggle(dom) : ElMessage.warning("Your browser does not support full screen mode.")
}
const handleFullscreenChange = () => {
  isFullscreen.value = screenfull.isFullscreen
}
watchEffect((onCleanup) => {
  // 挂载组件时自动执行
  screenfull.on("change", handleFullscreenChange)
  // 卸载组件时自动执行
  onCleanup(() => {
    screenfull.isEnabled && screenfull.off("change", handleFullscreenChange)
  })
})
//#endregion

//#region 内容区
const isContentLarge = ref<boolean>(false)
const contentLargeTips = computed(() => {
  return isContentLarge.value ? "Region reset" : "Partially fullscreen"
})
const contentLargeSvgName = computed(() => {
  return isContentLarge.value ? "fullscreen-exit" : "fullscreen"
})
const handleContentLargeClick = () => {
  document.body.className = !isContentLarge.value ? "content-large" : ""
  isContentLarge.value = !isContentLarge.value
}
//#endregion
</script>

<template>
  <div>
    <!-- 全屏 -->
    <el-tooltip v-if="!content" effect="dark" :content="fullscreenTips" placement="bottom">
      <SvgIcon :name="fullscreenSvgName" @click="handleFullscreenClick" />
    </el-tooltip>
    <!-- 内容区 -->
    <el-dropdown v-else>
      <SvgIcon :name="contentLargeSvgName" />
      <template #dropdown>
        <el-dropdown-menu>
          <!-- 内容区放大 -->
          <el-dropdown-item @click="handleContentLargeClick">{{ contentLargeTips }}</el-dropdown-item>
          <!-- 内容区全屏 -->
          <el-dropdown-item @click="handleFullscreenClick" :disabled="isFullscreen">Fullscreen</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<style lang="scss" scoped>
.svg-icon {
  font-size: 20px;
  &:focus {
    outline: none;
  }
}
</style>
