<template>
  <div class="about">
    <h2 style="text-align: center">用户注册</h2>
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
      <a-form-item field="userPassword" label="确认密码">
        <a-input-password
          v-model="form.checkPassword"
          placeholder="请求输入密码"
        />
      </a-form-item>
      <a-form-item>
        <a-button style="width: 100px; margin: 20px auto" html-type="submit"
          >注册
        </a-button>
      </a-form-item>
    </a-form>
    <a-space
      align="baseline"
      style="display: flex; flex-direction: row-reverse"
    >
      <a-link @click="clickLogin">登录</a-link>
    </a-space>
  </div>
</template>
<script setup lang="ts">
import { reactive } from "vue";
import { UserControllerService, UserRegisterRequest } from "../../../generated";
import { Message } from "@arco-design/web-vue";
import { useRouter } from "vue-router";

/**
 * 表单信息
 */
const form = reactive({
  userAccount: "",
  userPassword: "",
  checkPassword: "",
} as UserRegisterRequest);

const router = useRouter();
const clickLogin = async () => {
  router.push({
    path: "/user/login",
    replace: true,
  });
};

/**
 * 提交信息
 */
const handleSubmit = async () => {
  if (form.userPassword !== form.checkPassword) {
    Message.error("两次输入的密码不一致");
    form.userPassword = "";
    form.checkPassword = "";
    return;
  }

  // eslint-disable-next-line no-undef
  const res = await UserControllerService.userRegister(form);
  if (res.code === 0) {
    router.push({
      path: "/user/login",
      replace: true,
    });
  } else {
    Message.error("注册失败，" + res.message);
  }
};
</script>
