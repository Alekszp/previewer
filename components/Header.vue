<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="info" sticky>
      <b-navbar-brand class="text-uppercase" href="/">Previewer</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-form>
            <b-button
              v-if="$store.state.authUser === null"
              @click="openModalUserCredentials('registrate')"
              size="sm"
              variant="light"
              class="mr-2"
            >Register</b-button>
            <b-button
              v-if="$store.state.authUser === null"
              @click="openModalUserCredentials('login')"
              size="sm"
              variant="light"
              class="my-2"
            >Login</b-button>
            <div v-else>
              <span class="text-white font-weight-bold mr-3">Hello, {{$store.state.authUser}}</span>
              <b-button  size="sm" variant="light" class="my-2 my-sm-0" href="/" @click='logout'>Logout</b-button>
            </div>
            
          </b-nav-form>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    
    <!-- register modal -->
    <b-modal centered :title="isLoginClicked ? 'Login' : 'Registration'" ref="credentialsModal">
      <b-card bg-variant="light">
        <b-form-group
          label="Username"
          label-for="username-input"
          :state="usernameState"
          :invalid-feedback="invalidUsernameFeedback"
        >
          <b-form-input id="username-input" v-model="username" trim></b-form-input>
        </b-form-group>

        <b-form-group
          label="Password"
          label-for="username-input"
          :state="passwordState"
          :invalid-feedback="invalidPasswordFeedback"
        >
          <b-form-input id="password-input" v-model="password" type="password" trim></b-form-input>
        </b-form-group>
      </b-card>
      <template slot="modal-footer">
        <b-button variant="primary" @click="closeModaluserRegistration">Cancel</b-button>
        <b-button v-if="!isLoginClicked" variant="success" @click="userRegistration">Send</b-button>
        <b-button v-else variant="success" @click="login">Send</b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import axios from "axios";
import _ from "lodash";

export default {
  transition: "bounce",
  data() {
    return {
      formError: null,
      username: "",
      password: "",
      isLoginClicked: false
    };
  },
  created() {
    this.getAuthentification()
    this.getUser()
    this.getProducts()
  },
  computed: {
    usernameState() {
      return this.username.length >= 4 ? true : false;
    },
    passwordState() {
      return this.password.length >= 4 ? true : false;
    },
    invalidUsernameFeedback() {
      if (this.username.length < 4) {
        return "Enter at least 4 characters";
      }
    },
    invalidPasswordFeedback() {
      if (this.password.length < 4) {
        return "Enter at least 4 characters";
      }
    }
  },
  methods: {
    getAuthentification(){
      this.$store.dispatch("getAuth")
    },
    getUser(){
      this.$store.dispatch("getUser")
    },
    async getProducts() {
      try {
        this.$store.dispatch("getProducts")
      } catch (e) {
        this.formError = e.message;
      }
    },
    openModalUserCredentials(modalType) {
      this.isLoginClicked = modalType === 'registrate' ? false : true
      this.$refs.credentialsModal.show()
    },
    closeModaluserRegistration() {
      this.isLoginClicked = false
      this.$refs.credentialsModal.hide()
    },
    async userRegistration() {
      if (this.usernameState && this.passwordState) {
        try {
          this.$store.dispatch("register", {
            username: this.username,
            password: this.password
          });
        } catch {}
        this.$refs.credentialsModal.hide()
      }
    },
    async login() {
      try {
        await this.$store.dispatch("login", {
          username: this.username,
          password: this.password
        });
      } catch (e) {
        this.formError = e.message
      }
      this.$refs.credentialsModal.hide()
    },
    async logout() {
     await this.$store.dispatch("logout");
    }
  }
};
</script>

<style>
.container {
  padding: 100px;
}
.error {
  color: red;
}
</style>
