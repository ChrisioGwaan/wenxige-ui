<script lang="ts" setup>
import { reactive, ref } from "vue"
import { useRouter } from "vue-router"
import { useUserStore } from "@/store/modules/user"
import { type FormInstance, type FormRules, ElNotification } from "element-plus"
import { User, Key } from "@element-plus/icons-vue"
import { type LoginRequestData } from "@/api/login/types/login"
import ThemeSwitch from "@/components/ThemeSwitch/index.vue"

const router = useRouter()
const loginFormRef = ref<FormInstance | null>(null)
const loading = ref(false)
// const codeUrl = ref("")
const loginFormData: LoginRequestData = reactive({
  username: "",
  password: "",
  code: ""
})
const loginFormRules: FormRules = {
  username: [{ required: true, message: "請輸入用戶名", trigger: "blur" }],
  password: [
    { required: true, message: "請輸入密碼", trigger: "blur" },
    { min: 8, max: 16, message: "密碼長度至少為八個字符", trigger: "blur" }
  ],
  code: [{ required: false, message: "Please enter verification code", trigger: "blur" }]
}
const handleLogin = () => {
  loginFormRef.value?.validate((valid: boolean, fields) => {
    if (valid) {
      loading.value = true
      useUserStore()
        .login(loginFormData)
        .then(() => {
          ElNotification({
            title: "Success",
            message: "Login successful",
            position: "top-right",
            type: "success"
          })
          router.push({ path: "/" })
        })
        .catch((error) => {
          // createCode()
          ElNotification({
            title: "Error",
            message: error.message || "Login failed",
            position: "top-right",
            type: "error"
          })
          loginFormData.password = ""
        })
        .finally(() => {
          loading.value = false
        })
    } else {
      console.error("Invalid input", fields)
    }
  })
}
// const createCode = () => {
//   loginFormData.code = ""
//   codeUrl.value = ""
//   getLoginCodeApi().then((res) => {
//     codeUrl.value = res.data
//   })
// }

// createCode()
</script>

<template>
  <div class="login-container">
    <ThemeSwitch class="theme-switch" />
    <div class="login-card">
      <span style="display: block; height: 20px" />
      <div class="title">
        <img src="@/assets/layouts/logo-text-2.png" />
      </div>
      <div class="content">
        <h2>
          <el-icon class="is-loading"><Sugar /></el-icon> <span style="color: #8cfa9e">Wenxige </span>Login
        </h2>
        <el-form ref="loginFormRef" :model="loginFormData" :rules="loginFormRules" @keyup.enter="handleLogin">
          <el-form-item prop="username">
            <el-input
              v-model.trim="loginFormData.username"
              placeholder="Username"
              type="text"
              tabindex="1"
              :prefix-icon="User"
              size="large"
              clearable
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model.trim="loginFormData.password"
              placeholder="Password"
              type="password"
              tabindex="2"
              :prefix-icon="Key"
              size="large"
              show-password
              clearable
            />
          </el-form-item>
          <!-- <el-form-item prop="code">
            <el-input
              v-model.trim="loginFormData.code"
              placeholder="验证码"
              type="text"
              tabindex="3"
              :prefix-icon="Key"
              maxlength="7"
              size="large"
            >
              <template #append>
                <el-image :src="codeUrl" @click="createCode" draggable="false">
                  <template #placeholder>
                    <el-icon>
                      <Picture />
                    </el-icon>
                  </template>
                  <template #error>
                    <el-icon>
                      <Loading />
                    </el-icon>
                  </template>
                </el-image>
              </template>
            </el-input>
          </el-form-item> -->
          <el-button
            :loading="loading"
            type="primary"
            size="default"
            @click.prevent="handleLogin"
            style="background-color: black; border-color: black; color: white"
            >Login</el-button
          >
        </el-form>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100%;
  .theme-switch {
    position: fixed;
    top: 5%;
    right: 5%;
    cursor: pointer;
  }
  .login-card {
    width: 480px;
    border-radius: 20px;
    box-shadow: 0 0 10px #dcdfe6;
    background-color: #fff;
    overflow: hidden;
    .title {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 150px;
      img {
        height: 100%;
      }
    }
    .content {
      padding: 20px 50px 50px 50px;
      :deep(.el-input-group__append) {
        padding: 0;
        overflow: hidden;
        .el-image {
          width: 100px;
          height: 40px;
          border-left: 0px;
          user-select: none;
          cursor: pointer;
          text-align: center;
        }
      }
      .el-button {
        width: 100%;
        margin-top: 10px;
      }
    }
  }
}
</style>
