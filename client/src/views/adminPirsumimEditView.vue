<template>
  <div class="amuta">


    <v-container class="mb-15" style="max-width: 1360px;">

      <v-row>
        <v-col cols="12" md="4">
          <v-img class="ms-5 border border-1 " max-height="150px" max-width="400px" :src="amutaDetails.logo"
            contain>
          </v-img>
        </v-col>
        <v-col cols="12" md="6">
          <span class="ms-sm-5 titleSiz">עמותת {{ " " + amutaDetails.name }}</span>
        </v-col>
      </v-row>

      <complete-form v-if="formNotComplete" :details="amutaDetails" @Updated="updatedForm"
        @Canceled="cancleForm" />

      <div class="m-3 d-flex justify-center">
        <v-btn class="ms-4" small color="black" dark v-if="formNotComplete == false" @click="editAmuta()">
          <v-icon dark>
            mdi-pencil
          </v-icon>
          ערוך פרטי עמותה
        </v-btn>
      </div>

      <control-pirsumim v-if="formNotComplete == false" @editpirsum="edit" :amutObj="this.amutaDetails"
        :editedPirsumUI="editedPirsumUI" :editedpirsumUIINdex="editedpirsumUIINdex" />

    </v-container>

    <edit-pirsum-dialog v-model="dialogAddEdit" :isNew="isNew" v-if="dialogAddEdit" @addedPirsum="addedPirsumUIFunc"
      @editedPirsum="editedPirsumFunc" :amutObj="amutaDetails" :pirsumEditObj="pirsumEditObj">
    </edit-pirsum-dialog>

    <v-snackbar v-model="snackbar" :timeout="5000">
      {{ snacbarText }}
      <template v-slot:action="{ attrs }">
        <v-btn :color="snackbarColorBt" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>

  </div>

</template>
    
<script>
import controlPirsumim from '../components/admin/controlPirsumim.vue'
import EditPirsumDialog from '../components/amuta/EditPirsumDialog'
import CompleteForm from '../components/amuta/CompleteForm'
import RequestOptions from '../tools/RequestOptions.js'
import CheckAuth from '../tools/CheckAuthFunc.js'


export default {
  name: 'adminEditor',

  components: {
    CompleteForm,
    controlPirsumim,
    EditPirsumDialog
  },
  data() {
    return {
      dialogAddEdit: false,
      isNew: true,
      snackbar: false,
      snackbarColorBt: "green",
      snacbarText: "",
      formNotComplete: false,
      amutaDetails: {},
      pirsumEditObj: {},
      editedPirsumUI: {},
      editedpirsumUIINdex: 0,
      addedPirsumUI: {},
      progressShow: false,
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
      } else if (answer === "expired token") {
        this.$router.replace({ path: '/' })
      } else {
        this.$router.replace({ path: '/' })
      }
    },
    async getAmutaDetails() {

      let amutaId = localStorage.getItem('amutaId');

      let newAmutaObj = {
        amutaId: amutaId,
      }
      let MyJSON = JSON.stringify(newAmutaObj);
      let token = localStorage.getItem("token");

      this.progressShow = true

      this.amutaDetails = {};
      let api = this.host + "/admin/detailsAmuta"

      fetch(api, RequestOptions.request("POST", MyJSON,token)).then(res => res.json()).then(async (jsonObject) => {
          this.amutaDetails = jsonObject[0];
      }).then(() => {
        this.progressShow = false;
      }).catch((error) => {
        this.progressShow = false;
        this.showSnackBar("Error get amutoa details: " + error, "red");
      });

    },
    editedPirsumFunc(item, text, color) {
      if (item === null) {
        this.showSnackBar(text, color);
        return
      }
      this.editedPirsumUI = item;
      this.showSnackBar(text, color);
    },
    updatedForm() {
      this.formNotComplete = false;
      this.showSnackBar("הפרטים עודכנו בהצלחה", "green");
      this.getAmutaDetails();
    },
    cancleForm() {
      this.formNotComplete = false;
    },
    edit(item, index) {
      this.isNew = false;
      this.pirsumEditObj = item
      this.dialogAddEdit = true;
      this.editedpirsumUIINdex = index;
    },
    editAmuta() {
      this.formNotComplete = true;
    }
  },
  created() {
    this.host = process.env.VUE_APP_BASE_URL;
    if (this.$route.params.amutObj.id !== "") {
      localStorage.setItem('amutaId', this.$route.params.amutObj.id);
    }
    this.checkAuth();
    this.getAmutaDetails();
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
    