<template>
  <div>

    <v-row class="mt-10 d-flex justify-center">

      <v-col cols="6" sm="3" style="max-width: 200px;">
        <v-select :items="selectZone" v-model="selectZoneModel" label="סנן לפי אזור"></v-select>
      </v-col>

      <v-col cols="6" sm="3" style="max-width: 200px;">
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

        <v-card class="mx-auto mb-5 mt-5" max-width="340px" :style="activeColor(item.status_pirsum)">

          <v-img class="white--text align-end subheading" height="150px" :src="item.logo" contain>
          </v-img>

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
              <div>{{ " הסתיים!" }}</div>
              <div>{{ item.text_finish }} </div>
            </div>
          </v-card-title>

          <v-card-subtitle class="pb-5 font-weight-regular">
            <span v-if="item.status_pirsum === 'פעילים'">{{ item.content }} </span>
            <span v-else class="d-flex justify-center"> <img src="../../assets/icons/champagne-bottle.svg" alt="שמפניה"
                class="w-25"> </span>
         <v-img class="white--text align-end subheading" v-if="item.status_pirsum === 'פעילים' && item.picture !== ''" height="100px" :src="item.picture" contain></v-img>

          </v-card-subtitle>
          <v-card-subtitle v-if="item.status_pirsum === 'פעילים'" class="pb-0 font-weight-regular">
            {{ "כתובת איסוף: " + item.pick_up_address }}
          </v-card-subtitle>
          <v-card-actions v-if="item.status_pirsum === 'פעילים'">

            <v-btn icon @click="share(item)">
              <v-icon>mdi-share </v-icon>
            </v-btn>

            <v-btn icon :href="item.website" target="_blank" class="me-5">
              <v-icon>mdi-web </v-icon>
            </v-btn>

            <v-spacer></v-spacer>

            <v-btn icon class="ms-5" v-if="item.pirsum_show_phone === 1">
              <a :href='("tel:" + item.phone)' style="text-decoration: none;">
                <v-icon>mdi-phone </v-icon>
              </a>
            </v-btn>

            <v-btn icon class="ms-5" v-if="item.pirsum_show_email === 1">
              <a :href='"mailto:" + item.email + "?subject="' style="text-decoration: none;">
                <v-icon>mdi-email </v-icon>
              </a>
            </v-btn>

            <v-btn icon color="green" :href="'https://wa.me/972' + item.whatsapp + '?text=' + 'היי ראיתי את הפרסום'
            + ' ' + item.title + ' בחיבורים'" target="_blank" v-if="item.pirsum_show_whatsapp === 1">
              <v-icon>mdi-whatsapp </v-icon>
            </v-btn>

          </v-card-actions>

        </v-card>

      </v-col>
    </v-row>
    <share-dialog v-model="dialogShare" v-if="dialogShare" @copied="copied" :itemObj="shareItem"></share-dialog>

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
import ShareDialog from './ShareDialog.vue'
import RequestOptions from '../../tools/RequestOptions.js'
import FullDate from '../../tools/FullDate.js'

export default {
  components: {
    ShareDialog,
  },
  data() {
    return {
      selectZone: ["הכל", 'מרכז', 'ירושלים והסביבה', 'צפון', 'דרום'],
      selectActive: ["הכל", 'פעילים', 'הסתיימו'],
      selectZoneModel: "הכל",
      selectActiveModel: "הכל",
      progressShow: false,
      dialogShare: false,
      snackbar: false,
      snackbarColorBt: "green",
      snacbarText: "",
      showPirsumim: [],
      shareItem: {},
      fulldate: "",
      host:""
    }
  },
  methods: {
    share(item) {
      this.shareItem = item,
        this.dialogShare = true
    },
    copied(copyLink) {
      navigator.clipboard.writeText(copyLink);
      this.showSnackBar("הקישור הועתק!", "green")
    },
    showSnackBar(message, color) {
      this.snacbarText = message;
      this.snackbarColorBt = color;
      this.snackbar = true;
    },
    // פונקציית חיפוש פרסומות וקריאה לקולבאק שמחפש לפי סינון
    getPirsumimList() {

      this.progressShow = true

      this.showPirsumim = [];
      let api = this.host + "/home/getAllPirsumim"

      fetch(api ).then(res => res.json()).then(async (jsonObject) => {
        for (let i = 0; i < jsonObject.length; i++) {
          const date = new Date(jsonObject[i].date_create_pirsum);
          this.fulldate = await FullDate.dateCalc(date)
          jsonObject[i].date_create_pirsum = date;
          jsonObject[i].fullDatePlusHeb = this.fulldate;
          this.showPirsumim.push(jsonObject[i]);
        }
      }).then(() => {
        this.progressShow = false;
        this.sortListByDate();
      }).catch((error) => {
        this.progressShow = false;
        this.showSnackBar("Error get amutot list: " + error, "red");
      });

    },
   
    // פונקציית קולבאק במידה ובחרו סינון 
    async getPirsumimListFilterd() {
     
      this.showPirsumim = [];
      let objFiltered = {status: this.selectActiveModel,zone: this.selectZoneModel}
        let MyJSON = JSON.stringify(objFiltered);

        let api = this.host + "/home/getPirsumimFiltered"

        fetch(api, RequestOptions.request("POST", MyJSON,"")).then(res => res.json()).then(async (jsonObject) => {
          for (let i = 0; i < jsonObject.length; i++) {
          const date = new Date(jsonObject[i].date_create_pirsum);
          this.fulldate = await FullDate.dateCalc(date)
          jsonObject[i].date_create_pirsum = date;
          jsonObject[i].fullDatePlusHeb = this.fulldate;
          this.showPirsumim.push(jsonObject[i]);
        }
        }).then(() => {
        this.progressShow = false;
        this.sortListByDate();
      }).catch((error) => {
        this.progressShow = false;
        this.showSnackBar("Error get amutot list: " + error, "red");
      });

    },
    activeColor(status) {
      if (status === "הסתיימו") {
        return "background-color: #f3f1ef;"
      }
      else return
    },
    sortListByDate() {
      // סידור המערך לפי התאריך
      this.showPirsumim.sort((a, b) => b.date_create_pirsum - a.date_create_pirsum)
    },
  },

  watch: {
    selectZoneModel() {
      this.getPirsumimListFilterd();
    },
    selectActiveModel() {
      this.getPirsumimListFilterd();
    },
  },
  mounted() {
    this.host = process.env.VUE_APP_BASE_URL;
    this.getPirsumimList();
  },
}
</script>
<style>

</style>
  