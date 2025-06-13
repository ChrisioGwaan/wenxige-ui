<script lang="ts" setup>
import { reactive, ref } from "vue"
import { useRouter } from "vue-router"
import { useUserStore } from "@/store/modules/user"
import { type FormInstance, type FormRules, ElNotification } from "element-plus"
import { User, Key } from "@element-plus/icons-vue"
import { type LoginRequestData } from "@/api/login/types/login"
// import ThemeSwitch from "@/components/ThemeSwitch/index.vue"
import loginIllustration from "@/assets/layouts/data-transfer.png"

const router = useRouter()
const loginFormRef = ref<FormInstance | null>(null)
const loading = ref(false)
const loginFormData: LoginRequestData = reactive({
  username: "",
  password: "",
  code: "",
  rememberMe: false
})
const loginFormRules: FormRules = {
  username: [{ required: true, message: "Please enter the username!", trigger: "blur" }],
  password: [
    { required: true, message: "Please enter the password!", trigger: "blur" },
    { min: 8, max: 16, message: "Password has at least 8 characters.", trigger: "blur" }
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
</script>

<template>
  <div class="login-bg">
    <div class="login-wrapper">
      <div class="login-illustration-area">
        <img :src="loginIllustration" alt="Login illustration" class="login-illustration" />
      </div>
      <div class="login-card">
        <div class="login-logo-row">
          <img src="@/assets/layouts/logo-text-2.png" class="login-logo" />
          <span class="login-title">Wenxige</span>
        </div>
        <div class="welcome-text">
          <h2>Welcome! 👋🏻</h2>
          <div class="mb-2" style="color: #8191a7">Sign in to your account</div>
        </div>
        <div class="login-demo-info">
          <div>Demo: <strong>test / 12345678</strong></div>
          <!--          <div>Client: <strong>client@demo.com / client</strong></div>-->
        </div>
        <el-form
          ref="loginFormRef"
          :model="loginFormData"
          :rules="loginFormRules"
          @keyup.enter="handleLogin"
          class="login-form"
        >
          <el-form-item prop="username">
            <el-input
              v-model.trim="loginFormData.username"
              placeholder="Username"
              type="text"
              tabindex="1"
              :prefix-icon="User"
              size="large"
              clearable
              autofocus
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
          <div class="login-form-actions">
            <el-checkbox v-model="loginFormData.rememberMe" label="Remember me" />
            <!--            <router-link to="/forgot-password" class="forgot-link">Forgot password?</router-link>-->
          </div>
          <el-button :loading="loading" type="primary" size="large" @click.prevent="handleLogin" class="login-btn"
            >Login</el-button
          >
        </el-form>
        <div class="login-bottom-actions">
          <span>New on our platform?</span>
          <!--          <router-link to="/register" class="register-link">Create an account</router-link>-->
          <span class="register-link" style="color: #ff5f56; font-weight: 600">Create an account (Coming Soon)</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-bg {
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(0deg, #cdffd7 0%, #66ae60 80%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow-x: hidden;

  .theme-switch {
    position: fixed;
    top: 2.8%;
    right: 3%;
    z-index: 10;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    box-shadow: 0 4px 18px 2px rgba(130, 255, 247, 0.09);
    padding: 8px;
    transition: box-shadow 0.3s;
    &:hover {
      box-shadow: 0 6px 28px 6px rgba(130, 255, 247, 0.21);
    }
  }
}

.login-wrapper {
  width: 100vw;
  max-width: 1120px;
  min-height: 560px;
  display: flex;
  justify-content: center;
  align-items: stretch;
  background: transparent;
  gap: 0;
  @media (max-width: 900px) {
    flex-direction: column;
    align-items: center;
    max-width: 100vw;
    min-height: 100vh;
  }
}

.login-illustration-area {
  flex: 1 1 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  @media (max-width: 900px) {
    display: none;
  }
  .login-illustration {
    max-width: 400px;
    width: 100%;
    margin-left: 20px;
    margin-right: 20px;
    margin-top: 36px;
    margin-bottom: 36px;
    filter: drop-shadow(0 4px 18px #a7f3d0);
    user-select: none;
  }
}

// Login card
.login-card {
  flex: 1 1 500px;
  width: 100%;
  max-width: 480px;
  min-width: 330px;
  margin: auto;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 28px;
  box-shadow: 0 12px 32px 0 rgba(90, 125, 188, 0.2);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 38px 38px 32px 38px;
  backdrop-filter: blur(18px);
  animation: fadeInUp 0.8s cubic-bezier(0.23, 1, 0.32, 1);

  @media (max-width: 600px) {
    padding: 18px 9px 22px 9px;
    min-width: 0;
    max-width: 99vw;
  }

  @keyframes fadeInUp {
    0% {
      transform: translateY(40px);
      opacity: 0;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }
  .login-logo-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 14px;
    .login-logo {
      height: 44px;
      width: auto;
      filter: drop-shadow(0 3px 12px #a7f3d0);
    }
    .login-title {
      font-size: 2rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      color: #2c4145;
    }
  }
  .welcome-text {
    margin-bottom: 16px;
    h2 {
      font-size: 1.6rem;
      font-weight: 700;
      color: #222;
      margin-bottom: 2px;
    }
    .mb-2 {
      font-size: 1.08rem;
    }
  }
  .login-demo-info {
    background: #e6faea;
    border-radius: 12px;
    padding: 8px 16px;
    margin-bottom: 16px;
    font-size: 0.97rem;
    color: #418267;
    border-left: 4px solid #66ae60;
    div + div {
      margin-top: 2px;
    }
  }
  .login-form {
    width: 100%;
    .el-form-item {
      margin-bottom: 22px;
    }
    .el-input__wrapper {
      border-radius: 13px !important;
      background: rgba(255, 255, 255, 0.85);
      box-shadow: 0 2px 8px 0 rgba(169, 223, 191, 0.08);
    }
    .el-input__inner {
      font-size: 1rem;
      color: #333;
    }
    .el-checkbox {
      font-size: 1.01rem;
      margin-left: 3px;
      margin-right: 16px;
    }
  }
  .login-form-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 14px;
    .forgot-link {
      color: #419e8c;
      text-decoration: none;
      font-size: 0.98rem;
      &:hover {
        text-decoration: underline;
      }
    }
  }
  .login-btn {
    width: 100%;
    margin-top: 6px;
    padding: 12px 0;
    border-radius: 13px;
    font-size: 1.11rem;
    font-weight: 600;
    background: linear-gradient(90deg, #66ae60 0%, #47c98e 100%);
    border: none;
    color: #fff;
    transition:
      transform 0.18s,
      box-shadow 0.18s,
      background 0.24s;
    box-shadow: 0 4px 18px 2px rgba(90, 125, 188, 0.11);
    &:hover,
    &:focus {
      transform: translateY(-2px) scale(1.03);
      box-shadow: 0 8px 30px 6px rgba(90, 125, 188, 0.18);
      background: linear-gradient(90deg, #2ed573 0%, #34e7a2 100%);
    }
  }
  .login-bottom-actions {
    margin: 22px 0 10px 0;
    text-align: center;
    font-size: 1.04rem;
    .register-link {
      color: #0ca678;
      font-weight: 600;
      margin-left: 8px;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }
  .login-divider {
    display: flex;
    align-items: center;
    margin: 10px 0 20px 0;
    .divider {
      flex: 1 1 0;
      height: 1.5px;
      background: #d3f8e2;
      border-radius: 5px;
    }
    .or {
      padding: 0 14px;
      color: #9ca3af;
      font-weight: 600;
      font-size: 1.1em;
      user-select: none;
    }
  }
  .login-auth-providers {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-bottom: 2px;
    .el-button {
      background: #f4f7fa;
      border: none;
      font-size: 1.22rem;
      color: #444;
      &:hover {
        background: #d4f6e3;
        color: #16794d;
      }
    }
  }
}

:deep(.el-form-item__error) {
  font-size: 0.98rem;
  color: #ff5f56;
  margin-top: 5px;
  padding-left: 3px;
}
</style>
