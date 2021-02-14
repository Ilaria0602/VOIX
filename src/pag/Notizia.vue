<template>
  <div>
    <md-card>
      <div class="content">
        <div v-if="wind > 600">
          <img
            v-if="notizia.img != null"
            class="margin immagine md-layout-item md-size-40"
            :src="notizia.img"
            :alt="notizia.title"
            align="right"
          />
          <div class="md-display-2 margin titolo">
            {{ notizia.articolo }}
          </div>
        </div>
        <div v-else>
          <div class="md-title margin">{{ notizia.articolo }}</div>
          <img
            v-if="notizia.img != null"
            class="margin immagine"
            :src="notizia.img"
            :alt="notizia.title"
          />
        </div>
      </div>
      <div class="margin abstract">
        {{ notizia.abstract }}
      </div>
      <div class="margin">Published on {{ notizia.date.split("T")[0] }}</div>
      <md-button class="md-primary" style="margin: 25px" :href="notizia.url"
        >Open link</md-button
      >
      <md-card-actions v-if="isAuthenticated">
        <md-button
          class="md-icon-button"
          @click.stop="
            Preferred(
              notizia.articolo,
              notizia.abstract,
              notizia.url,
              notizia.date,
              notizia.img
            )
          "
        >
          <md-icon v-if="like">favorite</md-icon>
          <md-icon v-else>favorite_border</md-icon>
        </md-button>
      </md-card-actions>
      <md-divider v-if="comments > 0 || isAuthenticated"></md-divider>
      <div class="margin">
        <span v-if="comments.length > 0">Comments:</span>
        <md-list class="md-double-line">
          <md-list-item v-for="(comment, i) in comments" :key="i">
            <md-avatar class="md-icon"> account_circle </md-avatar>
            <div class="md-list-item-text">
              <span>{{ comment.user }}</span>
              <span>{{ comment.comment }}</span>
            </div>
            <md-button
              v-if="comment.user == user"
              class="md-icon-button md-list-action"
              @click="
                deletecomment(comment.user, comment.comment, comment.articolo)
              "
            >
              <md-icon>delete</md-icon>
            </md-button>
          </md-list-item>
        </md-list>
        <md-field v-if="isAuthenticated">
          <label>Add a comment...</label>
          <md-textarea v-model="textarea"></md-textarea>
        </md-field>
        <md-card-actions v-if="isAuthenticated">
          <md-button
            :disabled="!textarea"
            class="md-raised md-primary"
            @click="send()"
            >send</md-button
          >
        </md-card-actions>
      </div>
    </md-card>
  </div>
</template>

<script>
import DataService from "../dataservice";
export default {
  data: function () {
    return {
      notizia: [],
      wind: window.innerWidth,
      isAuthenticated: DataService.isAuthenticated(),
      like: false,
      textarea: null,
      comments: [],
      user: localStorage.getItem("username"),
    };
  },
  mounted() {
    window.addEventListener("resize", () => {
      this.wind = window.innerWidth;
    });
  },
  created() {
    DataService.getarticle().then((data) => {
      this.notizia = data[0];
      DataService.getComment(this.notizia.articolo).then((data) => {
        this.comments = data;
      });
    });
    DataService.getLikePerson().then((data) => {
      data.forEach((element) => {
        if (element.articolo === this.notizia.articolo) {
          this.like = true;
        }
      });
    });
  },
  methods: {
    Preferred(name, abstract, url, date, img) {
      if (this.like === true) {
        DataService.removeLike(name);
        this.like = false;
      } else {
        DataService.setLike(name, abstract, url, date, img);
        this.like = true;
      }
    },
    send() {
      DataService.setComment(this.textarea, this.notizia.articolo);
      let x = {
        comment: this.textarea,
        articolo: this.notizia.articolo,
        user: localStorage.getItem("username"),
      };
      this.comments.push(x);
      this.textarea = null;
    },
    deletecomment(user, comment, articolo) {
      DataService.removecomment(comment, articolo);
      this.comments = this.remove(this.comments, user, comment, articolo);
    },
    remove(lk, user, comment, articolo) {
      var indice = 0;
      while (indice < lk.length) {
        if (
          lk[indice].user === user &&
          lk[indice].comment === comment &&
          lk[indice].articolo === articolo
        ) {
          lk.splice(indice, 1);
        } else {
          ++indice;
        }
      }
      return lk;
    },
  },
};
</script>

<style>
.abstract {
  text-align: justify;
}
.margin {
  padding: 20px;
}
.titolo {
  width: 50%;
}
</style>