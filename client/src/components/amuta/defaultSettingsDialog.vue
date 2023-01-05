<template>
    <v-dialog v-model="openMode" max-width="500px">

        <form action="" @submit.prevent="UpdateDefault">
            <v-card>
                <v-card-title>
                    <span class="text-h5">{{ "ברירת מחדל" }}</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12" sm="6">
                                <v-switch color="green" v-model="defaultItem.showPhone" label="הצגת טלפון">
                                </v-switch>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-switch color="green" v-model="defaultItem.showEmail" label="הצגת אימייל">
                                </v-switch>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-switch color="green" v-model="defaultItem.showWhatsapp" label="הצגת וואטסאפ">
                                </v-switch>
                            </v-col>

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
                            עדכן
                        </v-btn>
                    </v-card-actions>
                </div>
            </v-card>
        </form>

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
        defaultObj: {
            type: Object,
            default: {}
        }
    },
    components: {},
    data() {
        return {
            progressShow: false,
            defaultItem: {
                showPhone: true,
                showEmail: true,
                showWhatsapp: true,
                host:""
            },
        }
    },
    methods: {
        close() {
            this.openMode = false;
        },
        async UpdateDefault() {

            this.progressShow = true;

            let token = localStorage.getItem("token");

            
            let editDefaultsObj = {
                showEmail: this.defaultItem.showEmail,
                showWhatsapp: this.defaultItem.showWhatsapp,
                showPhone: this.defaultItem.showPhone,
            }

            let MyJSON = JSON.stringify(editDefaultsObj);

            let api = this.host + "/amuta/updateDefaults"

            fetch(api, RequestOptions.request("PUT", MyJSON, token)).then(res => res.json()).then((jsonObject) => {
                this.progressShow = false;
                this.close();
                this.$emit("updated", "הפרטים עודכנו בהצלחה!", "green", this.defaultItem);
            }).catch((error) => {
                this.progressShow = false;
                this.$emit("updated", "error to edit דsettings: " + error, "red");
            });
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
    },
    created() {
        this.host = process.env.VUE_APP_BASE_URL;

        this.defaultItem.showEmail = this.defaultObj.defaultShEmail;
        this.defaultItem.showPhone = this.defaultObj.defaultShPhone;
        this.defaultItem.showWhatsapp = this.defaultObj.defaultShWhatsapp;
        if (this.defaultItem.showEmail === 0) {
            this.defaultItem.showEmail = false;
        }
        if (this.defaultItem.showPhone === 0) {
            this.defaultItem.showPhone = false;
        }
        if (this.defaultItem.showWhatsapp === 0) {
            this.defaultItem.showWhatsapp = false;
        }
    },

}
</script>

<style>

</style>
