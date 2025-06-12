<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <!-- Header -->
    <HeaderComp
      :usuario="usuarioNombre"
      :esAdmin="esAdmin"
      :userId="usuarioId"
    />

    <!-- Navigation Tabs -->
    <div class="flex justify-start space-x-4 border-b p-4 bg-white">
      <router-link
        :to="`/admin/${usuarioId}/usuarios`"
        class="text-base font-medium py-1 px-4 hover:bg-gray-200 transition-colors"
        active-class="border-b-2 border-green-500"
      >
        {{ $t('usuarios') }}
      </router-link>

      <router-link
        :to="`/admin/${usuarioId}/areas`"
        class="text-base font-medium py-1 px-4 hover:bg-gray-200 transition-colors"
        active-class="border-b-2 border-green-500"
      >
        {{ $t('areas') }}
      </router-link>

      <router-link
        :to="`/admin/${usuarioId}/trabajos`"
        class="text-base font-medium py-1 px-4 hover:bg-gray-200 transition-colors"
        active-class="border-b-2 border-green-500"
      >
        {{ $t('trabajos') }}
      </router-link>

      <router-link
        :to="`/admin/${usuarioId}/rubricas`"
        class="text-base font-medium py-1 px-4 hover:bg-gray-200 transition-colors"
        active-class="border-b-2 border-green-500"
      >
        {{ $t('rubricas') }}
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

const usuarioId = ref(localStorage.getItem('usuarioId') || '')
const usuarioNombre = ref(localStorage.getItem('nombre') || '')
const esAdmin = ref(localStorage.getItem('esAdmin') === 'true')

console.log(esAdmin)
</script>

<style scoped>
.router-link-exact-active {
  border-bottom: 2px solid #00B48A;
  color: #00B48A;
}
</style>
