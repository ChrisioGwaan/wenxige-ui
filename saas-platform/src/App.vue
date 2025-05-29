<script lang="ts" setup>
import { useTheme } from "@/hooks/useTheme"
// import { ElNotification } from "element-plus"
// Element Plus language setup
// import zhCn from "element-plus/es/locale/lang/zh-cn"
import zhCn from "element-plus/es/locale/lang/zh-tw"
import { Analytics } from "@vercel/analytics/vue"
// import en from "element-plus/es/locale/lang/en"

const { initTheme } = useTheme()

// Theme initialization
initTheme()

// Notification on pop-up
// ElNotification({
//   title: "Sup",
//   type: "success",
//   dangerouslyUseHTMLString: true,
//   message:
//     "Welcome!",
//   duration: 0,
//   position: "top-right"
// })
</script>

<template>
  <Analytics />
  <el-config-provider :locale="zhCn">
    <router-view />
  </el-config-provider>
</template>
