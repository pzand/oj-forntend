import ACCESS_ENUM from "@/access/accessEnum";
import checkAccess from "@/access/checkAccess";
import router from "@/router";
import store from "@/store";

// 为什么不使用 useRouter(), useStore()？因为以上函数自能在vue中使用
// const router = useRouter();

router.beforeEach(async (to, from, next) => {
  // 获取用户信息
  let loginUser = store.state.user.loginUser;

  // 如果没有用户信息，尝试获取用户信息，实现自动登录
  if (!loginUser || !loginUser.userRole) {
    await store.dispatch("user/getLoginUser");
    loginUser = store.state.user.loginUser;
  }

  // 根据目标页面需要的信息进行跳转
  const needAccess = (to?.meta?.access as string) ?? ACCESS_ENUM.NOT_LOGIN;
  // 如果页面不是要求未登录页面，则进行权限校验
  if (needAccess !== ACCESS_ENUM.NOT_LOGIN) {
    // 如果没有登录，则跳转到登录页面
    if (
      !loginUser ||
      !loginUser.userRole ||
      loginUser.userRole === ACCESS_ENUM.NOT_LOGIN
    ) {
      next(`/user/login?redirect=${to.fullPath}`);
      return;
    }
    // 需要管理员权限，判断是否有足够权限
    if (!checkAccess(loginUser, needAccess)) {
      next("/noAuth");
      return;
    }
  }
  next();
});
