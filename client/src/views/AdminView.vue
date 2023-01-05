<template>
  <v-app class="manager">
  <v-main>

    <nav-bar @login="() => dialogLogin = true" :ifAuth="ifAuth" :uid="uid" :isAdmin="isAdmin" @checkAuth="checkAuth"></nav-bar>

    <span class="d-flex justify-center titleSiz">רשימת עמותות</span>

    <!-- <router-link to="/Login">ergrgrrhrtjhtyjyttyjyjyrjtrjhtrgrrg</router-link> -->

    <amutot-list></amutot-list>


  </v-main>

<footer-nav></footer-nav>
</v-app>

</template>
  
<script>
import AmutotList from '../components/admin/AmutotList'
import NavBar from '../components/NavBar'
import FooterNav from '../components/Footer'
import CheckAuth from '../tools/CheckAuthFunc.js'

export default {
  name: 'manager',

  components: {
    AmutotList,
    NavBar,
    FooterNav
  },
  data() {
    return {
      ifAuth: false,
      uid:"",
      isAdmin: false,
    }
  },
  methods: {
    async checkAuth() {

      let answer = await CheckAuth.checkauth();
      if (answer !== "expired token" && answer !== "") {
        localStorage.setItem("uid", answer)
        this.uid = answer.toString();
        this.ifAuth = true;
        this.isAdmin = true;
      } else if (answer === "expired token") {
        this.uid = "";
        this.ifAuth = false;
        this.isAdmin = false
        this.$router.replace({ path: '/' })
      } else {
        this.uid = "";
        this.ifAuth = false;
        this.isAdmin = false;
        this.$router.replace({ path: '/' })
      }
    },

  },
  created() {
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
  