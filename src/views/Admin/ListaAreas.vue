<template>
  <div class="max-w-5xl mx-auto p-8 bg-white border border-gray-200 rounded-lg shadow space-y-8">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-semibold text-gray-800">Gestió d'àrees</h2>
      <button
        v-if="!mostrarDetalle && !mostrarEditar && !mostrarCrear"
        ref="botonCrearRef"
        @click="toggleCrearArea"
        class="btn-confirm text-white  rounded-md transition"
      >
        {{ 'Nova àrea' }}
      </button>
    </div>

    <!-- Formulario para crear área -->
    <CrearArea v-if="mostrarCrear" @areaCreada="handleAreaCreada" @cancelar="handleAreaCreada"/>

    <!-- Buscador -->
    <div class="mt-6" v-if="!mostrarDetalle && !mostrarEditar && !mostrarCrear">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Buscar àrea..."
        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
      />
    </div>

    <!-- Lista de áreas (ocultada cuando se visualiza el detalle de un área o la edición) -->
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
            <button
              @click="verMas(area.id)"
              class="text-gray-700 hover:text-black"
            >
              <font-awesome-icon icon="eye" />
            </button>
            <button
              @click="editarArea(area.id, area.nombre)"
              class="text-gray-700 hover:text-black"
            >
              <font-awesome-icon icon="pen" />
            </button>
            <button
              @click="mostrarConfirmacionEliminar(area.id)"
              class="text-gray-700 hover:text-black"
            >
              <font-awesome-icon icon="trash" />
            </button>
          </div>
        </li>
      </ul>
    </div>

    <!-- Vista de detalles del área -->
    <DetallesArea v-if="mostrarDetalle" :areaId="areaSeleccionadaId" @regresar="regresarALista" />

    <!-- Vista de edición del área -->
    <EditarArea v-if="mostrarEditar" :areaId="areaSeleccionadaId" :nombre="areaSeleccionadaNombre" @regresar="regresarALista" @areaEditada="handleAreaEditada" />

    <!-- Confirmación de eliminación -->
    <ConfirmacionEliminacion
      :mensaje="'¿Estàs segur que vols eliminar aquesta àrea?'"
      :visible="confirmarEliminacion"
      @confirmado="eliminarArea"
      @cancelado="cancelarEliminacion"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import CrearArea from '../../components/crear/crearArea.vue'
import ConfirmacionEliminacion from '../../components/ConfirmacionEliminacion.vue'
import DetallesArea from '../../components/Detalles/DetallesArea.vue'
import EditarArea from '../../components/editar/editarArea.vue'

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
    const res = await axios.get('http://localhost:3000/areas')
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
    await axios.delete(`http://localhost:3000/areas/${areaAEliminar.value}`)
    obtenerAreas() // Volver a cargar las áreas después de eliminar
    cancelarEliminacion()
  } catch (error) {
    console.error('Error al eliminar área', error)
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
}

// Manejar la creación de un área
const handleAreaCreada = () => {
  mostrarCrear.value = false
  obtenerAreas() // Volver a cargar las áreas después de la creación
}

// Manejar la edición de un área
const handleAreaEditada = () => {
  mostrarEditar.value = false
  obtenerAreas() // Recargar las áreas después de editar
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
