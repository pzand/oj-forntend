<template>
  <div id="userLayout">
    <a-layout style="min-height: 100vh">
      <!--      <a-layout-header class="header"> 用户登录</a-layout-header>-->
      <a-layout-content class="content">
        <router-view style="margin: 0 auto; max-width: 600px" />
      </a-layout-content>
      <!--      <a-layout-footer class="footer">Footer</a-layout-footer>-->
    </a-layout>
  </div>
</template>

<style scoped>
#userLayout {
  background: url("https://gw.alipayobjects.com/zos/rmsportal/FfdJeJRQWjEeGTpqgBKj.png")
    0 0 / 100% 100%;
}

#userLayout .header {
  height: 64px;
  text-align: center;
  line-height: 64px; /* 容器高度 */
}

#userLayout .content {
  margin-bottom: 16px;
  padding: 20px;
}

#userLayout .footer {
  background: #efefef;
  padding: 16px;
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
}
</style>
<script setup lang="ts"></script>
