<template>
  <div class="mt-5">
    <v-footer padless>
    <!-- color="red lighten-2"
       padless
       rounded
       bottom    -->
      <v-row
        justify="center"
        no-gutters
      >
      <!-- <v-col cols="12" sm="6" class="d-flex justify-center">
        <v-btn
          v-for="link in links"
          :key="link"
          color="white"
          text
          rounded
          class="my-2"
        >
          {{ link }}
        </v-btn>
        </v-col> -->
        
        <v-col
          class="red lighten-4 py-4 text-center white--text"
          cols="12"
        >
          {{ new Date().getFullYear() }} — <strong>Give it</strong>
        </v-col>
      </v-row>
    </v-footer>
  </div>
  </template>
  
<script>

export default {
    components: {
    },
    data() {
        return {
            links: [
        'דף הבית',
        'אודות',
        'צור קשר',
      ],
        }
    },
    methods: {
    },
    computed: {
    },
    created() {
    },
    
}
</script>
<style>

  </style>
  