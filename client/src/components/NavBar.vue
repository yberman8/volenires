<template>

  <v-main>

    <v-app-bar color="red lighten-1" dark rounded>

      <v-toolbar-title>
        <router-link to="/">
          <v-img alt="Vuetify Logo" class="shrink mr-2" style="border-radius: 10px;" contain
            src="../assets/giveItIcon.png" transition="scale-transition" max-width="80" />
        </router-link>
      </v-toolbar-title>

      <v-toolbar-items class="hidden-sm-and-down ms-3">
        <v-btn v-for="item in menu" :key="item.id" :to="item.link" text v-if="item.show">{{ item.title }}</v-btn>
      </v-toolbar-items>

      <v-spacer></v-spacer>

     
      <v-btn depressed @click="loginOrOutFunc('auth')" class="hidden-sm-and-down">
        {{ authButton }}
      </v-btn>

      <div class="hidden-md-and-up">

        <v-menu bottom left>
          <template v-slot:activator="{ on, attrs }">
            <v-btn dark icon v-bind="attrs" v-on="on">
              <v-app-bar-nav-icon></v-app-bar-nav-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item v-for="item in menu" :key="item.id" :to="item.link">
              <v-list-item-title @click="loginOrOutFunc(item.id)">{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>

    </v-app-bar>

    <v-snackbar v-model="snackbar" :timeout="5000">
      {{ snacbarText }}
      <template v-slot:action="{ attrs }">
        <v-btn :color="snackbarColorBt" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>

  </v-main>

</template>

<script>



export default {
  props: {
    ifAuth: Boolean,
    uid: String,
    isAdmin: Boolean
  },
  components: {

  },
  data() {
    return {
      drawer: false,
      authButton: "יציאה",
      menu: [],
      snackbar: false,
      snackbarColorBt: "green",
      snacbarText: "",
    }
  },
  methods: {

    loginOrOutFunc(key) {

      if (key === "auth") {
        if (this.authButton === "יציאה") {
          localStorage.setItem("uid", "");
          localStorage.setItem("token", "");
          this.$emit("checkAuth");
          this.showSnackBar("התנתקת מהחשבון", "green");
        }

      }
      if (this.authButton === "התחבר") {
        this.$emit("login");
      }
    },

    setNavListIfAuth() {

      if (this.ifAuth === true) {
        this.authButton = "יציאה"
        // Check if user is an admin
        if (this.isAdmin === true) {
          this.menu = [
            { id: "home", title: "דף הבית", link: "/", show: true },
            { id: "about", title: "אודות", link: "/about", show: true },
            { id: "manager", title: "ניהול עמותות", link: "/adminManage", show: true },
            { id: "auth", title: "יציאה", show: false }
          ]
        } else {
          this.menu = [
            { id: "home", title: "דף הבית", link: "/", show: true },
            { id: "about", title: "אודות", link: "/about", show: true },
            { id: "amutaManager", title: "אזור אישי", link: "/amutaManage", show: true },
            { id: "auth", title: "יציאה", show: false }
          ]
        }
      } else {
        this.authButton = "התחבר"
        this.menu = [
          { id: "home", title: "דף הבית", link: "/", show: true },
          { id: "about", title: "אודות", link: "/about", show: true },
          { id: "auth", title: "התחבר", show: false },
        ]
      }

    },
    showSnackBar(message, color) {
      this.snacbarText = message;
      this.snackbarColorBt = color;
      this.snackbar = true;
    },
  },
  watch: {
    ifAuth() {
      this.setNavListIfAuth();
    },
    isAdmin() {
      this.setNavListIfAuth();
    }
  },
  created() {
    this.setNavListIfAuth();

  },
}
</script>
