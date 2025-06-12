<template>
  <div class="max-w-5xl mx-auto p-8 bg-white border border-gray-200 rounded-lg shadow space-y-8">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-semibold text-gray-800">{{ $t('gestionTrabajos') }}</h2>
      <button
      v-if="!trabajoSeleccionado && !trabajoParaEditar && !mostrarCrear"
        ref="botonCrearRef"
        @click="toggleCrearTrabajo"
        class="btn-confirm text-white  rounded-md transition"
      >
        {{ $t('nuevoTrabajo') }}
      </button>
    </div>

    <!-- Formulario para crear trabajo -->
    <CrearTrabajo v-if="mostrarCrear" @trabajoCreado="handleTrabajoCreado" @cancelar="handleTrabajoCreado" />

    <!-- Buscador y lista solo se muestran si no estamos viendo detalles o editando un trabajo -->
    <div v-if="!trabajoSeleccionado && !trabajoParaEditar && !mostrarCrear">
      <!-- Buscador -->
      <div class="mt-6">
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="$t('buscarTrabajo')"
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <!-- Lista de trabajos -->
      <div class="mt-6" v-if=" !mostrarCrear">
        <ul class="divide-y divide-gray-200">
          <li
            v-for="trabajo in filteredTrabajos"
            :key="trabajo.id"
            class="p-4 flex justify-between items-center hover:bg-gray-50 transition"
          >
            <div>
              <p class="text-gray-800 font-medium">{{ trabajo.titulo }}</p>
              <p class="text-gray-600 text-sm">{{ trabajo.estudiante }}</p>
            </div>
            <div class="flex gap-8 items-center">
              <span
                v-if="trabajo.estado"
                class="text-white text-[10px] px-1 py-0.5 rounded-full ml-2 font-medium"
                :class="estadoClases(trabajo.estado)"
              >
                {{estadoTexto(trabajo.estado)}}
              </span>
              <button
                @click="verMas(trabajo)"
                class="text-gray-700 hover:text-black"
              >
                <font-awesome-icon icon="eye" />
              </button>
              <button
                @click="fEditarTrabajo(trabajo)"
                class="text-gray-700 hover:text-black"
              >
                <font-awesome-icon icon="pen" />
              </button>
              <button
                @click="mostrarConfirmacionEliminar(trabajo.id)"
                class="text-gray-700 hover:text-black"
              >
                <font-awesome-icon icon="trash" />
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- Ver más -->
    <DetallesTrabajo v-if="trabajoSeleccionado" :trabajo="trabajoSeleccionado" @cerrar="trabajoSeleccionado = null" />

    <!-- Editar -->
    <editarTrabajo v-if="trabajoParaEditar" :trabajo="trabajoParaEditar" @actualizado="handleTrabajoActualizado" @cancelar="trabajoParaEditar = null" />

    <!-- Confirmación de eliminación -->
    <ConfirmacionEliminacion
      :mensaje="$t('confirmarEliminacionTrabajo')"
      :visible="confirmarEliminacion"
      @confirmado="eliminarTrabajo"
      @cancelado="cancelarEliminacion"
    />
  </div>
</template>


<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'
import CrearTrabajo from '../../components/crear/crearTrabajo.vue'
import ConfirmacionEliminacion from '../../components/ConfirmacionEliminacion.vue'
import DetallesTrabajo from '../../components/Detalles/DetallesTrabajo.vue'
import editarTrabajo from '../../components/editar/editarTrabajo.vue'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import api from '@/services/api'

const { t } = useI18n()

const toast = useToast()
const trabajos = ref([])
const mostrarCrear = ref(false)
const confirmarEliminacion = ref(false)
const trabajoAEliminar = ref(null)
const botonCrearRef = ref(null)
const trabajoSeleccionado = ref(null)
const trabajoParaEditar = ref(null)
const searchQuery = ref('')

const obtenerTrabajos = async () => {
  try {
    const res = await api.get('/trabajos')
    trabajos.value = res.data
  } catch (error) {
    console.error('Error al obtener trabajos', error)
  }
}

const toggleCrearTrabajo = () => {
  mostrarCrear.value = !mostrarCrear.value

  nextTick(() => {
    if (botonCrearRef.value) {
      botonCrearRef.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  })
}

const mostrarConfirmacionEliminar = (id) => {
  confirmarEliminacion.value = true
  trabajoAEliminar.value = id
}

const cancelarEliminacion = () => {
  confirmarEliminacion.value = false
  trabajoAEliminar.value = null
}

const eliminarTrabajo = async () => {
  console.log(trabajoAEliminar.value)
  try {
    await api.delete(`/trabajos/${trabajoAEliminar.value}`)
    obtenerTrabajos()
    cancelarEliminacion()
    toast.success('Treball eliminat correctament')
  } catch (error) {
    toast.error('Error al eliminar el treball')
    console.error('Error al eliminar trabajo', error)
  }
}

const verMas = (trabajo) => {
  trabajoSeleccionado.value = trabajo

}

const fEditarTrabajo = (trabajo) => {
  trabajoParaEditar.value = trabajo
}

const handleTrabajoActualizado = () => {
  trabajoParaEditar.value = null
  obtenerTrabajos()
}

const handleTrabajoCreado = () => {
  mostrarCrear.value = false
  obtenerTrabajos()
}

onMounted(() => {
  obtenerTrabajos()
})

// Computed property para filtrar y ordenar la lista de trabajos
const filteredTrabajos = computed(() => {
  return trabajos.value
    .filter(trabajo => {
      const lowerSearchQuery = searchQuery.value.toLowerCase()
      return trabajo.titulo.toLowerCase().includes(lowerSearchQuery) ||
             trabajo.estudiante.toLowerCase().includes(lowerSearchQuery)
    })
    .sort((a, b) => a.titulo.localeCompare(b.titulo)) // Ordenar alfabéticamente por el título
})

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
    PENDIENTE: t('pendiente'),
    EN_PROGRESO: t('en_progreso'),
    FINALIZADO: t('finalizado'),
  }
  return textos[estado] || 'Desconegut'
})

</script>


<style scoped>
/* Espacio para estilos adicionales si hace falta */
</style>
