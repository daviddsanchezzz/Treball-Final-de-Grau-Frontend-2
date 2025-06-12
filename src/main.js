import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/tailwind.css'

import { library } from '@fortawesome/fontawesome-svg-core';
import { faTrash , faBars, faXmark, faEye, faPen, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// Toastification
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

import i18n from './i18n'


// Añadir los iconos a la biblioteca
library.add(faTrash, faBars, faXmark, faEye, faPen, faCheck);

const app = createApp(App);

// Registrar el componente FontAwesomeIcon globalmente
app.component('font-awesome-icon', FontAwesomeIcon);

// Configuración opcional del toast
const toastOptions = {
  position: 'top-right',
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false
};

app.use(router).use(i18n).use(Toast, toastOptions).mount('#app')
