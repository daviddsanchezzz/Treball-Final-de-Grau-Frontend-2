<template>
  <div class="max-w-5xl mx-auto p-8 bg-white border border-gray-200 rounded-lg shadow space-y-8">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-semibold text-gray-800">Gestió d'usuaris</h2>
      <button
        v-if="!mostrarEdicion && !mostrarCrear"
        ref="botonCrearRef"
        @click="toggleCrearUsuario"
        class="btn-confirm text-white  rounded-md transition"
      >
        {{ 'Nou usuari' }}
      </button>
    </div>

    <!-- Formulario para crear usuario -->
    <CrearUsuario
      v-if="mostrarCrear"
      @usuarioCreado="handleUsuarioCreado"
      @cancelar="handleUsuarioCreado"
    />

    <!-- Formulario para editar usuario -->
      <EditarUsuario
        v-if="mostrarEdicion"

        :usuario="usuarioEnEdicion"
        @usuarioActualizado="handleUsuarioActualizado"
        @cancelarEdicion="mostrarEdicion = false"
      />


    <!-- Buscador -->
    <div class="mt-6">
      <input
        v-if="!mostrarEdicion && !mostrarCrear"
        v-model="searchQuery"
        type="text"
        placeholder="Buscar usuari..."
        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
      />
    </div>

    <!-- Lista de usuarios -->
    <div class="mt-6" v-if="!mostrarEdicion && !mostrarCrear">
      <ul class="divide-y divide-gray-200">
        <li
          v-for="usuario in filteredUsuarios"
          :key="usuario.id"
          class="p-4 flex justify-between items-center hover:bg-gray-50 transition"
        >
          <div>
            <p class="text-gray-800 font-medium"> {{ usuario.nombre }}</p>
            <p class="text-gray-600 text-sm">{{ usuario.email }}</p>
          </div>
          <div class="flex gap-8 items-center">
            <span
              v-if="usuario.esAdmin"
              class="text-white text-[10px] px-1 py-0.5 rounded-full ml-2 font-medium" 
              style="background-color: #00785A"
            >
              Admin
            </span>
            <button
              @click="editarUsuario(usuario)"
              class="text-gray-700 hover:text-black"
            >
              <font-awesome-icon icon="pen" />
            </button>
            <button
              @click="mostrarConfirmacionEliminar(usuario.id)"
              class="text-gray-700 hover:text-black"
            >
              <font-awesome-icon icon="trash" />
            </button>
          </div>
        </li>
      </ul>
    </div>

    <!-- Confirmación de eliminación -->
    <ConfirmacionEliminacion
      :mensaje="'¿Estàs segur que vols eliminar aquest professor?'"
      :visible="confirmarEliminacion"
      @confirmado="eliminarUsuario"
      @cancelado="cancelarEliminacion"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue'
import axios from 'axios'
import CrearUsuario from '../../components/crear/crearUsuario.vue'
import EditarUsuario from '../../components/editar/editarUsuario.vue'
import ConfirmacionEliminacion from '../../components/ConfirmacionEliminacion.vue'

const usuarios = ref([])
const mostrarCrear = ref(false)
const mostrarEdicion = ref(false)
const usuarioEnEdicion = ref(null)
const confirmarEliminacion = ref(false)
const usuarioAEliminar = ref(null)
const botonCrearRef = ref(null)
const searchQuery = ref('')

// Obtener lista de usuarios
const obtenerUsuarios = async () => {
  try {
    const res = await axios.get('http://localhost:3000/usuarios')
    usuarios.value = res.data
  } catch (error) {
    console.error('Error al obtener usuarios', error)
  }
}

// Toggle del formulario de creación
const toggleCrearUsuario = () => {
  mostrarCrear.value = !mostrarCrear.value
  nextTick(() => {
    if (botonCrearRef.value) {
      botonCrearRef.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  })
}

// Crear usuario
const handleUsuarioCreado = () => {
  mostrarCrear.value = false
  obtenerUsuarios()
}


// Editar usuario
const editarUsuario = (usuario) => {
  usuarioEnEdicion.value = usuario
  mostrarEdicion.value = true

}

// Usuario actualizado
const handleUsuarioActualizado = () => {
  mostrarEdicion.value = false
  usuarioEnEdicion.value = null
  obtenerUsuarios()
}

// Eliminar usuario
const mostrarConfirmacionEliminar = (usuarioId) => {
  confirmarEliminacion.value = true
  usuarioAEliminar.value = usuarioId
}

const cancelarEliminacion = () => {
  confirmarEliminacion.value = false
  usuarioAEliminar.value = null
}

const eliminarUsuario = async () => {
  try {
    await axios.delete(`http://localhost:3000/usuarios/${usuarioAEliminar.value}`)
    obtenerUsuarios()
    cancelarEliminacion()
  } catch (error) {
    console.error('Error al eliminar usuario', error)
  }
}

// Computed para búsqueda y orden
const filteredUsuarios = computed(() => {
  const lowerSearchQuery = searchQuery.value.toLowerCase()
  const usuariosFiltrados = usuarios.value.filter(usuario =>
    usuario.nombre.toLowerCase().includes(lowerSearchQuery) ||
    usuario.email.toLowerCase().includes(lowerSearchQuery)
  )
  return usuariosFiltrados.sort((a, b) =>
    a.nombre.toLowerCase().localeCompare(b.nombre.toLowerCase())
  )
})

onMounted(() => {
  obtenerUsuarios()
})
</script>

<style scoped>
/* Espacio reservado para estilos adicionales */
</style>
