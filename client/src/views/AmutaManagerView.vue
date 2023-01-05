<template>
  <v-app class="amuta">
  <v-main>

    <nav-bar @login="() => dialogLogin = true" :ifAuth="ifAuth" :uid="uid" @checkAuth="checkAuth"></nav-bar>

    <v-container class="mb-15" style="max-width: 1360px;">

    <v-row >
      <v-col cols="12" md="4" >
    <v-img class="ms-5" max-height="150px" max-width="400px"  :src="amutaDetails.logo" contain></v-img>
  </v-col>
  <v-col cols="12" md="6">
    <span class="ms-sm-5 titleSiz">עמותת {{" " + amutaDetails.name}}</span>
  </v-col>
    </v-row>
    <complete-form v-if="formNotComplete" :details="amutaDetails" @Updated="updatedForm" @Canceled="cancleForm" />

    <div class="m-3 blockE blockS">
    <v-btn small color="black" dark class="ms-4 " v-if="formNotComplete == false" @click="add()">
                  <v-icon dark>
                    mdi-plus
                  </v-icon>
                  חדש
                </v-btn>
                <v-btn class="ms-4 blockB " small color="black" dark   v-if="formNotComplete == false" @click="editAmuta()">
                  <v-icon dark>
                    mdi-pencil
                  </v-icon>
                  ערוך פרטי עמותה
                </v-btn>
                <v-btn class="ms-4 blockB " small color="black" dark  v-if="formNotComplete == false" @click="editSettings()">
                  <v-icon dark>
                    mdi-cog-outline
                  </v-icon>
                  הגדרות ברירת מחדל
                </v-btn>
              </div>

    <amuta-pirsumim-list v-if="formNotComplete == false" :amutaEmail="amutaDetails.email" @editpirsum="edit" :addedPirsumUI="addedPirsumUI"  :editedPirsumUI="editedPirsumUI"
     :editedpirsumUIINdex="editedpirsumUIINdex"/>

  </v-container>

  <edit-pirsum-dialog v-model="dialogAddEdit" :isNew="isNew"  v-if="dialogAddEdit" @addedPirsum="addedPirsumUIFunc"
   @editedPirsum="editedPirsumFunc" :amutObj="amutaDetails" :pirsumEditObj="pirsumEditObj" :defaultStObj="amutaDefaultSettings">
  </edit-pirsum-dialog>

  <edit-settings-dialog v-model="dialogSettingsEdit" v-if="dialogSettingsEdit" :defaultObj="amutaDefaultSettings" @updated="updatedDefault">
  </edit-settings-dialog>

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
import NavBar from '../components/NavBar.vue'
import CompleteForm from '../components/amuta/CompleteForm.vue'
import amutaPirsumimList from '../components/amuta/amutaPirsumimList.vue'
import EditPirsumDialog from '../components/amuta/EditPirsumDialog.vue'
import EditSettingsDialog from '../components/amuta/defaultSettingsDialog.vue'
import FooterNav from '../components/Footer.vue'
import RequestOptions from '../tools/RequestOptions.js'
import CheckAuth from '../tools/CheckAuthFunc.js'

