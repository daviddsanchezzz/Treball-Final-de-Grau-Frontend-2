<template>
  <div class="max-w-5xl mx-auto p-8 bg-white border border-gray-200 rounded-lg shadow space-y-8">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-semibold text-gray-800">{{ $t('gestion_areas') }}</h2>
      <button
        v-if="!mostrarDetalle && !mostrarEditar && !mostrarCrear"
        ref="botonCrearRef"
        @click="toggleCrearArea"
        class="btn-confirm text-white  rounded-md transition"
      >
        {{ $t('nueva_area') }}
      </button>
    </div>

    <!-- Formulario para crear área -->
    <CrearArea v-if="mostrarCrear" @regresar="regresarALista"/>

    <!-- Buscador -->
    <div class="mt-6" v-if="!mostrarDetalle && !mostrarEditar && !mostrarCrear">
      <input
        v-model="searchQuery"
        type="text"
        :placeholder="$t('buscar_area')"
        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
      />
    </div>

    <!-- Lista de áreas -->
    <div v-if="!mostrarDetalle && !mostrarEditar && !mostrarCrear" class="mt-6">
      <ul class="divide-y divide-gray-200">
        <li
          v-for="area in filteredAreas"
          :key="area.id"
          class="p-4 flex justify-between items-center hover:bg-gray-50 transition"
        >
          <div>
            <p class="text-gray-800 font-medium">{{ area.nombre }}</p>
          </div>
          <div class="flex gap-8 items-center">
            <button @click="verMas(area.id)" class="text-gray-700 hover:text-black">
              <font-awesome-icon icon="eye" />
            </button>
            <button @click="editarArea(area.id, area.nombre)" class="text-gray-700 hover:text-black">
              <font-awesome-icon icon="pen" />
            </button>
            <button @click="mostrarConfirmacionEliminar(area.id)" class="text-gray-700 hover:text-black">
              <font-awesome-icon icon="trash" />
            </button>
          </div>
        </li>
      </ul>
    </div>

    <!-- Detalles y edición -->
    <DetallesArea v-if="mostrarDetalle" :areaId="areaSeleccionadaId" @regresar="regresarALista" />
    <EditarArea v-if="mostrarEditar" :areaId="areaSeleccionadaId" :nombre="areaSeleccionadaNombre" @regresar="regresarALista"  />

    <!-- Confirmación de eliminación -->
    <ConfirmacionEliminacion
      :mensaje="$t('confirmar_eliminacion_area')"
      :visible="confirmarEliminacion"
      @confirmado="eliminarArea"
      @cancelado="cancelarEliminacion"
    />
  </div>
</template>


<script setup>
import { ref, onMounted, computed } from 'vue'
import CrearArea from '../../components/crear/crearArea.vue'
import ConfirmacionEliminacion from '../../components/ConfirmacionEliminacion.vue'
import DetallesArea from '../../components/Detalles/DetallesArea.vue'
import EditarArea from '../../components/editar/editarArea.vue'
import { useToast } from 'vue-toastification'
import api from '@/services/api'

const toast = useToast()
const areas = ref([]) // Lista de áreas
const mostrarCrear = ref(false) // Estado para mostrar el formulario de creación
const confirmarEliminacion = ref(false) // Estado para mostrar la confirmación de eliminación
const areaAEliminar = ref(null) // ID del área que se eliminará
const botonCrearRef = ref(null) // Referencia al botón de crear
const mostrarDetalle = ref(false) // Estado para mostrar la vista de detalle
const mostrarEditar = ref(false) // Estado para mostrar la vista de edición
const areaSeleccionadaId = ref(null) // ID del área seleccionada
const areaSeleccionadaNombre = ref(null) // Nombre del área seleccionada
const searchQuery = ref('') // Valor del input de búsqueda

// Obtener la lista de áreas desde la API
const obtenerAreas = async () => {
  try {
    const res = await api.get('/areas')
    // Ordenar las áreas alfabéticamente por nombre
    areas.value = res.data.sort((a, b) => a.nombre.localeCompare(b.nombre))
  } catch (error) {
    console.error('Error al obtener áreas', error)
  }
}

// Toggle para mostrar el formulario de creación de área
const toggleCrearArea = () => {
  mostrarCrear.value = !mostrarCrear.value
}

// Mostrar confirmación de eliminación para el área seleccionada
const mostrarConfirmacionEliminar = (id) => {
  confirmarEliminacion.value = true
  areaAEliminar.value = id
}

// Cancelar la eliminación
const cancelarEliminacion = () => {
  confirmarEliminacion.value = false
  areaAEliminar.value = null
}

// Eliminar un área
const eliminarArea = async () => {
  try {
    await api.delete(`/areas/${areaAEliminar.value}`)
    obtenerAreas() // Volver a cargar las áreas después de eliminar
    toast.success(`Área eliminada correctament`)
    cancelarEliminacion()
  } catch (error) {
    console.error('Error al eliminar área', error)
    toast.error('Error al eliminar área')
  }
}

// Función para editar un área
const editarArea = (areaId, areaNombre) => {
  areaSeleccionadaId.value = areaId
  areaSeleccionadaNombre.value = areaNombre
  mostrarEditar.value = true
}

// Ver más detalles de un área
const verMas = (areaId) => {
  areaSeleccionadaId.value = areaId
  mostrarDetalle.value = true
}

// Volver a la lista de áreas
const regresarALista = () => {
  mostrarDetalle.value = false
  mostrarEditar.value = false
  mostrarCrear.value = false
  obtenerAreas();
}


// Cargar las áreas cuando se monta el componente
onMounted(() => {
  obtenerAreas()
})

// Propiedad computada para filtrar las áreas basadas en la búsqueda
const filteredAreas = computed(() => {
  return areas.value.filter(area => {
    const lowerSearchQuery = searchQuery.value.toLowerCase()
    return area.nombre.toLowerCase().includes(lowerSearchQuery)
  })
})
</script>

<style scoped>
/* Espacio reservado para estilos adicionales si los necesitas */
</style>
