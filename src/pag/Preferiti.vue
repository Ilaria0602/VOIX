<template>
  <div class="md-layout md-gutter">
    <md-empty-state
      v-if="like.length == 0"
      md-rounded
      md-icon="favorite"
      md-label="You haven't liked any article"
      md-description="Go look for some articles you might like!"
    >
    </md-empty-state>
    <div
      v-else
      class="md-layout-item md-size-33 md-medium-size-33 md-small-size-50 md-xsmall-size-100"
      v-for="notizia in like"
      :key="notizia.articolo"
      @click="
        goTo(
          notizia.articolo,
          notizia.abstract,
          notizia.url,
          notizia.date,
          notizia.img
        )
      "
    >
      <md-card md-with-hover>
        <md-card-header>
          <md-card-header-text>
            <div class="md-title card-text">{{ notizia.articolo }}</div>
          </md-card-header-text>

          <md-card-media>
            <img :src="notizia.img" :alt="notizia.articolo" />
          </md-card-media>
        </md-card-header>

        <md-card-actions>
          <md-button
            class="md-icon-button"
            @click.stop="Preferred(notizia.articolo)"
          >
            <md-icon>favorite</md-icon>
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
      like: [],
    };
  },
  created() {
    DataService.getLikePerson().then((data) => {
      this.like = data;
    });
  },
  methods: {
    remove(lk, value) {
      var indice = 0;
      while (indice < lk.length) {
        if (lk[indice].articolo === value) {
          lk.splice(indice, 1);
        } else {
          ++indice;
        }
      }
      return lk;
    },
    Preferred(name) {
      DataService.removeLike(name);
      this.like = this.remove(this.like, name);
    },
    goTo(title, abstract, url, date, img) {
      DataService.setarticle(title, abstract, url, date, img);
      this.$router.push({ path: "/notizia/" + title });
    },
  },
};
</script>

<style>
.md-card {
  margin: 6px;
}
.card-text {
  height: 4.1em;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>