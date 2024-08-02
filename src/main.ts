import "@arco-design/web-vue/dist/arco.css";
import ArcoVue from "@arco-design/web-vue";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "@/access/index"; //引入权限管理
import "bytemd/dist/index.css"; // md编辑css

createApp(App).use(store).use(router).use(ArcoVue).mount("#app");
