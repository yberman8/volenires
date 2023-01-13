<template>
  <div>

    <v-row class="mt-10 d-flex justify-center">

      <v-col class="" cols="6" sm="3" style="max-width: 200px;">
        <v-select :items="selectActive" v-model="selectActiveModel" label="סנן פעילים"></v-select>
      </v-col>
    </v-row>

    <v-row v-if="progressShow">
      <v-col class="d-flex justify-center">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </v-col>
    </v-row>

    <span class="d-flex justify-center m-4 font-weight-bold">{{ showPirsumim.length + " תוצאות" }}</span>

    <v-row class="d-flex">
      <v-col cols="12" sm="6" md="4" v-for="(item, index) in showPirsumim">
        <v-card class="mx-auto" max-width="340px" :style="activeColor(item.status_pirsum)">

          <v-card-subtitle class="pb-0 d-flex">
            <div>
              {{ item.fullDatePlusHeb }}
            </div>
            <v-spacer></v-spacer>
            <div>{{ item.city }}</div>

          </v-card-subtitle>

          <v-card-title class="pt-0">
            <span v-if="item.status_pirsum === 'פעילים'">{{ item.title }} </span>
            <div v-else>
              <div>{{ item.title }} </div>
              <div>{{ " הסתיים!" }}</div>
            </div>
          </v-card-title>

          <v-card-subtitle class="pb-0 font-weight-regular">
            {{ item.content }}
            <v-img class="white--text align-end subheading" v-if="item.status_pirsum === 'פעילים' && item.picture !== ''" height="100px" :src="item.picture" contain></v-img>
          </v-card-subtitle>
          <v-card-subtitle class="pb-0 font-weight-regular">
            {{ ("כתובת איסוף: " + item.pick_up_address) }}
          </v-card-subtitle>

          <v-card-actions class="d-flex justify-center">

            <v-btn v-if="item.status_pirsum === 'פעילים'" icon @click="edit(item, index)">
              <v-icon>mdi-file-edit-outline</v-icon>
            </v-btn>

            <v-btn icon @click="openDeleteDialog(item.id_pirsum, index)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>

            <v-btn v-if="item.status_pirsum === 'פעילים'" icon @click="openDoneDialog(item, index)">
              <v-icon>mdi-bottle-wine</v-icon>
            </v-btn>

          </v-card-actions>

        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">האם אתה בטוח שברצונך למחוק את הפרסום?</v-card-title>
        <v-row v-if="progressShowDialog">
          <v-col class="d-flex justify-center">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </v-col>
        </v-row>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="() => dialogDelete = false">ביטול</v-btn>
          <v-btn color="blue darken-1" text @click="deleteFunc">אישור</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogComplete" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">האם אתה בטוח שברצונך לסיים את הפרסום?</v-card-title>
        <v-row v-if="progressShowDialog">
          <v-col class="d-flex justify-center">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </v-col>
        </v-row>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="() => dialogComplete = false">ביטול</v-btn>
          <v-btn color="blue darken-1" text @click="done">אישור</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
import RequestOptions from '../../tools/RequestOptions.js'
import FullDate from '../../tools/FullDate.js'

