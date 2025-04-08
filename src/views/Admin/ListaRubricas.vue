<template>
  <div v-if="!rubricaAVer" class="max-w-5xl mx-auto p-8 bg-white border border-gray-200 rounded-lg shadow space-y-8">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-semibold text-gray-800">Gestió de rúbriques</h2>
      <button
      v-if="!rubricaAEditar && !mostrarCrear"
        ref="botonCrearRef"
        @click="toggleCrearRubrica"
        class="btn-confirm text-white  rounded-md transition"
      >
        {{ 'Nova rúbrica' }}
      </button>
    </div>

    <CrearRubrica v-if="mostrarCrear" @rubricaCreada="handleRubricaCreada" @cancelar="handleRubricaCreada"/>

    <div class="mt-6" v-if="!rubricaAEditar && !mostrarCrear">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Buscar rúbrica..."
        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
      />
    </div>

    <div class="mt-6" v-if="!rubricaAEditar && !mostrarCrear">
      <ul class="divide-y divide-gray-200">
        <li
          v-for="rubrica in filteredRubricas"
          :key="rubrica.id"
          class="p-4 flex justify-between items-center hover:bg-gray-50 transition"
        >
          <div>
            <p class="text-gray-800 font-medium"> {{ rubrica.nombre }}</p>
            <p class="text-gray-600 text-sm">Rol: {{ rubrica.rol.nombre }}</p>
          </div>
          <div class="flex gap-8 items-center">
            <button @click="verMas(rubrica.id)" class="text-gray-700 hover:text-black">
              <font-awesome-icon icon="eye" />
            </button>
            <button @click="editarRubrica(rubrica.id)" class="text-gray-700 hover:text-black">
              <font-awesome-icon icon="pen" />
            </button>
            <button @click="mostrarConfirmacionEliminar(rubrica.id)" class="text-gray-700 hover:text-black">
              <font-awesome-icon icon="trash" />
            </button>
          </div>
        </li>
      </ul>
    </div>

    <ConfirmacionEliminacion
      :mensaje="'¿Estàs segur que vols eliminar aquesta rúbrica?'"
      :visible="confirmarEliminacion"
      @confirmado="eliminarRubrica"
      @cancelado="cancelarEliminacion"
    />

    <EditarRubrica
      v-if="rubricaAEditar"
      :rubricaId="rubricaAEditar"
      @rubricaActualizada="handleRubricaActualizada"
      @cancelarEdicion="cancelarEdicion"
    />
  </div>

  <div>
    <DetallesRubrica 
      v-if="rubricaAVer"
      :rubricaId="rubricaAVer"
      @cerrarDetalles="cerrarDetalles"
    />
  </div>
</template>

<script>
import { nextTick } from 'vue'
import axios from 'axios'
import CrearRubrica from '../../components/crear/crearRubrica.vue'
import ConfirmacionEliminacion from '../../components/ConfirmacionEliminacion.vue'
import EditarRubrica from '../../components/editar/editarRubrica.vue'
import DetallesRubrica from '../../components/Detalles/DetallesRubrica.vue'

export default {
components: {
  CrearRubrica,
  ConfirmacionEliminacion,
  EditarRubrica,
  DetallesRubrica
},
data() {
  return {
    rubricas: [],
    mostrarCrear: false,
    confirmarEliminacion: false,
    rubricaAEliminar: null,
    rubricaAEditar: null,
    rubricaAVer: null,
    botonCrearRef: null,
    searchQuery: ''
  }
},
computed: {
  filteredRubricas() {
    const rubricasFiltradas = this.rubricas.filter(rubrica => {
      const lowerSearchQuery = this.searchQuery.toLowerCase()
      return rubrica.nombre.toLowerCase().includes(lowerSearchQuery)
    })
    return rubricasFiltradas.sort((a, b) => a.nombre.toLowerCase().localeCompare(b.nombre.toLowerCase()))
  }
},
methods: {
  async obtenerRubricas() {
    try {
      const res = await axios.get('http://localhost:3000/rubricas')
      this.rubricas = res.data
    } catch (error) {
      console.error('Error al obtener rúbricas', error)
    }
  },
  toggleCrearRubrica() {
    this.mostrarCrear = !this.mostrarCrear
    nextTick(() => {
      if (this.botonCrearRef) {
        this.botonCrearRef.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    })
  },
  mostrarConfirmacionEliminar(id) {
    this.confirmarEliminacion = true
    this.rubricaAEliminar = id
  },
  cancelarEliminacion() {
    this.confirmarEliminacion = false
    this.rubricaAEliminar = null
  },
  async eliminarRubrica() {
    try {
      await axios.delete(`http://localhost:3000/rubricas/${this.rubricaAEliminar}`)
      this.obtenerRubricas()
      this.cancelarEliminacion()
    } catch (error) {
      console.error('Error al eliminar rúbrica', error)
    }
  },
  verMas(rubrica) {
    this.rubricaAVer = rubrica
    console.log(`Editar rubrica ${rubrica}` )
  },
  cerrarDetalles(){
    this.rubricaAVer = null
    this.obtenerRubricas()
  },
  editarRubrica(rubrica) {
    this.rubricaAEditar = rubrica
  },
  cancelarEdicion() {
    this.rubricaAEditar = null
  },
  handleRubricaCreada() {
    this.mostrarCrear = false
    this.obtenerRubricas()
  },
  handleRubricaActualizada() {
    this.obtenerRubricas()
    this.rubricaAEditar = null
  }
},
mounted() {
  this.obtenerRubricas()
}
}
</script>

<style scoped>
/* Espacio para estilos adicionales si hace falta */
</style>