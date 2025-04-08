<template>
<div class="min-h-screen bg-gray-100 ">

  <HeaderComp
    :usuario="usuarioNombre"
    :es-admin="esAdmin"
    :user-id="usuarioId"
    @cambiar-idioma="cambiarIdioma"
  />
  <div class="max-w-5xl mx-auto p-8 bg-white border  border-gray-200 rounded-lg shadow space-y-8 my-8">
    <!-- Header -->
    <div class="space-y-8">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-semibold text-gray-800">Els meus treballs</h2>

              <!-- Filtro de Estado -->
      <div class="mt-4">
        <label for="estado" class="block text-sm font-medium text-gray-700">Filtrar por estado</label>
        <select
          v-model="estadoFiltro"
          id="estado"
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        >
          <option value="">Todos</option>
          <option value="PENDIENTE">Pendent</option>
          <option value="EN_PROGRESO">En progrés</option>
          <option value="FINALIZADO">Finalitzat</option>
        </select>
      </div>
      </div>

      <!-- Buscador -->
      <div class="mt-6">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar trabajo..."
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
      </div>

      <!-- Lista de trabajos -->
      <div v-if="trabajos.length > 0" class="mt-6">
        <ul class="divide-y divide-gray-200">
          <li
            v-for="(trabajo, index) in filteredTrabajos"
            :key="index"
            class="p-4 flex justify-between items-center hover:bg-gray-50 transition"
          >
            <div>
              <p class="text-gray-800 font-medium">{{ trabajo.trabajo.titulo }}</p>
              <p class="text-gray-600 text-sm">Rol: {{ trabajo.rol }}</p>
            </div>
            <div class="flex gap-4 items-center">
              <span
                v-if="trabajo.trabajo.estado"
                class="text-white text-[10px] px-1 py-0.5 rounded-full ml-2 font-medium"
                :class="estadoClases(trabajo.trabajo.estado)"
              >
                {{estadoTexto(trabajo.trabajo.estado)}}
              </span>
              <button
                @click="evaluarTrabajo(trabajo.trabajo.id)"
                class="btn-confirm px-2 py-1 rounded-md transition"
              >
                Evaluar
              </button>
            </div>
          </li>
        </ul>
      </div>

      <div v-else class="mt-6">
        <p class="text-lg text-gray-600">No tienes trabajos asignados.</p>
      </div>

    </div>
  </div>
</div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import HeaderComp from '@/components/HeaderComp.vue'

const usuarioId = ref(localStorage.getItem('usuarioId') || '')  // Obtener usuarioId desde localStorage
const usuarioNombre = ref(localStorage.getItem('nombre') || '')  // Obtener nombre desde localStorage
const esAdmin = ref(localStorage.getItem('esAdmin') === 'true')  // Obtener esAdmin desde localStorage
const trabajos = ref([])
const searchQuery = ref('')
const estadoFiltro = ref('')  // Filtrador por estado

// Función para obtener los trabajos
const obtenerTrabajos = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/usuarios/${usuarioId.value}/trabajos`)
    trabajos.value = response.data
  } catch (error) {
    console.error('Error al obtener los trabajos:', error)
  }
}

// Función para evaluar un trabajo
const evaluarTrabajo = (trabajoId) => {
  console.log(`Evaluar trabajo con ID: ${trabajoId}`)
}

// Propiedad computada para filtrar los trabajos según la búsqueda y el estado
const filteredTrabajos = computed(() => {
  return trabajos.value.filter(trabajo => {
    const lowerSearchQuery = searchQuery.value.toLowerCase()
    const matchesSearchQuery = trabajo.trabajo.titulo.toLowerCase().includes(lowerSearchQuery)

    // Filtrado por estado si está seleccionado
    const matchesEstadoFiltro = estadoFiltro.value
      ? trabajo.trabajo.estado === estadoFiltro.value
      : true

    return matchesSearchQuery && matchesEstadoFiltro
  })
})

// Llamada a la API para obtener los trabajos del usuario
onMounted(async () => {
  try {
    await obtenerTrabajos()
  } catch (error) {
    console.error('Error al obtener los trabajos:', error)
  }
})

// Función para cambiar el idioma
const cambiarIdioma = (idioma) => {
  console.log('Idioma cambiado a:', idioma)
}

const estadoClases = computed(() => (estado) => {
  const clases = {
    PENDIENTE: 'bg-yellow-500', // Amarillo para pendiente
    EN_PROGRESO: 'bg-blue-500', // Azul para en progreso
    FINALIZADO: 'bg-green-500', // Verde para finalizado
  }
  return clases[estado] || 'bg-gray-500' // Gris por defecto si el estado es desconocido
})

const estadoTexto = computed(() => (estado) => {
  const textos = {
    PENDIENTE: 'Pendent',
    EN_PROGRESO: 'En progrés',
    FINALIZADO: 'Finalitzat',
  }
  return textos[estado] || 'Desconegut'
})

</script>

<style scoped>
/* Estilo para el input de búsqueda */
input {
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

input:focus {
  border-color: #3b82f6; /* Azul de enfoque */
  box-shadow: 0 0 5px rgba(59, 130, 246, 0.4); /* Efecto sutil en el enfoque */
}

/* Estilos adicionales para la transición de hover en los items */
li:hover {
  background-color: #f9fafb;
}
</style>
