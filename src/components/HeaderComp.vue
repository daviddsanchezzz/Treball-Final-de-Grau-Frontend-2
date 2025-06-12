<template>
  <header class="bg-white border-b shadow-sm relative">
    <div class="flex justify-between items-center px-8 py-4">
      <!-- Logo y título (clicable) -->
      <div
        class="flex items-center space-x-4 cursor-pointer"
        @click="goToUser"
      >
        <img src="/logo-uab.svg" alt="UAB Logo" class="h-10" />
        <div>
          <h1 class="text-lg font-semibold text-black">
            {{ $t('uab') }}
          </h1>
          <h2 class="text-sm font-semibold" style="color: #00785A">
            {{ $t('avaluador') }}
          </h2>
        </div>
      </div>

      <!-- Acciones -->
      <div class="flex items-center space-x-4">
        <span class="text-black font-medium">{{ $t('bienvenido') }}, {{ usuario }}</span>

        <!-- Selector de idioma -->
        <div class="relative">
          <button
            @click="toggleIdiomas"
            class="px-3 py-1 text-white rounded"
            style="background-color: #00B48A"
          >
            {{ $t('idioma') }} 
            <span class="ml-1">▼</span>
          </button>
          <div
            v-if="mostrarIdiomas"
            class="absolute right-0 mt-1 w-40 bg-white border rounded shadow-md z-10 transition-all ease-in-out duration-300"
          >
            <ul class="text-sm text-gray-700">
              <li>
                <button
                  class="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  @click="cambiarIdiomaLocal('ca')"
                >
                  Català
                </button>
              </li>
              <li>
                <button
                  class="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  @click="cambiarIdiomaLocal('es')"
                >
                  Castellano
                </button>
              </li>
         <li>
                <button
                  class="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  @click="cambiarIdiomaLocal('en')"
                >
                  English
                </button>
              </li> 
            </ul>
          </div>
        </div>

        <!-- Menú de usuario (Mi perfil) -->
        <div class="relative">
          <button
            @click="togglePerfil"
            class="px-3 py-1 border rounded text-black hover:bg-green-50 transition"
            style="border-color: #00785A"
          >
            {{ $t('perfil') }} 
            <span class="ml-1">▼</span>
          </button>
          <div
            v-if="mostrarPerfil"
            class="absolute right-0 mt-1 w-48 bg-white border rounded shadow-md z-10"
          >
            <ul class="text-sm text-gray-700">
              <li>
                <button
                  class="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  @click="cambiarContrasenya"
                >
                {{$t('cambiar_contrasenya')}}
              </button>
              </li>
              <li>
                <button
                  class="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  @click="logout"
                >
                  {{$t('desconectar')}}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Subheader -->
    <div
      class="text-center py-2 text-sm font-medium"
      style="background-color: #00785A"
    >
      <!-- Botón de Panell Administrador -->
      <button
        v-if="esAdmin"
        @click="goToAdmin"
        :class="{ 'text-green-300': isAdminRoute }"
        class="px-6 py-2 mx-2 text-white focus:ring-0 border-none transition-all duration-300 transform hover:scale-105"
      >
        {{ $t('Panel_admin') }}
      </button>

      <!-- Botón de Panell Professor -->
      <button
        @click="goToUser"
        :class="{ 'text-green-300': isUserRoute }"
        class="px-6 py-2 mx-2 text-white focus:ring-0 border-none transition-all duration-300 transform hover:scale-105"
      >
      {{ $t('prof') }}
    </button>
    </div>
  </header>
</template>

<script>
export default {
  name: 'HeaderComp',
  props: {
    usuario: String,
    esAdmin: Boolean,
    userId: String,
  },
  data() {
    return {
      mostrarIdiomas: false,
      mostrarPerfil: false,
    }
  },
  computed: {
    isAdminRoute() {
      return this.$route.path.includes('admin');
    },
    isUserRoute() {
      return this.$route.path.includes('user');
    }
  },
  methods: {
    goToAdmin() {
      if (this.userId) {
        this.$router.push(`/admin/${this.userId}/usuarios`);
      }
    },
    goToUser() {
      if (this.userId) {
        this.$router.push(`/user/${this.userId}`);
      }
    },
    logout() {
      localStorage.removeItem('token');
      this.$router.push('/login');
    },
    cambiarIdiomaLocal(idioma) {
      this.$i18n.locale = idioma
      this.mostrarIdiomas = false
    },
    cambiarContrasenya() {
      this.$router.push(`/user/${this.userId}/cambiar-contrasenya`);
    },
    toggleIdiomas() {
      // Si el menú de perfil está abierto, lo cerramos
      if (this.mostrarPerfil) {
        this.mostrarPerfil = false;
      }
      // Abrimos o cerramos el menú de idiomas
      this.mostrarIdiomas = !this.mostrarIdiomas;
      if (this.mostrarIdiomas) {
        document.addEventListener('click', this.cerrarIdiomas);
      }
    },
    togglePerfil() {
      // Si el menú de idiomas está abierto, lo cerramos
      if (this.mostrarIdiomas) {
        this.mostrarIdiomas = false;
      }
      // Abrimos o cerramos el menú de perfil
      this.mostrarPerfil = !this.mostrarPerfil;
      if (this.mostrarPerfil) {
        document.addEventListener('click', this.cerrarPerfil);
      }
    },
    cerrarIdiomas(event) {
      if (!this.$el.contains(event.target)) {
        this.mostrarIdiomas = false;
        document.removeEventListener('click', this.cerrarIdiomas);
      }
    },
    cerrarPerfil(event) {
      if (!this.$el.contains(event.target)) {
        this.mostrarPerfil = false;
        document.removeEventListener('click', this.cerrarPerfil);
      }
    }
  },
  beforeUnmount() {
    document.removeEventListener('click', this.cerrarIdiomas);
    document.removeEventListener('click', this.cerrarPerfil);
  }
}
</script>
