<template>
    <div>
        <v-dialog v-model="openMode" max-width="500px">

            <v-card class="pa-4">
                <div class="text-center">
                    <v-img src="../assets/giveItIcon.png" class="my-3" contain height="100" />
                    <h2 class="indigo--text">כניסה</h2>
                </div>
                <v-form @submit.prevent="submitHandler" ref="form">
                    <v-card-text>
                        <v-text-field v-model="email" :rules="emailRules" type="email" label="אימייל"
                            placeholder="Email" prepend-inner-icon="mdi-account" required />
                        <v-text-field v-model="password" :rules="passwordRules"
                            :type="passwordShow ? 'text' : 'password'" label="סיסמה" placeholder="Password"
                            prepend-inner-icon="mdi-key" :append-icon="passwordShow ? 'mdi-eye' : 'mdi-eye-off'"
                            @click:append="passwordShow = !passwordShow" required />


                        <a @click="forgotPassword()" :rules="emailRules">שכחתי את הסיסמה</a>
                    </v-card-text>

                    <v-card-actions class="justify-center">
                        <v-btn :loading="loading" type="submit" color="indigo">
                            <span class="white--text px-8">היכנס</span>
                        </v-btn>
                    </v-card-actions>
                    <v-row v-if="progressShow">
                        <v-col class="d-flex justify-center">
                            <v-progress-circular indeterminate color="primary"></v-progress-circular>
                        </v-col>
                    </v-row>
                </v-form>
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
import RequestOptions from '../tools/RequestOptions.js'

export default {
    name: 'Login',

    props: { value: { type: Boolean, default: false } },



    data: () => ({
        loading: false,
        progressShow: false,
        passwordShow: false,
        snackbar: false,
        snackbarColorBt: "green",
        snacbarText: "",
        email: '',
        emailRules: [
            v => !!v || 'נא להזין כתובת אימייל',
            v => /.+@.+\..+/.test(v) || 'חובה להזין כתובת אימייל חוקית',
        ],
        password: '',
        passwordRules: [
            v => !!v || 'נא להזין סיסמה',
            v => (v && v.length >= 6) || 'הסיסמה חייבת להכיל 6 תווים או יותר!',
        ],
        host: ""
    }),
    methods: {
        submitHandler() {
            if (this.$refs.form.validate()) {
                this.loading = true

                let newAmutaObj = {
                    email: this.email,
                    password: this.password
                }
                let MyJSON = JSON.stringify(newAmutaObj);

                this.showPirsumim = [];
                let api = this.host + "/amuta/Login"

             fetch(api, RequestOptions.request("POST", MyJSON, "")).then(res => res.json()).then((jsonObject) => {
                    if (jsonObject === "auth failed") {
                        this.showSnackBar("שגיאת התחברות", "red");
                        this.loading = false;
                    } else {
                        this.showSnackBar("התחברת בהצלחה!", "green");
                        this.loading = false;
                        localStorage.setItem('token', jsonObject);
                        this.$emit('checkAuth');
                        setTimeout(() => {
                            this.openMode = false
                        }, 700);
                    }
                }).catch((error) => {
                        this.showSnackBar("Error get amutot list: " + error, "red");
                        setTimeout(() => {
                            this.openMode = false
                        }, 800);
                    });
            }
        },
        async forgotPassword() {

            if (this.email === "") {
                return this.$emit('show', "יש להזין כתובת אימייל לצורך האיפוס", "red");
            }
            this.progressShow = true;
            let MyJSON = JSON.stringify({ email: this.email });

            let api = this.host + "/amuta/forgotPassword"

            try {
                const answer = await fetch(api, RequestOptions.request("POST", MyJSON, ""))
                if (answer.status === 401) {
                    this.showSnackBar("שגיאה בשליחת האימייל: " + "אימייל לא קיים במערכת", "red");
                    this.progressShow = false;
                } else {
                    this.showSnackBar("אימייל לאיפוס נשלח בהצלחה ", "green");
                    this.progressShow = false;
                }
            } catch (error) {
                this.progressShow = false
                this.showSnackBar("Error sending email: " + error, "red");
            }
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
    },
    created() {
        this.host = process.env.VUE_APP_BASE_URL;
    },
};
</script>
<style>
.backgruond {
    background-image: url(../assets/bkg_login.png) !important;
    height: 300px;
    width: 100%;
    display: block;
    position: absolute;
    top: 0;
    background-size: cover;
}
</style>