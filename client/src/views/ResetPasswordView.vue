<template>
    <div class="mt-5">
  
      <form action="" @submit.prevent="update" class="container form-responsive rounded border p-4"
        style="max-width: 500px;">
        <div class="text-center border fw-bold my-4 p-4 bg-light">
          <p>
          <h4>טופס איפוס סיסמה </h4>
          </p>
        </div>
  
        <v-row>
          <v-col cols="12">
            <v-text-field v-model="editedAmuta.newPassword" label="סיסמה חדשה" :rules="[v => !!v || 'שדה חובה']" required></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field v-model="editedAmuta.againPassword" label="אימות סיסמה" :rules="[v => !!v || 'שדה חובה']" required></v-text-field>
          </v-col>
          <div class="my-5  text-center">
            <v-btn color="red lighten-1" class="ms-5" dark type="submit">
              שמור סיסמה
            </v-btn>
          </div>
  
          <div class="d-flex justify-content-center mb-3">
            <div class="spinner-border text-danger" role="status" v-if="showSpinner">
              <span class="sr-only"></span>
            </div>
          </div>
        </v-row>
      </form>
  
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
  import RequestOptions from '../tools/RequestOptions.js'

  export default {
  
    components: {
    },
    data() {
      return {
        showSpinner: false,
        snackbar: false,
        snackbarColorBt: "green",
        snacbarText: "",
        host:"",
        editedAmuta: {
            newPassword: "",
            againPassword: "",
        },
      }
    },
    methods: {
    
      async update() {
  
        if (this.editedAmuta.newPassword.length <6 || this.editedAmuta.againPassword.length <6) {
            this.showSnackBar("הסימה חייבת להכיל 6 תווים לפחות","red");
            return
        }
        if (this.editedAmuta.newPassword !== this.editedAmuta.againPassword) {
            this.showSnackBar("הסיסמאות אינם תואמות","red");
            return
        }
        this.showSpinner = true;
        let MyJSON = JSON.stringify({newPassword: this.editedAmuta.newPassword});
  
        let api = this.host + "/amuta/resetPassword"
        let token = this.$route.params.token
        
        fetch(api, RequestOptions.request("POST", MyJSON,token)).then(res =>{
          if (res.status == 400 || res.status == 401) {
            this.showSnackBar("שינוי הסיסמה נכשל","red");
            this.showSpinner = false;
            return null
          }
        return  res.json()
        } ).then((jsonObject) => {
          if (jsonObject !== null) {
            this.showSpinner = false;
            this.showSnackBar("הסיסמה שונתה בהצלחה","green");
            setTimeout(() => {
              this.$router.replace({ path: '/' })
            }, 700);

          }
        }).catch((error) => {
             this.showSnackBar("Error on update details: " + error, "red");
             this.showSpinner = false;
        });
      },
      showSnackBar(message, color) {
        this.snacbarText = message;
        this.snackbarColorBt = color;
        this.snackbar = true;
      },
    },
    created() {
      this.host = process.env.VUE_APP_BASE_URL;
    },
  }
  </script>
  <style>
  
  </style>
    