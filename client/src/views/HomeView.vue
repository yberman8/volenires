<template>
  <v-app>
    <v-main>

      <nav-bar @login="() => dialogLogin = true" :ifAuth="ifAuth" :uid="uid" :isAdmin="isAdmin" @checkAuth="checkAuth"></nav-bar>

       
      <v-container class="mb-15" style="max-width: 1360px;">

        <span class="d-flex justify-center titleSiz">החיבורים שלנו – הלב שלך</span>


        <home-pirsumim-list />

      </v-container>

      <!-- כפתור נגישות בהתאמה אישית -->
        <!-- <v-btn  icon rounded fixed bottom  elevation="2" fab>
        <v-img src="../assets/accessibility.png" max-width="35" contain></v-img>
      </v-btn> -->

     

      <Login-dialog v-model="dialogLogin" @show="showSnackBar" @checkAuth="checkAuth"></Login-dialog>

      <v-snackbar v-model="snackbar" :timeout="5000">
        {{ snacbarText }}
        <template v-slot:action="{ attrs }">
          <v-btn :color="snackbarColorBt" text v-bind="attrs" @click="snackbar = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>

    </v-main>

    <footer-nav></footer-nav>
  </v-app>

</template>
<script>
import NavBar from '../components/NavBar'
import FooterNav from '../components/Footer'
import HomePirsumimList from '../components/home/HomePirsumimList'
import LoginDialog from '../components/LoginDialog'
import CheckAuth from '../tools/CheckAuthFunc.js'
import RequestOptions from '../tools/RequestOptions.js'

export default {
  name: 'home',

  components: {
    NavBar,
    HomePirsumimList,
    LoginDialog,
    FooterNav,
  },
  data() {
    return {

      dialogLogin: false,
      snackbar: false,
      snackbarColorBt: "green",
      snacbarText: "",
      ifAuth: false,
      uid: "",
      isAdmin: false,
      host:""
    }
  },
  methods: {
    showSnackBar(message, color) {
      this.snacbarText = message;
      this.snackbarColorBt = color;
      this.snackbar = true;
    },
    async checkAuth() {

      let answer = await CheckAuth.checkauth();
      if (answer !== "expired token" && answer !== "") {
        localStorage.setItem("uid", answer)
        this.uid = answer.toString();
        this.ifAuth = true;
        this.checkIfAdmin();
      } else if (answer === "expired token") {
        this.uid = "";
        this.ifAuth = false;
      } else {
        this.uid = "";
        this.ifAuth = false;
      }
    },
    checkIfAdmin(){
        let token = localStorage.getItem("token");
        let idToCheck = {id: this.uid}
        let MyJSON = JSON.stringify(idToCheck);

        let api = this.host + "/home/checkIfAdmin"

        fetch(api, RequestOptions.request("POST", MyJSON,token)).then(res => res.json()).then(async (jsonObject) => {
           if (jsonObject[0].manager === 1) {
              this.isAdmin = true;
           }else{
            this.isAdmin = false;
           }
    });

  },
},
  created() {
    this.host = process.env.VUE_APP_BASE_URL;
    this.checkAuth();
  },

}
</script>
<style>
/* רספונסיביות של  כותרת טבלה     */
@media only screen and (max-width: 500px) {

  .titleSiz {
    font-size: 1.2rem;

  }
}

/* רספונסיביות של  כותרת טבלה     */
@media only screen and (min-width: 500px) {

  .titleSiz {
    font-size: 4vw;

  }
}
</style>
