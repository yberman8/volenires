<template>


  <v-app>
    <v-main>

      <nav-bar @login="() => dialogLogin = true" :ifAuth="ifAuth" :uid="uid" :isAdmin="isAdmin" @checkAuth="checkAuth"></nav-bar>

      <login-dialog v-model="dialogLogin" v-if="dialogLogin" @show="showSnackBar" @checkAuth="checkAuth"></login-dialog>


     <div class="divSty"> 
    <p>
        אתר חיבורים מחבר בין התארגנויות לאיסוף ציוד לנזקקים והתנדבויות לבין מי שרוצה לתת ובאופן מבוקר.<br><br>

האתר מאפשר לפתוח יוזמת סיוע לפי צורך, כגון: <br><br>
•	איסוף מזון <br>
•	ציוד<br>
•	תרופות בעת מלחמה <br>
•	איסוף ילקוטים בתחילת שנת לימודים <br>
•	איסוף שמיכות ותנורים בתחילת חורף, ועוד.<br><br>


לשם שמירה על אמינות מיזמי הסיוע. הפרסומים הם רק על ידי מורשים לכך, כגון: <br><br>
•	עמותות סיוע <br><br>
	המיזמים מוצגים באתר. וכן, ניתנים להפצה ברשתות חברתיות.
כך שכל המעוניין יוכל לבדוק אם הפרסום עודנו רלוונטי. <br><br>

 יש לכם שאלות? מעוניינים בשיתופי פעולה? אתם ארגון שמעוניין לפרסם באתר?  <br>
פנו אלינו ל - office@hiboorim.org.il <br><br> ונשתדל לענות בהקדם!


    </p>
</div> 





      <!-- <v-card class="mx-auto mt-12" max-width="740px">

        <v-card-title class="d-flex justify-center ">
        </v-card-title>

        <v-card-subtitle style="font-size: 1.5rem;">
          אתר חיבורים מחבר בין התארגנויות לאיסוף ציוד לנזקקים והתנדבויות לבין מי שרוצה לתת ובאופן מבוקר.
          האתר מאפשר לפתוח יוזמת סיוע לפי צורך, כגון איסוף מזון, ציוד, ותרופות בעת מלחמה; איסוף ילקוטים בתחילת שנת
          לימודים; איסוף שמיכות ותנורים בתחילת חורף; ועוד.
          לשם שמירה על אמינות מיזמי הסיוע, הפרסומים הם רק על ידי מורשים לכך, כגון עמותות סיוע.
          המיזמים מוצגים באתר, וכן ניתנים להפצה ברשתות חברתיות, כך שכל המעוניין יוכל לבדוק אם הפרסום עודנו רלוונטי.
          <br><br>
          יש לכם שאלות? מעוניינים בשיתופי פעולה?
          אתם ארגון שמעוניין לפרסם באתר?
          פנו אלינו ל office@hiboorim.org.il ונשתדל לענות בהקדם

        </v-card-subtitle>

      </v-card> -->







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
import LoginDialog from '../components/LoginDialog'
import RequestOptions from '../tools/RequestOptions.js'
import CheckAuth from '../tools/CheckAuthFunc.js'

export default {
  name: 'about',

  components: {
    NavBar,
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
      isAdmin: false,
      uid: "",
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
    checkIfAdmin() {
      let token = localStorage.getItem("token");
      let idToCheck = { id: this.uid }
      let MyJSON = JSON.stringify(idToCheck);

      let api = this.host + "/home/checkIfAdmin"

      fetch(api, RequestOptions.request("POST", MyJSON, token)).then(res => res.json()).then(async (jsonObject) => {
        if (jsonObject[0].manager === 1) {
          this.isAdmin = true;
        } else {
          this.isAdmin = false;
        }
      });

    },
  },
  created() {
    // this.host = localStorage.getItem("HOST");
    this.host = process.env.VUE_APP_BASE_URL;

    this.checkAuth();
  },
}
</script>
<style>

        p {
            line-height: 130%;
            font-size: 1vw;
        }

        .divSty{
            background-color: #faf4f4;
            width: 50vw;
            margin-right: auto;
            margin-left: auto;
            height: 100vh;
            padding-top: 5vh;
            padding-right: 3vw;
            /* margin-top: 0; */
            /* display: block; */
        }
</style>
