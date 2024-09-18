<template>
  <a-row
    id="globalHeader"
    class="grid-demo"
    style="margin-bottom: 20px"
    align="center"
    :wrap="false"
  >
    <a-col flex="auto">
      <a-menu
        mode="horizontal"
        :selected-keys="selectRoute"
        @menu-item-click="doMenuClick"
      >
        <a-menu-item
          key="0"
          :style="{ padding: 0, marginRight: '38px' }"
          disabled
        >
          <div class="title-bar">
            <div class="title">OJ判题平台</div>
          </div>
        </a-menu-item>
        <a-menu-item v-for="item in visibleRoutes" :key="item.path">
          {{ item.name }}
        </a-menu-item>
      </a-menu>
    </a-col>
    <a-col flex="100px">
      <div>
        {{ store.state.user?.loginUser?.userName ?? "未登录" }}
      </div>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import { routes } from "@/router/routes";
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref, watch, watchEffect } from "vue";
import { useStore } from "vuex";
import checkAccess from "@/access/checkAccess";

// 获取当前的路由状态
// const route = useRoute();
// 路由更新后的触发的钩子
// router.afterEach((to, from, failure) => {});

const router = useRouter();
const store = useStore();

// 根据登录用户，检查需要展示的菜单页
const checkVisibleRoutes = () => {
  return routes.filter((item, index) => {
    if (item.meta?.hideInMenu) {
      return false;
    }

    if (
      !checkAccess(store.state.user.loginUser, item?.meta?.access as string)
    ) {
      return false;
    }
    return true;
  });
};
// 侦听用户的变化
const visibleRoutes = ref(checkVisibleRoutes());
watch(store.state.user, () => {
  visibleRoutes.value = checkVisibleRoutes();
});

// 跳转路由
const selectRoute = ref(["/"]);
const doMenuClick = (key: string) => {
  router.push({
    path: key,
  });
  selectRoute.value = [key];
};

const route = useRoute();
watchEffect(() => {
  selectRoute.value = [route.path];
});
</script>

<style scoped>
.title {
  color: #444;
  font-weight: bold;
}
</style>
