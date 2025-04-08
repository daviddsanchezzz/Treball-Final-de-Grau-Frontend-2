import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/tailwind.css'
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTrash , faBars, faXmark, faEye, faPen} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// Añadir el icono a la biblioteca
library.add(faTrash, faBars, faXmark, faEye, faPen);

const app = createApp(App);

// Registrar el componente FontAwesomeIcon globalmente
app.component('font-awesome-icon', FontAwesomeIcon);

app.use(router).mount('#app')
