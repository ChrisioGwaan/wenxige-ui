<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from "vue"

const currentTime = ref(new Date())

function updateTime() {
  currentTime.value = new Date()
}

function formatDateTime(date: Date): string {
  const padZero = (num: number): string => String(num).padStart(2, "0")

  const year = date.getFullYear()
  const month = padZero(date.getMonth() + 1)
  const day = padZero(date.getDate())
  const hours = padZero(date.getHours())
  const minutes = padZero(date.getMinutes())
  const seconds = padZero(date.getSeconds())

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

const formattedTime = computed(() => formatDateTime(currentTime.value))

let intervalId: number

onMounted(() => {
  intervalId = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  clearInterval(intervalId)
})

const format = (percentage) => (percentage === 100 ? "Full" : `${percentage}%`)
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="always" class="search-wrapper">
      <h1>
        <el-icon class="is-loading"><MilkTea /></el-icon> Welcome to <span style="color: #8cfa9e">C </span>&
        <span style="color: #ff91b5">E </span>admin system! Development in progress...
      </h1>
    </el-card>
    <el-card v-loading="loading" shadow="always" class="search-wrapper">
      <!-- Show current day -->
      <h2>
        <el-icon><Clock /></el-icon> Current time: {{ formattedTime }}
      </h2>
    </el-card>
    <el-card shadow="always">
      <div style="margin-bottom: 15px">
        <el-progress :percentage="50" :indeterminate="true" color="#8cfa9e" style="margin-bottom: 15px" />
        <el-progress
          :percentage="100"
          :format="format"
          :indeterminate="true"
          color="#ff91b5"
          style="margin-bottom: 15px"
        />
        <el-progress
          :percentage="100"
          status="success"
          :indeterminate="true"
          :duration="5"
          style="margin-bottom: 15px"
        />
        <el-progress
          :percentage="100"
          status="warning"
          :indeterminate="true"
          :duration="1"
          style="margin-bottom: 15px"
        />
        <el-progress :percentage="50" status="exception" :indeterminate="true" style="margin-bottom: 15px" />
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.search-wrapper {
  margin-bottom: 20px;
  :deep(.el-card__body) {
    padding-bottom: 2px;
  }
}

.toolbar-wrapper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.table-wrapper {
  margin-bottom: 20px;
}

.pager-wrapper {
  display: flex;
  justify-content: flex-end;
}
</style>
