<template>
    <v-dialog v-model="openMode" max-width="500px">

        <form action="" @submit.prevent="saveOrUpdate">
            <v-card>
                <v-card-title>
                    <span class="text-h5">{{ formTitle }}</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field v-model="editedItem.title" label="כותרת *" required></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field v-model="editedItem.content" label="תוכן *" required></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-select v-model="editedItem.zone" :items="items" :rules="[v => !!v || 'שדה חובה']"
                                    label="אזור" required>
                                </v-select>
                            </v-col>
                            <v-col cols="6">
                                <v-file-input chips truncate-length="15" accept="image/*" label="הוסף תמונה"
                                    v-model="picture">
                                </v-file-input>
                            </v-col>
                            <v-col cols="6">
                                <div class="d-flex">
                                    <span class="mt-5">{{ pictureText }}</span>
                                </div>
                            </v-col>
                            <div class="d-flex justify-content-center mb-3">
                                <div class="spinner-border text-danger" role="status" v-if="showSpinnerUpload">
                                    <span class="sr-only"></span>
                                </div>
                            </div>
                            <v-col cols="12">
                                <v-text-field v-model="editedItem.pickUpAddress" label="כתובת איסוף"></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field v-model="editedItem.onFinish" label="טקסט בסיום"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-switch color="green" v-model="editedItem.showPhone" label="הצגת טלפון">
                                </v-switch>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-switch color="green" v-model="editedItem.showEmail" label="הצגת אימייל">
                                </v-switch>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-switch color="green" v-model="editedItem.showWhatsapp" label="הצגת וואטסאפ">
                                </v-switch>
                            </v-col>
                            <!-- <v-col cols="12" sm="6">
                                <v-switch color="green" v-model="editedItem.srcVolentires" label="מחפשים מוביל">
                                </v-switch>
                            </v-col> -->

                        </v-row>
                        <v-row v-if="progressShow">
                            <v-col class="d-flex justify-center">
                                <v-progress-circular indeterminate color="primary"></v-progress-circular>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>

                <div class="d-flex justify-center pa-4">
                    <v-card-actions>
                        <!-- <v-spacer></v-spacer> -->
                        <v-btn color="blue darken-1" elevation="2" text @click="close">
                            ביטול
                        </v-btn>
                        <v-btn color="blue darken-1" elevation="2" text type="submit">
                            {{ formButton }}
                        </v-btn>
                    </v-card-actions>
                </div>
            </v-card>
        </form>

        <v-snackbar v-model="snackbar" :timeout="5000">
            {{ snacbarText }}
            <template v-slot:action="{ attrs }">
                <v-btn :color="snackbarColorBt" text v-bind="attrs" @click="snackbar = false">
                    Close
                </v-btn>
            </template>
        </v-snackbar>

    </v-dialog>
</template>

<script>
import RequestOptions from '../../tools/RequestOptions.js'