export default {
  name: 'amutaManager',

  components: {
    NavBar,
    CompleteForm,
    amutaPirsumimList,
    EditPirsumDialog,
    FooterNav,
    EditSettingsDialog
  },
  data() {
    return {
      dialogAddEdit: false,
      dialogSettingsEdit: false,
      isNew: true,
      snackbar: false,
      snackbarColorBt: "green",
      snacbarText: "",
      formNotComplete: false,
      amutaDetails: {name:""},
      amutaDefaultSettings: {},
      pirsumEditObj: {},
      editedPirsumUI: {},
      editedpirsumUIINdex: 0,
      addedPirsumUI: {},
      progressShow: false,
      ifAuth: true,
      uid:"",  
      host:""    
    }
  },
  methods: {
    async getAmutaInfo() {
      this.progressShow = true;
      const userId = localStorage.getItem('uid');
      let token = localStorage.getItem("token");
      this.uid = userId;
      let MyJSON = JSON.stringify({id:userId});

      let api = this.host + "/amuta/getInfo"

      fetch(api, RequestOptions.request("POST", MyJSON,token)).then(res => res.json()).then(async (jsonObject) => {
        this.amutaDetails = {
          id: jsonObject.id,
          name: jsonObject.name,
          email: jsonObject.email,
          phone: jsonObject.phone,
          status: jsonObject.status,
          whatsapp: jsonObject.whatsapp,
          notes: jsonObject.notes,
          about: jsonObject.about,
          contact_name: jsonObject.contact_name,
          contact_phone: jsonObject.contact_phone,
          contact_email: jsonObject.contact_email,
          logo: jsonObject.logo,
          website: jsonObject.website,
          city: jsonObject.city,
        };
        this.amutaDefaultSettings = {
          defaultShEmail: jsonObject.default_show_email,
          defaultShPhone: jsonObject.default_show_phone,
          defaultShWhatsapp: jsonObject.default_show_whatsapp,
        };
      }).then(()=> {this.checkIfForumComlt()}).catch((error) => {
        this.progressShow = false;
        this.showSnackBar("Error get amutot list: " + error, "red");
      });
    },
    showSnackBar(message, color) {
      this.snacbarText = message;
      this.snackbarColorBt = color;
      this.snackbar = true;
    },
    checkIfForumComlt(){

      if (this.amutaDetails.nameContact === "" || this.amutaDetails.phoneContact === "" || this.amutaDetails.logo === ""  || this.amutaDetails.emailContact === ""
       || this.amutaDetails.website === "" || this.amutaDetails.whatsapp === "" || this.amutaDetails.city === ""
      ) {
        this.formNotComplete = true;
      }
    },
    async checkAuth() {

      let answer = await CheckAuth.checkauth();
      if (answer !== "expired token" && answer !== "") {
        localStorage.setItem("uid", answer)
        this.uid = answer.toString();
        this.ifAuth = true;
      } else if (answer === "expired token") {
        this.uid = "";
        this.ifAuth = false;
        this.$router.replace({ path: '/' })
      } else {
        this.uid = "";
        this.ifAuth = false;
        this.$router.replace({ path: '/' })
      }
    },
    addedPirsumUIFunc(item,text,color){
      if (item === null) {
        this.showSnackBar(text,color);
        return
      }
         this.addedPirsumUI = item;
         this.showSnackBar(text,color);
    },
    editedPirsumFunc(item,text,color){
      if (item === null) {
        this.showSnackBar(text,color);
        return
      }
      this.editedPirsumUI = item;
      this.showSnackBar(text,color);
    },
    updatedForm(){
      this.formNotComplete = false;
      this.showSnackBar("הפרטים עודכנו בהצלחה", "green");
      this.getAmutaInfo();
    },
    updatedDefault(text,color,objDefaultChanged){
      this.dialogSettingsEdit = false;
      this.showSnackBar(text, color);
      // update defaultSettingsUI
      if (color !== "red") {
        this.amutaDefaultSettings.defaultShEmail = objDefaultChanged.showEmail;
        this.amutaDefaultSettings.defaultShPhone = objDefaultChanged.showPhone;
        this.amutaDefaultSettings.defaultShWhatsapp = objDefaultChanged.showWhatsapp;
      }
    },
    cancleForm(){
      this.formNotComplete = false;
    },
    add(){
      this.dialogAddEdit = true;
      this.isNew = true;
    },
    edit(item,index){
      this.isNew = false;
      this.pirsumEditObj = item
      this.dialogAddEdit = true;
     this.editedpirsumUIINdex = index;
    },
    editAmuta(){
      this.formNotComplete = true;
    },
    editSettings(){
       this.dialogSettingsEdit = true;
    },
  },
  created() {
    this.host = process.env.VUE_APP_BASE_URL;
    this.getAmutaInfo();
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

  @media only screen and (min-width: 600px) {
  
  .blockE {
      display: flex;
      justify-content: center;
  }
}
@media only screen and (max-width: 400px) {
  
  .blockS {
      display: flex;
      flex-direction: column;
  }
  .blockB {
      margin-top: 20px;
  }
}
  
  /* רספונסיביות של  כותרת טבלה     */
  @media only screen and (min-width: 500px) {
  
    .titleSiz {
      font-size: 4vw;
  
    }
  }
  </style>
  