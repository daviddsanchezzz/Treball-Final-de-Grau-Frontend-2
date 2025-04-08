<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <!-- Header -->
    <HeaderComp
    :usuario="usuarioNombre"
    :esAdmin="esAdmin"
    :userId="usuarioId"
    @cambiar-idioma="cambiarIdioma"
  />

    <!-- Navigation Tabs -->
    <div class="flex justify-start space-x-4 border-b p-4  bg-white">

      <router-link
        :to="`/admin/${usuarioId}/usuarios`"  
        class="text-base font-medium py-1 px-4 hover:bg-gray-200 transition-colors"
        active-class="border-b-2 border-green-500"
      >
        Usuaris
      </router-link>

      <router-link
        :to="`/admin/${usuarioId}/areas`"
        class="text-base font-medium py-1 px-4 hover:bg-gray-200 transition-colors"
        active-class="border-b-2 border-green-500"
      >
        Àrees
      </router-link>

      <router-link
        :to="`/admin/${usuarioId}/trabajos`"
        class="text-base font-medium py-1 px-4 hover:bg-gray-200 transition-colors"
        active-class="border-b-2 border-green-500"
      >
        Treballs
      </router-link>

      <router-link
        :to="`/admin/${usuarioId}/rubricas`"
        class="text-base font-medium py-1 px-4 hover:bg-gray-200 transition-colors"
        active-class="border-b-2 border-green-500"
      >
        Rúbriques
      </router-link>
    </div>


    <!-- Main Content -->
    <main class="flex-1 p-8 bg-gray-50 overflow-y-auto">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import HeaderComp from '@/components/HeaderComp.vue'
import { ref } from 'vue'

const usuarioId = ref(localStorage.getItem('usuarioId') || '')  // Obtener usuarioId desde localStorage
const usuarioNombre = ref(localStorage.getItem('nombre') || '')  // Obtener nombre desde localStorage
const esAdmin = ref(localStorage.getItem('esAdmin')  === 'true')  // Obtener esAdmin desde localStorage

console.log(esAdmin)

const cambiarIdioma = (idioma) => {
  console.log('Idioma cambiado a:', idioma)
}
</script>

<style scoped>
/* Estilos para las pestañas */
.router-link-exact-active {
  border-bottom: 2px solid #00B48A; /* Color verde */
  color: #00B48A;
}
</style>
