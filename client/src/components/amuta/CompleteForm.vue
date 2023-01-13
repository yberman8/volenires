<template>
  <div>

    <form action="" @submit.prevent="update" class="container form-responsive rounded border p-4"
      style="max-width: 700px;">
      <div class="text-center border fw-bold my-4 p-4 bg-light">
        <p>
        <h4>טופס השלמת פרטים</h4>
        </p>
      </div>
      <div class="d-flex justify-content-center mb-3"><b>פרטי עמותה</b></div>

      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field v-model="editedAmuta.name" label="שם" :rules="[v => !!v || 'שדה חובה']" required></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field v-model="editedAmuta.website" label="אתר" :rules="[v => !!v || 'שדה חובה']" required></v-text-field>
        </v-col>

        <v-col cols="12" sm="6">
          <v-text-field v-model="editedAmuta.phone" label="טלפון עמותה" :rules="[v => !!v || 'שדה חובה']" required></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field v-model="editedAmuta.whatsapp" label="וואטסאפ" :rules="[v => !!v || 'שדה חובה']" required></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field v-model="editedAmuta.city" label="עיר" :rules="[v => !!v || 'שדה חובה']" required></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field v-model="editedAmuta.email" label="אימייל" :rules="[v => !!v || 'שדה חובה']" required></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-file-input chips truncate-length="15" accept="image/*" label="לוגו" v-model="logo">
          </v-file-input>
        </v-col>
        <v-col cols="6">
          <div class="d-flex">
            <span class="mt-5">{{logoText}}</span>
          </div>
        </v-col>
        <div class="d-flex justify-content-center mb-3">
          <div class="spinner-border text-danger" role="status" v-if="showSpinnerUpload">
            <span class="sr-only"></span>
          </div>
        </div>
        <v-col cols="12">
          <v-textarea outlined name="input-7-1" label="אודות" value="" hint="אודות" v-model="editedAmuta.about" required :rules="[v => !!v || 'שדה חובה']"></v-textarea>
        </v-col>

        <div class="d-flex justify-content-center mb-3 mt-5"><b>פרטי איש קשר</b></div>

        <v-col cols="12" sm="6">
          <v-text-field v-model="editedAmuta.nameContact" label="שם" :rules="[v => !!v || 'שדה חובה']" required></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field v-model="editedAmuta.phoneContact" label="טלפון" :rules="[v => !!v || 'שדה חובה']" required></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field v-model="editedAmuta.emailContact" label="אימייל" :rules="[v => !!v || 'שדה חובה']" required></v-text-field>
        </v-col>
        <div class="my-5  text-center">
          <v-btn color="red lighten-1"  dark  @click="cancle">
            ביטול
          </v-btn>
          <v-btn color="red lighten-1" class="ms-5" dark type="submit">
            עדכן
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
import RequestOptions from '../../tools/RequestOptions.js'