export default {
  props: {
    addedPirsumUI: { type: Object, default: {} },
    editedPirsumUI: { type: Object, default: {} },
    editedpirsumUIINdex: Number,
    amutaEmail: String,
  },
  components: {
  },
  data() {
    return {
      selectActiveModel: "הכל",
      selectActive: ["הכל", 'פעילים', 'הסתיימו'],
      progressShow: false,
      progressShowDialog: false,
      dialogShare: false,
      dialogDelete: false,
      dialogComplete: false,
      snackbar: false,
      snackbarColorBt: "green",
      snacbarText: "",
      showPirsumim: [],
      shareItem: {},
      itemTodelete: "",
      itemToComplete: {},
      itemTodeleteIndex: 0,
      itemToCompleteIndex: 0,
      host:""
    }
  },
  methods: {
    share(item) {
      this.shareItem = item,
        this.dialogShare = true
    },
    // מעביר פונקצייה לדף עמותה ומשם עובר לדיאלוג עריכה
    edit(item, index) {
      this.$emit("editpirsum", item, index);
    },
    openDeleteDialog(pirsumId, index) {
      this.itemTodelete = pirsumId;
      this.dialogDelete = true;
      this.itemTodeleteIndex = index;
    },
    async deleteFunc() {
      this.progressShowDialog = true;
      let token = localStorage.getItem("token");
      let MyJSON = JSON.stringify({ pirsum_id: this.itemTodelete });

      let api = this.host + "/amuta/deletePirsum"

      fetch(api, RequestOptions.request("DELETE", MyJSON, token)).then(res => res.json()).then((jsonObject) => {
        this.deleteFolderImages();
        this.progressShowDialog = false;
        this.dialogDelete = false
        this.showSnackBar("הפרסום נמחק בהצלחה!", "green");
        this.showPirsumim.splice(this.itemTodeleteIndex, 1);
      }).catch((error) => {
        this.showSnackBar("Error delete pirsum: " + error, "red");
        this.progressShowDialog = false;
        this.dialogDelete = false
      });

    },
    async deleteFolderImages() {
      let token = localStorage.getItem("token");
      let MyJSON = JSON.stringify({ pirsum_id: this.itemTodelete,amutaEmail: this.amutaEmail});
      let api = this.host + "/amuta/deleteFolderImages"

      fetch(api, RequestOptions.request("POST", MyJSON, token)).then(res => res.json()).then((jsonObject) => {
      console.log("התמונות נמחקו בהצלחה");
      }).catch((error) => {
        console.log(" התמונות לא נמחקו" + error);
      });
    },
    openDoneDialog(item, index) {
      this.itemToComplete = item;
      this.dialogComplete = true;
      this.itemToCompleteIndex = index;
    },
    async done() {

      this.progressShowDialog = true;
      let token = localStorage.getItem("token");
      let donePirsumObj = {id_pirsum: this.itemToComplete.id_pirsum}
      let MyJSON = JSON.stringify(donePirsumObj);

      let api = this.host + "/amuta/finishPirsum"

      fetch(api, RequestOptions.request("PUT", MyJSON, token)).then(res => res.json()).then((jsonObject) => {
         this.progressShowDialog = false;
        this.showSnackBar("הפרסום הסתיים בהצלחה!", "green");
        this.dialogComplete = false
        this.itemToComplete.status_pirsum = "הסתיימו"
        let g = Object.assign(this.showPirsumim[this.itemToCompleteIndex],this.itemToComplete);
      }).catch((error) => {
         this.showSnackBar("Error on change status: " + error, "red");
        this.progressShowDialog = false;
      });
    },
    copied() {
      this.showSnackBar("הקישור הועתק!", "green");
    },
    showSnackBar(message, color) {
      this.snacbarText = message;
      this.snackbarColorBt = color;
      this.snackbar = true;
    },

    async getAmutaPirsumim(filtered) {
    this.progressShow = true;
    let token = localStorage.getItem("token");
    let MyJSON = JSON.stringify({ filtered: filtered });
    this.showPirsumim = [];
    let api = this.host + "/amuta/getAllPirsumim";

    try {
        let response = await fetch(api, RequestOptions.request("POST", MyJSON, token));
        let jsonObject = await response.json();

        for (let i = 0; i < jsonObject.length; i++) {
            const date = new Date(jsonObject[i].date_create_pirsum);
            this.fulldate = await FullDate.dateCalc(date);
            jsonObject[i].date_create_pirsum = date;
            jsonObject[i].fullDatePlusHeb = this.fulldate;
            this.showPirsumim.push(jsonObject[i]);
        }
        this.sortListByDate();
    } catch (error) {
        this.showSnackBar("Error getting pirsumim list: " + error, "red");
    } finally {
        this.progressShow = false;
    }
},


    activeColor(status) {
      if (status === "הסתיימו") {
        return "background-color: #f3f1ef;"
      }
      else return
    },
    sortListByDate() {
      // סידור המערך לפי התאריך
      this.showPirsumim.sort((a, b) => b.dateForSort - a.dateForSort)
    },
  },
  watch: {
    addedPirsumUI() {
      this.showPirsumim.push(this.addedPirsumUI);
    },
    editedPirsumUI() {
      let g = Object.assign(this.showPirsumim[this.editedpirsumUIINdex], this.editedPirsumUI);
    },
    selectActiveModel() {
      this.showPirsumim = [];
      this.getAmutaPirsumim(this.selectActiveModel);
    },
  },
  mounted() {
    this.host = process.env.VUE_APP_BASE_URL;

    this.getAmutaPirsumim("הכל");
  },
}
</script>
<style>

</style>
