<template>
  <div class="md-layout md-gutter">
    <h1 class="title" @click="title()">News</h1>

    <md-field class="margin">
      <label for="categoria">Category</label>
      <md-select v-model="categoria" name="categoria" id="categoria">
        <div
          v-for="newsSectionx in sectionList"
          :key="newsSectionx.display_name"
          @click="select(newsSectionx.display_name)"
        >
          <md-option :value="newsSectionx.display_name">{{
            newsSectionx.display_name
          }}</md-option>
        </div>
      </md-select>
    </md-field>

    <br />

    <div
      class="md-layout-item md-size-33 md-medium-size-33 md-small-size-50 md-xsmall-size-100"
      v-for="notizia in news"
      :key="notizia.title"
      @click="
        if (notizia.multimedia !== null) {
          goTo(
            notizia.title,
            notizia.abstract,
            notizia.url,
            notizia.published_date,
            notizia.multimedia[3].url
          );
        } else {
          goTo(
            notizia.title,
            notizia.abstract,
            notizia.url,
            notizia.published_date,
            null
          );
        }
      "
    >
      <md-card md-with-hover>
        <md-card-header>
          <md-card-header-text>
            <div class="md-title card-text">{{ notizia.title }}</div>
          </md-card-header-text>

          <md-card-media>
            <img :src="notizia.thumbnail_standard" :alt="notizia.title" />
          </md-card-media>
        </md-card-header>

        <md-card-actions v-if="isAuthenticated">
          <md-button
            v-if="notizia.multimedia === null"
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
          <md-button
            v-else
            class="md-icon-button"
            @click.stop="
              Preferred(
                notizia.title,
                notizia.abstract,
                notizia.url,
                notizia.published_date,
                notizia.multimedia[3].url
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
      news: [],
      sectionList: [],
      isAuthenticated: DataService.isAuthenticated(),
      categoria: null,
      like: [],
    };
  },
  methods: {
    title() {
      DataService.getNews().then((data) => {
        this.news = data.data.results;
      });
      this.categoria = null;
    },
    goTo(title, abstract, url, date, img) {
      DataService.setarticle(title, abstract, url, date, img);
      this.$router.push({ path: "/notizia/" + title });
    },
    select(el) {
      DataService.getNewsSectionx(el).then((data) => {
        this.news = data.data.results;
      });
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
    DataService.getNews().then((data) => {
      this.news = data.data.results;
    });
    DataService.getSectionList().then((data) => {
      this.sectionList = data.data.results;
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
.md-card {
  margin: 6px;
}
h1 {
  margin: 20px;
}
.margin {
  margin: 20px;
}
.card-text {
  height: 4.1em;
  overflow: hidden;
  text-overflow: ellipsis;
}
h1:hover {
  cursor: pointer;
}
</style>