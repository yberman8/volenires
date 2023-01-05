<template>
  <v-container mt-5 mb-5 fluid>

    <v-row class="d-flex justify-center">
      <v-col cols='12' lg='10'>
        <v-data-table id="table1" :headers="headers" :items="desserts" sort-by="name" class="elevation-1">
          <template v-slot:top>

            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>

            <v-dialog v-model="dialog" max-width="800px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn small color="black" dark class="mb-2 ms-2">
                  <v-icon dark @click="downloadExcel()">
                    mdi-file-download
                  </v-icon>
                </v-btn>
                <v-btn small color="black" dark class="mb-2 ms-2" v-bind="attrs" v-on="on">
                  <v-icon dark>
                    mdi-plus
                  </v-icon>
                  חדש
                </v-btn>

              </template>
              <!-- חלון הוספה או עריכה -->
              <v-card>
                <v-card-title>
                  <span class="text-h5">{{ formTitle }}</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6">
                        <v-text-field v-model="editedItem.name" label="שם *"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field v-model="editedItem.email" label="אימייל *"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field v-model="editedItem.phone" label="טלפון"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field v-model="editedItem.notes" label="הערות"></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row v-if="progressShow">
                      <v-col class="d-flex justify-center">
                        <v-progress-circular indeterminate color="primary"></v-progress-circular>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">
                    ביטול
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="save">
                    שמור
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="text-h5">האם אתה בטוח שברצונך למחוק את העמותה?</v-card-title>
                <v-row v-if="progressShow">
                  <v-col class="d-flex justify-center">
                    <v-progress-circular indeterminate color="primary"></v-progress-circular>
                  </v-col>
                </v-row>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDelete">ביטול</v-btn>
                  <v-btn color="blue darken-1" text @click="deleteItemConfirm">אישור</v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </template>

          <template v-slot:item.status="{ item }">
            <v-switch color="red" v-model="item.status" @click="enableOrdisable(item.status, item.id)"
              :label="item.status === 1 ? 'פעיל' : 'מושבת'">
            </v-switch>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon medium class="me-3" @click="show(item)">
              mdi-eye
            </v-icon>
            <v-icon medium class="mr-2 me-3" @click="editItem(item)">
              mdi-pencil
            </v-icon>
            <v-icon medium class="mr-2 me-3" @click="changeAmutaPassword(item)">
              mdi-account-key
            </v-icon>
            <v-icon medium class="me-3" @click="deleteItem(item)">
              mdi-delete
            </v-icon>
          </template>
        
          <template v-slot:no-data>
            <v-row v-if="progressShow" class="my-5">
              <v-col class="d-flex justify-center">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
              </v-col>
            </v-row>
            <v-btn color="primary" @click="initialize">
              Reset
            </v-btn>
          </template>
        </v-data-table>

      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar" :timeout="5000">
      {{ snacbarText }}
      <template v-slot:action="{ attrs }">
        <v-btn :color="snackbarColorBt" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>

  </v-container>
</template>

<script>
import TableToExcel from "@linways/table-to-excel";
import RequestOptions from '../../tools/RequestOptions.js'