export default {
  props: { details: { type: Object, default: {} } },

  components: {
  },
  data() {
    return {
      showSpinner: false,
      showSpinnerUpload: false,
      snackbar: false,
      snackbarColorBt: "green",
      snacbarText: "",

      editedAmuta: {
        name: "",
        email: "",
        phone: "",
        status: "",
        notes: "",
        nameContact: "",
        phoneContact: "",
        emailContact: "",
        logo: "",
        about: "",
        website: "",
        whatsapp: "",
        city: "",
        uid: ""
      },
      logo:"",
      logoText:"",
      host:""
    }
  },
  methods: {
    fillForm() {
      this.editedAmuta.uid = this.details.id
      this.editedAmuta.name = this.details.name
      this.editedAmuta.email = this.details.email
      this.editedAmuta.phone = this.details.phone
      this.editedAmuta.status = this.details.status
      this.editedAmuta.notes = this.details.notes
      this.editedAmuta.nameContact = this.details.contact_name
      this.editedAmuta.phoneContact = this.details.contact_phone
      this.editedAmuta.emailContact = this.details.contact_email
      this.editedAmuta.logo = this.details.logo
      this.editedAmuta.pirsum = this.details.pirsum
      this.editedAmuta.about = this.details.about
      this.editedAmuta.website = this.details.website
      this.editedAmuta.whatsapp = this.details.whatsapp
      this.editedAmuta.city = this.details.city
      this.logoText = this.editedAmuta.logo.split('com/logo/')[1];
    },
    async update() {

      if (!this.logoText) {
        this.showSnackBar("יש להעלות תמונת לוגו", "red")
        return
      }
      if (!this.editedAmuta.website.includes("http://") && !this.editedAmuta.website.includes("https://")) {
        this.showSnackBar("כתובת האתר אינה תקינה", "red")
        return
      }
      this.showSpinner = true;
      let token = localStorage.getItem("token");
      let editAmutaObj = {
        id: this.details.id,
        about: this.editedAmuta.about,
        city: this.editedAmuta.city,
        email: this.editedAmuta.email,
        logo: this.editedAmuta.logo,
        name: this.editedAmuta.name,
        contact_name: this.editedAmuta.nameContact,
        phone: this.editedAmuta.phone,
        contact_phone: this.editedAmuta.phoneContact,
        contact_email: this.editedAmuta.emailContact,
        website: this.editedAmuta.website,
        whatsapp: this.editedAmuta.whatsapp,
      }

      let MyJSON = JSON.stringify(editAmutaObj);

      let api = this.host + "/amuta/updateDetails"
      try {
        let response = await fetch(api, RequestOptions.request("PUT", MyJSON, token));

        if (response.status === 400) {
            this.showSnackBar("Invalid request", "red");
            return;
        }
        let jsonObject = await response.json();
        if (jsonObject !== null) {
        if (this.editedAmuta.email !== this.details.email) {
            this.renamePictureFolder(this.details.email, this.editedAmuta.email);
        }
        this.$emit("Updated");
      }
    } catch (error) {
        this.showSnackBar("Error updating details: " + error, "red");
    } finally {
        this.showSpinner = false;
    }
    },
    renamePictureFolder(oldMail,newMail){
        let MyJSON = JSON.stringify({oldMail: oldMail, newMail: newMail});
        let token = localStorage.getItem("token");
        let api = this.host + "/amuta/renameFolderAmuta"
        fetch(api, RequestOptions.request("POST", MyJSON, token)).then(res => res.json()).then((jsonObject) => {
        }).catch((error) => {
          this.showSnackBar("שגיאה בשינוי תיקיית עמותה: " + error, "red");
        });

    },
    cancle(){
      this.$emit("Canceled");
    },
    showSnackBar(message, color) {
      this.snacbarText = message;
      this.snackbarColorBt = color;
      this.snackbar = true;
    },
  },
  watch: {
    details() {
      this.fillForm();
    },
    logo(){

      if (this.logo) {

        this.showSpinnerUpload = true

        let token = localStorage.getItem("token");
            console.log("Uploading file...");
            const api = this.host + "/upload";
            const request = new XMLHttpRequest();
            const formData = new FormData();
            formData.append("my", this.logo);
            formData.append("emailAmuta", this.editedAmuta.email);
            formData.append("picture_or_logo", "logo/");
            request.open("POST", api, true);
            request.setRequestHeader("Authorization", "Bearer " + token)
            request.send(formData);

            request.onreadystatechange = () => {
                if (request.readyState === 4 && request.status === 200) {
                  const obj = JSON.parse(request.responseText);
                  this.editedAmuta.logo = obj.link1;
                  this.logoText = obj.link1.split('com/logo/')[1];
                  this.showSpinnerUpload = false
                }
            };

          }
    }

    
  },
  created() {
    this.host = process.env.VUE_APP_BASE_URL;

    this.fillForm();
  },
}
</script>
<style>

</style>
  