<template>
  <div>
    <md-card v-if="!isAuthenticated">
      <md-card-header>
        <span class="md-title"> Login </span>
      </md-card-header>
      <md-card-content>
        <md-field>
          <label>Username</label>
          <md-input v-model="username"> </md-input>
        </md-field>
      </md-card-content>
      <md-card-actions>
        <md-button
          class="md-primary md-raised"
          :disabled="!username"
          @click="signIn()"
        >
          Sign in
        </md-button>
      </md-card-actions>
    </md-card>
    <md-card v-else>
      <md-card-header>
        <span class="md-title"> Logout </span>
      </md-card-header>
      <md-card-content> Are you sure you want to quit?</md-card-content>
      <md-card-actions>
        <md-button class="md-raised" @click="Annulla()"> Cancel </md-button>
        <md-button class="md-accent md-raised" @click="Logout()">
          Logout
        </md-button>
      </md-card-actions>
    </md-card>
  </div>
</template> 

<script>
import DataService from "../dataservice";
export default {
  data: function () {
    return {
      username: "",
      isAuthenticated: DataService.isAuthenticated(),
    };
  },
  methods: {
    signIn: function () {
      DataService.login(this.username);
      this.$router.push({ path: "/" });
    },
    Logout: function () {
      DataService.logout();
      this.$router.push({ path: "/" });
    },
    Annulla: function () {
      this.$router.push({ path: "/" });
    },
  },
};
</script>

<style>
</style>