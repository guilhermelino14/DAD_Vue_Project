import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { io } from "socket.io-client"
import '@mdi/font/css/materialdesignicons.css'

import App from './App.vue'
import router from './router'

//import './assets/main.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi', // This is already the default value - only for display purposes
  },
})

const app = createApp(App)

app.provide('socket', io("http://localhost:8080"))
app.use(createPinia())
app.use(router)
app.use(vuetify)
app.mount('#app')
