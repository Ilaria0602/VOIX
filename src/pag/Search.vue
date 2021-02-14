<template>
  <div class="md-layout">
    <md-field>
      <label> Search </label>
      <md-input v-model="selected"> </md-input>
      <md-button class="md-icon-button" @click="search()">
        <md-icon> search </md-icon>
      </md-button>
    </md-field>
    <br />
    <div
      class="md-layout-item md-size-30 md-medium-size-50 md-xsmall-size-100"
      v-for="notizia in news"
      :key="notizia.headline.main"
      @click="
        goTo(
          notizia.headline.main,
          notizia.abstract,
          notizia.web_url,
          notizia.pub_date,
          notizia.multimedia[0].url
        )
      "
    >
      <md-card md-with-hover>
        <md-card-header>
          <md-card-header-text>
            <div class="md-title card-text">{{ notizia.headline.main }}</div>
          </md-card-header-text>
          <md-card-media>
            <img :src="notizia.multimedia[0].url" :alt="notizia.title" />
          </md-card-media>
        </md-card-header>

        <md-card-actions v-if="isAuthenticated">
          <md-button
            class="md-icon-button"
            @click.stop="
              Preferred(
                notizia.headline.main,
                notizia.abstract,
                notizia.web_url,
                notizia.pub_date,
                notizia.multimedia[0].url
              )
            "
          >
            <md-icon v-if="like.includes(notizia.headline.main)"
              >favorite</md-icon
            >
            <md-icon v-else>favorite_border</md-icon>
          </md-button>
        </md-card-actions>
      </md-card>
      <br />
    </div>
  </div>
</template>

<script>
import DataService from "../dataservice";

export default {
  data: function () {
    return {
      news: [],
      like: [],
      selected: null,
      isAuthenticated: DataService.isAuthenticated(),
    };
  },
  methods: {
    goTo(title, abstract, url, date, img) {
      DataService.setarticle(title, abstract, url, date, img);
      this.$router.push({ path: "/notizia/" + title });
    },
    remove(lk, value) {
      var indice = 0;
      while (indice < lk.length) {
        if (lk[indice] === value) {
          lk.splice(indice, 1);
        } else {
          ++indice;
        }
      }
      return lk;
    },
    Preferred(name, abstract, url, date, img) {
      if (this.like.includes(name)) {
        DataService.removeLike(name);
        this.like = this.remove(this.like, name);
      } else {
        DataService.setLike(name, abstract, url, date, img);

        this.like.push(name);
      }
    },
    search() {
      DataService.searchNotizia(this.capitalizeFirstLetter(this.selected)).then(
        (data) => {
          this.news = data;
        }
      );
    },
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
  },
  created() {
    if (this.isAuthenticated === true) {
      DataService.getLikePerson().then((data) => {
        data.forEach((el) => {
          this.like.push(el.articolo);
        });
      });
    }
  },
};
</script>

<style>
</style>