export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    progressShow: false,
    snackbar: false,
    snackbarColorBt: "green",
    snacbarText: "",
    amutaToDelete: "",
    switch1: [],
    headers: [
      {
        text: 'שם',
        align: 'start',
        sortable: true,
        value: 'name',
      },
      { text: 'אימייל', value: 'email' },
      { text: 'טלפון', value: 'phone' },
      { text: 'עיר', value: 'city' },
      { text: 'שם א.ק', value: 'contact_name' },
      { text: 'טלפון א.ק', value: 'contact_phone' },
      { text: 'אימייל א.ק', value: 'contact_email' },
      { text: 'הערות', value: 'notes' },
      { text: 'פרסומים', value: 'num_of_pirsumim' },
      { text: 'סטטוס', value: 'status' },
      { text: 'פעולות', value: 'actions', sortable: false },

    ],
    desserts: [],
    editedIndex: -1,
    fullItemEdit: {},
    editedItem: {
      name: '',
      email: "",
      phone: "",
      notes: "",
    },
    defaultItem: {
      name: '',
      email: "",
      phone: "",
      notes: "",
    },
    host:""
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'עמותה חדשה' : 'ערוך עמותה'
    },
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
  },

  created() {
    this.host = process.env.VUE_APP_BASE_URL;

    this.initialize()
  },

  methods: {
    async enableOrdisable(statusCurrent, id) {

      let message = "הסוכן הושבת בהצלחה";
      let messageColor = "red";
      let status = 0;

      if (statusCurrent === true) {
        message = "הסוכן הופעל בהצלחה";
        status = 1
        messageColor = "green"
      }

      let editAmutastatus = { id: id, status: status }
      let MyJSON = JSON.stringify(editAmutastatus);
      let token = localStorage.getItem("token");

      let api = this.host + "/admin/enableOrDisableAmuta"

      fetch(api, RequestOptions.request("PUT", MyJSON, token)).then(res => res.json()).then((jsonObject) => {
        this.showSnackBar(message, messageColor);
        this.progressShow = false
      }).catch((error) => {
        this.progressShow = false;
        this.showSnackBar("שגיאה בשינוי סטטוס עמותה: " + error, "red");
      });

    },
    async initialize() {

      this.desserts = [];
      this.progressShow = true;
      let token = localStorage.getItem("token");

      let api = this.host + "/admin/getAllAmutot";

      fetch(api, RequestOptions.request("POST", "", token)).then(res => res.json()).then((jsonObject) => {
        for (let i = 0; i < jsonObject.length; i++) {
          jsonObject[i].num_of_pirsumim ="0";
          this.desserts.push(jsonObject[i]);
        }
        this.progressShow = false
        this.getNumOfPirsumim();
      }).catch((error) => {
        this.progressShow = false;
        this.showSnackBar("Error get amutot list: " + error, "red");
      });

    },
    getNumOfPirsumim() {
      let token = localStorage.getItem("token");
      let api = this.host + "/admin/getNumOfPirsumim";

      fetch(api, RequestOptions.request("POST", "", token)).then(res => res.json()).then((jsonObject) => {
        for (let i = 0; i < jsonObject.length; i++) {
          for (let e = 0; e < this.desserts.length; e++) {
             if (jsonObject[i].amuta_id === this.desserts[e].id) {
               this.desserts[e].num_of_pirsumim = jsonObject[i].count_of_pirsumim
             }            
          }
        }
      }).catch((error) => {
        console.log(error);
      });
    },
    changeAmutaPassword(item){
      this.$router.push({ name: 'resetPasswordAdmin', params: { amutObj: item } })
    },
    downloadExcel() {
      TableToExcel.convert(document.getElementById("table1"), {
        name: "amutotList.xlsx",
        sheet: {
          name: "Sheet 1"
        }
      });

    },
    editItem(item) {
      this.fullItemEdit = item;
      this.editedIndex = this.desserts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      this.amutaToDelete = item.id;
      this.dialogDelete = true
    },
    show(item) {
      this.$router.push({ name: 'editPirsumimAdmih', params: { amutObj: item } });
    },
    async deleteItemConfirm() {

      this.progressShow = true;
      let deleteAmutaID = { id: this.amutaToDelete }
      let MyJSON = JSON.stringify(deleteAmutaID);
      let token = localStorage.getItem("token");

      let api = this.host + "/admin/deleteAmuta"

      fetch(api, RequestOptions.request("DELETE", MyJSON, token)).then(res => res.json()).then((jsonObject) => {
        if (jsonObject.code === "ER_ROW_IS_REFERENCED_2") {
          this.showSnackBar("שגיאה במחיקת עמותה: " + "יש פרסומים השייכים לעמותה זו, יש למחוק את הפרסומים ", "red");
          this.progressShow = false
          return
        }
        this.dialogDelete = false
        this.initialize();
        this.showSnackBar("העמותה נמחקה בהצלחה", "green");
        this.progressShow = false
      }).catch((error) => {
        this.progressShow = false;
        this.showSnackBar("שגיאה במחיקת עמותה: " + error, "red");
      });
    },

    close() {
      this.progressShow = false;
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    closeDelete() {
      this.dialogDelete = false;
      this.progressShow = false;
    },

    async save() {

      this.progressShow = true;

      if (this.editedIndex > -1) {
        //  בעריכת עמותה

        let editAmutaObj = { id: this.fullItemEdit.id, name: this.editedItem.name, email: this.editedItem.email, phone: this.editedItem.phone, notes: this.editedItem.notes }
        let MyJSON = JSON.stringify(editAmutaObj);
        let token = localStorage.getItem("token");

        let api = this.host + "/admin/editAmuta"

        fetch(api, RequestOptions.request("PUT", MyJSON, token)).then(res => res.json()).then((jsonObject) => {
          if (jsonObject.code === "ER_DUP_ENTRY") {
            this.showSnackBar("אירעה שגיאה, כתובת אימייל בשימוש", "red");
            this.progressShow = false
            return
          }
          if (this.fullItemEdit.email !== this.editedItem.email) {
            this.renamePictureFolder(this.fullItemEdit.email,this.editedItem.email);
          }
          this.close();
          this.initialize();
          this.showSnackBar("העמותה נערכה בהצלחה", "green");

          this.progressShow = false
        }).catch((error) => {
          this.progressShow = false;
          this.showSnackBar("שגיאה בהוספת עמותה: " + error, "red");
        });

      } else {
        //  ביצירת עמותה חדשה

        if (this.editedItem.email === "" || this.editedItem.name === "" || this.editedItem.phone === "") {
          this.progressShow = false;
          this.showSnackBar("אחד מהנתונים שהוזנו שגוי", "red");
          return
        }

        let randomPassword = this.getRandomPassword();
        let token = localStorage.getItem("token");


        let newAmutaObj = {
          name: this.editedItem.name,
          email: this.editedItem.email,
          phone: this.editedItem.phone,
          password: randomPassword,
          notes: this.editedItem.notes,
        }
        let MyJSON = JSON.stringify(newAmutaObj);

        let api = this.host + "/admin/createAmuta"

        fetch(api, RequestOptions.request("POST", MyJSON, token)).then(res => res.json()).then((jsonObject) => {
          this.close();
          this.initialize();
          this.showSnackBar("העמותה נוספה בהצלחה", "green");
          this.progressShow = false
        }).catch((error) => {
          this.progressShow = false;
          this.showSnackBar("שגיאה בהוספת עמותה: " + error, "red");
        });

      }

    },
    renamePictureFolder(oldMail,newMail){
        let MyJSON = JSON.stringify({id: this.fullItemEdit.id, oldMail: oldMail, newMail: newMail});
        let token = localStorage.getItem("token");

        let api = this.host + "/admin/renameFolderAmuta"

        fetch(api, RequestOptions.request("POST", MyJSON, token)).then(res => res.json()).then((jsonObject) => {
        }).catch((error) => {
          this.showSnackBar("שגיאה בשינוי תיקיית עמותה: " + error, "red");
        });

    },

    showSnackBar(message, color) {
      this.snacbarText = message;
      this.snackbarColorBt = color;
      this.snackbar = true;
    },
    getRandomPassword() {
      let minrand = 10000000;
      let maxrand = 99999999;
      let numrund = Math.random();
      let random = Math.floor(numrund * (maxrand - minrand)) + minrand;
      return random;
    },
  },

}
</script>

 