<template>
    <div class="home">

        <nav-bar @login="() => dialogLogin = true" :ifAuth="ifAuth" :uid="uid" :isAdmin="isAdmin" @checkAuth="checkAuth"></nav-bar>
        
        <login-dialog v-model="dialogLogin" v-if="dialogLogin" @show="showSnackBar" @checkAuth="checkAuth"></login-dialog>

        <v-container class="mb-15 mt-15" style="max-width: 1360px;">

            <v-row v-if="progressShow" class="mb-5">
                <v-col class="d-flex justify-center">
                    <v-progress-circular indeterminate color="primary"></v-progress-circular>
                </v-col>
            </v-row>

            <v-card class="mx-auto" max-width="600px" v-if="pirsumExsit">

                <v-img class="white--text align-end subheading" height="200px" :src="item.logo" contain>
                </v-img>

                <v-card-subtitle class="pb-0 d-flex">
                    <div>
                        {{ item.fullDatePlusHeb }}
                    </div>
                    <v-spacer></v-spacer>
                    <div>{{ item.city }}</div>

                </v-card-subtitle>

                <v-card-title class="pt-0">
                    {{ item.title }}
                </v-card-title>

                <v-card-subtitle class="pb-0 font-weight-regular">
                    {{ item.content }}
                    <v-img class="white--text align-end subheading" v-if="item.status_pirsum === 'פעילים' && item.picture !== ''" height="200px" :src="item.picture" contain></v-img>

                </v-card-subtitle>
                <v-card-subtitle class="pb-0 font-weight-regular">
                    {{ ("כתובת איסוף: " + item.pick_up_address) }}
                </v-card-subtitle>
                <v-card-actions>

                    <v-btn icon @click="share()">
                        <v-icon>mdi-share </v-icon>
                    </v-btn>

                    <v-btn icon :href="item.website" target="_blank" class="me-5">
                        <v-icon>mdi-web </v-icon>
                    </v-btn>

                    <v-spacer></v-spacer>

                    <v-btn icon class="ms-5">
                        <a :href='"tel:" + item.phone' v-if="item.phone" style="text-decoration: none;">
                            <v-icon>mdi-phone </v-icon>
                        </a>
                    </v-btn>

                    <v-btn icon class="ms-5">
                        <a :href='"mailto:" + item.email + "?subject="' v-if="item.email"
                            style="text-decoration: none;">
                            <v-icon>mdi-email </v-icon>
                        </a>
                    </v-btn>


                    <v-btn icon color="green" :href="'https://wa.me/' + item.whatsapp" target="_blank"
                        v-if="item.whatsapp">
                        <v-icon>mdi-whatsapp </v-icon>
                    </v-btn>

                </v-card-actions>

            </v-card>

            <div v-if="pirsumExsit == false" class="d-flex justify-center display-3">
                <span>שגיאה! לא נמצא פרסום</span>
            </div>

        </v-container>

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
import NavBar from '../components/NavBar'
import FooterNav from '../components/Footer'
import LoginDialog from '../components/LoginDialog'
import ShareDialog from '../components/home/ShareDialog'
import RequestOptions from '../tools/RequestOptions.js'
import FullDate from '../tools/FullDate.js'
import CheckAuth from '../tools/CheckAuthFunc.js'

export default {
    name: 'singlePirsum',
    props: {
    },
    components: {
        NavBar,
        ShareDialog,
        LoginDialog,
        FooterNav,
    },
    data() {
        return {
            progressShow: false,
            dialogLogin: false,
            dialogShare: false,
            pirsumExsit: true,
            snackbar: false,
            snackbarColorBt: "green",
            snacbarText: "",
            ifAuth: false,
            isAdmin: false,
            uid: "",
            item: {},
            shareItem: {},
            host:""
        }
    },
    methods: {
        share() {
            this.shareItem = this.item,
                this.dialogShare = true;
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
        async getSinglePirsum() {

            this.progressShow = true
            this.item = {};
            let token = localStorage.getItem("token");

            let MyJSON = JSON.stringify({ pirsum_id: this.$route.params.id });
              
            let api = this.host + "/home/getSinglePirsumim"

            fetch(api, RequestOptions.request("POST", MyJSON, token)).then(res => res.json()).then(async (jsonObject) => {
                const date = new Date(jsonObject[0].date_create_pirsum);
                this.fulldate = await FullDate.dateCalc(date)
                jsonObject[0].date_create_pirsum = date;
                jsonObject[0].fullDatePlusHeb = this.fulldate;
                this.item = jsonObject[0];
            }).then(() => {
                this.progressShow = false;
                this.pirsumExsit = true;
            }).catch((error) => {
                this.progressShow = false;
                this.pirsumExsit = false;
            });
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
         
            let api = host + "/home/checkIfAdmin"

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
        this.host = process.env.VUE_APP_BASE_URL;
        this.checkAuth();
        this.getSinglePirsum();
    },

}
</script>
<style>

</style>
  