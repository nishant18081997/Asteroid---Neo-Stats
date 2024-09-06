import './assets/main.css'

import { createApp } from 'vue'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
const vuetify = createVuetify({
  components,
  directives
})
import App from './App.vue'
const app = createApp(App)
app.use(vuetify)
app.mount('#app')
