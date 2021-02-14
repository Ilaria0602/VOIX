import axios from "axios";
import firebase from "@firebase/app";
import "@firebase/firestore";

var firebaseConfig = {
  apiKey: "AIzaSyAe9Lxb0yFnVWiiD9Pm32F30X7Tg-dWfIg",
  authDomain: "voix-3042c.firebaseapp.com",
  projectId: "voix-3042c",
  storageBucket: "voix-3042c.appspot.com",
  messagingSenderId: "593828346876",
  appId: "1:593828346876:web:875d6ff9fbba34a3a0d079"
};
!firebase.apps.length
  ? firebase.initializeApp(firebaseConfig).firestore()
  : firebase.app().firestore();

var db = firebase.firestore();
var user = null;
export default {
  isAuthenticated() {
    return !!localStorage.getItem("username");
  },
  login(username) {
    localStorage.setItem("username", username);
  },

  logout() {
    localStorage.removeItem("username");
  },
  getNews() {
    return axios.get(
      "https://api.nytimes.com/svc/news/v3/content/all/all.json?api-key=QB2cFUD2wd9YN7mfXP8dFaDR7jyarI61"
    );
  },
  searchNotizia(text) {
    return axios
      .get(
        "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=" +
          text +
          "&api-key=QB2cFUD2wd9YN7mfXP8dFaDR7jyarI61"
      )
      .then((data) => {
        return data.data.response.docs.filter(
          (element) => element.headline.main.indexOf(text) >= 0
        );
      });
  },
  getSectionList() {
    return axios.get(
      "https://api.nytimes.com/svc/news/v3/content/section-list.json?api-key=QB2cFUD2wd9YN7mfXP8dFaDR7jyarI61"
    );
  },
  getNewsSectionx(display_name) {
    return axios.get(
      "https://api.nytimes.com/svc/news/v3/content/nyt/" +
        display_name.toLowerCase() +
        ".json?api-key=QB2cFUD2wd9YN7mfXP8dFaDR7jyarI61"
    );
  },
  getTopStories() {
    return axios.get(
      "https://api.nytimes.com/svc/mostpopular/v2/viewed/7.json?api-key=QB2cFUD2wd9YN7mfXP8dFaDR7jyarI61"
    );
  },
  getUser() {
    user = localStorage.getItem("username");
  },
  setLike(name, abstract, url, date, img) {
    this.getUser();
    return db
      .collection("like")
      .doc(user + "-" + name)
      .set({
        articolo: name,
        user: user,
        abstract: abstract,
        url: url,
        date: date,
        img: img
      });
  },
  removeLike(name) {
    this.getUser();
    db.collection("like")
      .doc(user + "-" + name)
      .delete();
  },
  getLikePerson() {
    this.getUser();
    return db
      .collection("like")
      .where("user", "==", user)
      .get()
      .then((data) => {
        return data.docs.map((doc) => doc.data());
      });
  },
  setarticle(name, abstract, url, date, img) {
    return db.collection("article").doc("article").set({
      articolo: name,
      abstract: abstract,
      url: url,
      date: date,
      img: img,
      type: "article"
    });
  },
  getarticle() {
    return db
      .collection("article")
      .where("type", "==", "article")
      .get()
      .then((data) => {
        return data.docs.map((doc) => doc.data());
      });
  },
  setComment(comment, articolo) {
    this.getUser();
    return db
      .collection("comment")
      .doc(articolo + "-" + comment + "-" + user)
      .set({
        articolo: articolo,
        user: user,
        comment: comment
      });
  },
  getComment(articolo) {
    this.getUser();
    return db
      .collection("comment")
      .where("articolo", "==", articolo)
      .get()
      .then((data) => {
        return data.docs.map((doc) => doc.data());
      });
  },
  removecomment(comment, articolo) {
    this.getUser();
    db.collection("comment")
      .doc(articolo + "-" + comment + "-" + user)
      .delete();
  }
};
