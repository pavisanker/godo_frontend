import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap";
import router from './router'
import store from './store';
import VueGoogleMaps from "@fawmi/vue-google-maps";
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';


loadFonts()

createApp(App)
  .use(vuetify)
  .use(router)
  .use(store)
  .use(VueGoogleMaps, {
    load: {
      key: 'AIzaSyAmUrMggmOI2LemyeYrc-uHm5hMnRBKz98',
      libraries: "places",
    },
  })
  .mount('#app')
  