export default {
    props: {
        value: {
            type: Boolean,
            default: false
        },
        isNew: Boolean,
        amutObj: Object,
        defaultStObj: Object,
        pirsumEditObj: {
            type: Object,
            default: {}
        }
    },
    components: {},
    data() {
        return {
            valid: true,
            formTitle: "הוסף פרסום",
            formButton: "שמור",
            progressShow: false,
            showSpinnerUpload: false,
            newPirsumId: "",
            snackbar: false,
            snackbarColorBt: "green",
            snacbarText: "",
            editedItem: {
                title: '',
                content: "",
                pickUpAddress: "",
                onFinish: "",
                zone: "",
                picture: "",
                showPhone: true,
                showEmail: true,
                showWhatsapp: true,
                host: ""
                // srcVolentires: true,
            },
            picture: "",
            pictureText: "",
            items: [
                'ירושלים והסביבה',
                'מרכז',
                'צפון',
                'דרום',
            ],
        }
    },
    methods: {
        close() {
            this.openMode = false;
        },
        saveOrUpdate() {

            if (this.isNew) {
                this.save();
            } else {
                this.update();
            }
        },
        async update() {

            this.progressShow = true;
            let token = localStorage.getItem("token");
            let editPirsumObj = {
                id_pirsum: this.pirsumEditObj.id_pirsum, title: this.editedItem.title, content: this.editedItem.content, picture: this.editedItem.picture,
                pirsum_show_phone: this.phone1, pirsum_show_email: this.email1, pirsum_show_whatsapp: this.whatsapp1, pick_up_address: this.editedItem.pickUpAddress,
                zone: this.editedItem.zone, text_finish: this.editedItem.onFinish
            }
            let MyJSON = JSON.stringify(editPirsumObj);

            let api = this.host + "/amuta/editPirsum"

            fetch(api, RequestOptions.request("PUT", MyJSON, token)).then(res => res.json()).then((jsonObject) => {
                this.progressShow = false;
                this.close();
                this.$emit("editedPirsum", this.addEditUpdateUI, "הפרסום עודכן בהצלחה!", "green");
            }).catch((error) => {
                this.progressShow = false;
                this.$emit("editedPirsum", null, "error to edit pirsum: " + error, "red");
            });
        },
        async save() {

            this.progressShow = true;
            let token = localStorage.getItem("token");
            let addPirsumObj = {
                title: this.editedItem.title, content: this.editedItem.content, picture: this.editedItem.picture,
                pirsum_show_phone: this.phone1, pirsum_show_email: this.email1, pirsum_show_whatsapp: this.whatsapp1, pick_up_address: this.editedItem.pickUpAddress,
                zone: this.editedItem.zone, text_finish: this.editedItem.onFinish
            }
            let MyJSON = JSON.stringify(addPirsumObj);

            let api = this.host + "/amuta/addPirsum"

            fetch(api, RequestOptions.request("POST", MyJSON, token)).then(res => res.json()).then((jsonObject) => {
                this.newPirsumId = jsonObject.insertId
                this.$emit("addedPirsum", this.addEditUpdateUI, "הפרסום נוסף בהצלחה!", "green");
                this.progressShow = false;
                this.newPirsumId = "";
                this.close();
            }).catch((error) => {
                this.$emit("addedPirsum", null, "error to add pirsum: " + error, "red");
                this.progressShow = false;
            });
        },
        showSnackBar(message, color) {
            this.snacbarText = message;
            this.snackbarColorBt = color;
            this.snackbar = true;
        },
    },
    computed: {
        openMode: {
            get() {
                return this.value
            },
            set(v) {
                return this.$emit('input', v)
            }
        },
        phone1() {
            return this.editedItem.showPhone === true ? 1 : 0
        },
        email1() {
            return this.editedItem.showEmail === true ? 1 : 0
        },
        whatsapp1() {
            return this.editedItem.showWhatsapp === true ? 1 : 0
        },
        addEditUpdateUI() {
            if (!this.isNew) {
                this.newPirsumId = this.pirsumEditObj.id_pirsum;
            }
            return {
                title: this.editedItem.title,
                content: this.editedItem.content,
                city: this.amutObj.city,
                zone: this.editedItem.zone,
                status_pirsum: "פעילים",
                showPhone: this.phone1,
                showEmail: this.email1,
                showWhatsapp: this.whatsapp1,
                website: this.amutObj.website,
                logo: this.amutObj.logo,
                picture: this.editedItem.picture,
                text_finish: this.editedItem.onFinish,
                pick_up_address: this.editedItem.pickUpAddress,
                id_pirsum: this.newPirsumId
            }
        }
    },

    created() {
        this.host = process.env.VUE_APP_BASE_URL;
        this.editedItem = {};
        if (!this.isNew) {
            this.formTitle = "ערוך פרסום";
            this.formButton = "עדכן"
            this.editedItem = {
                title: this.pirsumEditObj.title,
                content: this.pirsumEditObj.content,
                pickUpAddress: this.pirsumEditObj.pick_up_address,
                onFinish: this.pirsumEditObj.text_finish,
                zone: this.pirsumEditObj.zone,
                picture: this.pirsumEditObj.picture,
                showPhone: Boolean(this.pirsumEditObj.pirsum_show_phone),
                showEmail: Boolean(this.pirsumEditObj.pirsum_show_email),
                showWhatsapp: Boolean(this.pirsumEditObj.pirsum_show_whatsapp),
            };
            this.pictureText = this.editedItem.picture.split(`com/pictures/${this.pirsumEditObj.id_pirsum}/`)[1];
        } else {
            this.formTitle = "הוסף פרסום";
            this.formButton = "שמור";
            this.editedItem = {
                showPhone: Boolean(this.defaultStObj.defaultShPhone),
                showEmail: Boolean(this.defaultStObj.defaultShEmail),
                showWhatsapp: Boolean(this.defaultStObj.defaultShWhatsapp),
            };
        }
    },

    watch: {
        picture() {

            if (this.isNew) {
                this.showSnackBar("ניתן להעלות תמונה רק לאחר שמירת הפרסום", "red");
                return
            }
            if (this.picture) {

                this.progressShow = true;

                let token = localStorage.getItem("token");
                console.log("Uploading file...");
                const api = this.host + "/upload";
                const request = new XMLHttpRequest();
                const formData = new FormData();
                formData.append("my", this.picture);
                formData.append("emailAmuta", this.amutObj.email);
                formData.append("picture_or_logo", "pictures/");
                formData.append("pirsum_id", this.pirsumEditObj.id_pirsum);
                request.open("POST", api, true);
                request.setRequestHeader("Authorization", "Bearer " + token)
                request.send(formData);

                request.onreadystatechange = () => {
                    if (request.readyState === 4 && request.status === 200) {
                        const obj = JSON.parse(request.responseText);
                        this.editedItem.picture = obj.link1;
                        this.pictureText = obj.link1.split('com/pictures/')[1];
                        this.progressShow = false;
                    }
                }
            };
            if (!this.picture) {
                if (this.isNew) {
                    this.showSnackBar("תמונה לא קיימת", "red");
                    return
                }
                this.progressShow = true;
                let token = localStorage.getItem("token");

                let MyJSON = JSON.stringify({ picturePath: this.editedItem.picture, pirsum_id: this.pirsumEditObj.id_pirsum });

                let api = this.host + "/amuta/deleteImage"

                fetch(api, RequestOptions.request("POST", MyJSON, token)).then(res => res.json()).then((jsonObject) => {
                    this.editedItem.picture = "";
                    this.progressShow = false;
                }).catch((error) => {
                    this.progressShow = false;
                });
            }
        }
    },
}
</script>

<style>

</style>
