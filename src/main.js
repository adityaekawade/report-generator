import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import ImageUploader from "vue-image-upload-resize";

Vue.use(ImageUploader);
import "material-design-icons-iconfont/dist/material-design-icons.css";

export const bus = new Vue();

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
