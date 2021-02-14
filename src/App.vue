<template>
  <div id="app">
    <md-app md-waterfall md-mode="fixed">
      <md-app-toolbar class="md-primary">
        <md-button
          class="md-icon-button"
          @click="navOpen = true"
          v-if="!navOpen"
        >
          <md-icon>menu</md-icon>
        </md-button>
        <span class="md-display-1" style="color: black"> V O I X </span>
      </md-app-toolbar>
      <md-app-drawer :md-active.sync="navOpen" md-persistent="full">
        <md-toolbar class="md-transparent" md-elevation="0"
          >Navigation
          <div class="md-toolbar-section-end">
            <md-button class="md-icon-button" @click="navOpen = false">
              <md-icon>keyboard_arrow_left</md-icon>
            </md-button>
          </div>
        </md-toolbar>

        <md-list>
          <md-list-item :to="'/#'">
            <md-icon> auto_stories </md-icon>
            <span class="md-list-item-text">News</span>
          </md-list-item>
          <md-list-item to="/topStories">
            <md-icon> emoji_events </md-icon>
            <span class="md-list-item-text">Top Stories</span>
          </md-list-item>
          <md-list-item to="/Search">
            <md-icon> search </md-icon>
            <span class="md-list-item-text">Search</span>
          </md-list-item>
          <md-divider></md-divider>
          <md-subheader>Profile</md-subheader>

          <md-list-item v-if="isAuthenticated" to="/preferiti">
            <md-icon> favorite </md-icon>
            <span class="md-list-item-text">Favorites</span>
          </md-list-item>
          <md-list-item to="/login" v-if="!isAuthenticated">
            <md-icon> login </md-icon>
            <span class="md-list-item-text">Login</span>
          </md-list-item>
          <md-list-item v-else to="/login">
            <md-icon> logout </md-icon>
            <span class="md-list-item-text">Logout</span>
          </md-list-item>
        </md-list>
      </md-app-drawer>

      <md-app-content>
        <router-view></router-view>
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
import DataService from "./dataservice";
export default {
  name: "App",
  components: {},
  data: function () {
    return {
      username: "",
      showDialog: false,
      navOpen: false,
      selected: null,
      searchOptions: [],
      sectionList: [],
      isAuthenticated: null,
      wind: window.innerWidth,
    };
  },
  mounted() {
    window.addEventListener("resize", () => {
      this.wind = window.innerWidth;
    });
  },
  methods: {
    logout: function () {
      DataService.logout();
      this.isAuthenticated = false;
    },
    search(term) {
      this.searchOptions = DataService.searchNotizia(term);
    },
    select(selected) {
      if (selected === this.$route.params.title) return;
      this.$router.push({ path: "/notizia/" + selected });
    },
  },
  created() {
    DataService.getSectionList().then((data) => {
      this.sectionList = data.data.results;
    });
    this.isAuthenticated = DataService.isAuthenticated();
  },
  watch: {
    $route: function () {
      this.isAuthenticated = DataService.isAuthenticated();
    },
  },
};
</script>

<style>
.searchBar {
  max-width: 250px;
  color: white;
  height: 35px;
  border-radius: 4px;
  border: 1px solid #ccc;
  padding: 12px 20px;
  margin: 8px 0;
}
.md-app {
  height: 100vh;
}
.md-app-drawer {
  max-width: 200px;
}
</style>
