<template>
  <div class="md-layout md-gutter">
    <h1 class="title">Top Stories</h1>

    <div
      class="md-layout-item md-size-33 md-medium-size-50 md-xsmall-size-100"
      v-for="notizia in topStories"
      :key="notizia.title"
      @click="
        goTo(
          notizia.title,
          notizia.abstract,
          notizia.url,
          notizia.published_date,
          null
        )
      "
    >
      <md-card md-with-hover>
        <md-card-header>
          <md-card-header-text>
            <div class="md-title card-text">{{ notizia.title }}</div>
          </md-card-header-text>
        </md-card-header>

        <md-card-actions v-if="isAuthenticated">
          <md-button
            class="md-icon-button"
            @click.stop="
              Preferred(
                notizia.title,
                notizia.abstract,
                notizia.url,
                notizia.published_date,
                null
              )
            "
          >
            <md-icon v-if="like.includes(notizia.title)">favorite</md-icon>
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
      topStories: [],
      like: [],
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
  },
  created() {
    DataService.getTopStories().then((data) => {
      this.topStories = data.data.results;
    });
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
.title {
  margin: 20px;
  width: 100%;
}
</style>