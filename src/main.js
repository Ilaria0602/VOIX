import Vue from "vue";
import App from "./App.vue";
import VueMaterial from "vue-material";
import VueRouter from "vue-router";

import "vue-material/dist/vue-material.min.css";
import "vue-material/dist/theme/default.css";

import News from "./pag/News";
import Notizia from "./pag/Notizia";
import Preferiti from "./pag/Preferiti";
import TopStories from "./pag/TopStories";
import Search from "./pag/Search";
import Login from "./pag/Login";

Vue.use(VueMaterial);
Vue.use(VueRouter);
Vue.config.productionTip = false;

const router = new VueRouter({
  mode: "history",
  routes: [
    { name: "News", path: "/", component: News },
    { name: "Notizia", path: "/notizia/:title", component: Notizia },
    { name: "Preferiti", path: "/preferiti", component: Preferiti },
    { name: "TopStories", path: "/topStories", component: TopStories },
    { name: "Search", path: "/Search", component: Search },
    { name: "Login", path: "/login", component: Login }
  ]
});

new Vue({
  router,
  render: (h) => h(App)
}).$mount("#app");
