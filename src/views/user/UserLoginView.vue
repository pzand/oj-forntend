<template>
  <div class="userLoginView">
    <h2 style="text-align: center">用户登录</h2>
    <a-form
      label-align="left"
      :model="form"
      @submit="handleSubmit"
      auto-label-width
    >
      <a-form-item field="userAccount" label="账号">
        <a-input v-model="form.userAccount" placeholder="请输入账号" />
      </a-form-item>
      <a-form-item field="userPassword" label="密码" tooltip="密码不少于 8 位">
        <a-input-password
          v-model="form.userPassword"
          placeholder="请求输入密码"
        />
      </a-form-item>
      <a-form-item>
        <a-button style="width: 100px; margin: 20px auto" html-type="submit"
          >登录</a-button
        >
      </a-form-item>
    </a-form>
  </div>
</template>
<script setup lang="ts">
import { reactive } from "vue";
import { UserControllerService, UserLoginRequest } from "../../../generated";
import { Message } from "@arco-design/web-vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

/**
 * 表单信息
 */
const form = reactive({
  userAccount: "",
  userPassword: "",
} as UserLoginRequest);

const router = useRouter();
const store = useStore();
/**
 * 提交信息
 */
const handleSubmit = async () => {
  const res = await UserControllerService.userLogin(form);
  if (res.code === 0) {
    await store.dispatch("user/getLoginUser");
    router.push({
      path: "/",
      replace: true,
    });
  } else {
    Message.error("登录失败，" + res.message);
  }
};
</script>
