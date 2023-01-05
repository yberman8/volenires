<template>

    <v-dialog v-model="openMode" max-width="500px" overflow-hidden>

        <v-card>

            <v-card-title class="text-h5 d-flex justify-space-between">
                <div>
                </div>
                <div>
                    שיתוף
                </div>
                <div>
                    <button type="button" class="btn-close" @click="close()"></button>
                </div>
            </v-card-title>

            <v-card-text class="text--primary">
                <div>שתף קישור באמצעות: </div>
            </v-card-text>
            <v-card-actions class="d-flex justify-center">

                <v-btn icon class="border border-2" color="green darken-2" x-large @click="shareWemail(itemObj)">
                    <v-icon>mdi-email</v-icon>
                </v-btn>

                <v-btn icon class="border border-2" x-large @click="shareWtelegram(itemObj)">
                    <v-img src="../../assets/icons/telegram.svg" />
                </v-btn>
                <v-btn icon class="border border-2" color="blue darken-2" x-large @click="shareWsms(itemObj)">
                    <v-icon>mdi-message-processing</v-icon>
                </v-btn>

                <v-btn icon class="border border-2" color="green" x-large :href="'https://wa.me/?text=' + forwardMessage"
                    target="_blank">
                    <v-icon>mdi-whatsapp</v-icon>
                </v-btn>
            </v-card-actions>

            <v-card-text class="text--primary ms-5 pa-0">
                <div>או העתק קישור</div>
            </v-card-text>

          
            <v-row class="pa-4" >
                <v-col cols="12" sm="8" class="d-flex justify-sm-end blockE">
                    <v-icon>mdi-link-variant</v-icon>
                <input type="text" max-width="250px" :value="getCurrentURL" class="border border-1 rounded p-2 ms-2">
                </v-col>
                <v-col cols="12" sm="4" class="blockE">
                    <v-btn depressed color="primary" class="copyBt"
                    @click="copied">
                    העתק
                </v-btn>  
                </v-col>
            </v-row>

            <!-- <div class="pa-4 d-sm-flex justify-center">
                <v-icon>mdi-link-variant</v-icon>
                <input type="text" max-width="250px" :value="getCurrentURL" class="border border-1 rounded p-2 ms-2">
                <v-btn depressed color="primary" class="ms-3 copyBt"
                    @click="copied">
                    העתק
                </v-btn>
            </div> -->
        </v-card>

    </v-dialog>

</template>
  
<script>

export default {
    props: { value: { type: Boolean, default: false }, itemObj: Object },
    components: {
    },
    data() {
        return {
        }
    },
    methods: {
        close() {
            this.openMode = false;
        },
        copied() {
            this.$emit('copied', this.getCurrentURL);
        },
        shareWemail() {

            window.open(`mailto:?subject=&body=${this.forwardMessage}`);

        },
        shareWtelegram() {

            window.open(`tg://msg_url?url=&text=${this.forwardMessage}`);

        },
        shareWsms() {

            window.open(`sms://?body=${this.forwardMessage}`, '_self')

        },
        dateSimple(date_create) {
      // קבלת תאריך לועזי
      let today = new Date(date_create);
      let dd = String(today.getDate()).padStart(2, '0');
      let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      let yyyy = today.getFullYear();
      today = dd + '/' + mm + '/' + yyyy;  
      return today;
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
        getCurrentURL() {
            if (window.location.href.includes("pirsum")) {
                return window.location.href;
            } else {
           return window.location.href + 'pirsum/' + this.itemObj.id_pirsum
        //    const editUrl = window.location.href.charAt(0).toUpperCase() + window.location.href.slice(1);
        //         return editUrl + 'pirsum/' + this.itemObj.pirsumId
            }
        },
        forwardMessage(){
           return "תאריך פרסום: " + this.dateSimple(this.itemObj.date_create_pirsum) + "%0a" + "כותרת: " + this.itemObj.title + "%0a" + "תוכן: " + this.itemObj.content +
            "%0a" + "עמותה: " + this.itemObj.name + "%0a" + "עיר: " + this.itemObj.city + "%0a" + "כנסו ל " + "%0a" + this.getCurrentURL  + "%0a" + " לראות שהמודעה בתוקף "
        },
        
    },
    created() {
    },

}
</script>
<style>
.align1 {
    display: flex;
    align-content: center;
}

/* רספונסיביות של   כפתור העתק     */
@media only screen and (max-width: 580px) {

    .copyBt {
        margin: 10px;
    }

    .blockE {
        display: flex;
        justify-content: center;
    }
}
</style>
  