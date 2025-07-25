<template>
    <div class="space-y-4 mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow">
      <h3 class="text-xl font-semibold text-gray-800">{{ $t('editarRubrica')}}</h3>
  
      <form @submit.prevent="submitForm">
        <!-- Nombre de la rúbrica -->
        <div class="mb-4">
          <label for="nombre" class="block text-sm font-medium text-gray-700">{{ $t('nombreRubrica')}}</label>
          <input
            v-model="rubrica.nombre"
            id="nombre"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
  
        <!-- Rol asociado -->
        <div class="mb-4">
          <label for="rol" class="block text-sm font-medium text-gray-700">  {{ $t('rol') }}</label>
          <select v-model="rubrica.rol.id" id="rol" required class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
            <option v-for="rol in roles" :key="rol.id" :value="rol.id">{{ $t(rol.nombre.toLowerCase()) }}</option>
          </select>
        </div>
  
  
        <div class="flex justify-end gap-4">
          <button type="button" @click="cancelarEdicion" class="btn-cancel">
            {{ $t('cancel') }}
          </button>
          <button type="submit" class="btn-confirm">
            {{ $t('actualitzarRubrica') }}

          </button>
        </div>
      </form>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue'
  import { useToast } from 'vue-toastification'
  import api from '@/services/api'

  const toast = useToast()
  export default {
    props: {
      rubricaId: {
        type: Number,
        required: true
      }
    },
    setup(props, { emit }) {
      const rubrica = ref({
        nombre: '',
        rol: {
          id: null,
          nombre: ''
        },
        cantidadPuntosDeControl: 0
      })
      const roles = ref([])
  
      const obtenerRubrica = async () => {
        try {
          const res = await api.get(`/rubricas/${props.rubricaId}`)
          const rubricaData = res.data
          
          // Filtrar solo los datos necesarios
          rubrica.value = {
            id: rubricaData.id,
            nombre: rubricaData.nombre,
            rol: {
              id: rubricaData.rol.id,
              nombre: rubricaData.rol.nombre
            },
            cantidadPuntosDeControl: rubricaData.puntosDeControl.length  || 0
          }
        } catch (error) {
          console.error('Error al obtener la rúbrica', error)
        }
      }
  
      const obtenerRoles = async () => {
        try {
          const res = await api.get('/roles')
          roles.value = res.data
        } catch (error) {
          console.error('Error al obtener roles', error)
        }
      }
  
      const submitForm = async () => {
        try {
            const { nombre, rol } = rubrica.value
       

          // Enviar solo la cantidad de puntos de control junto con el resto de los datos
          await api.put(`/rubricas/${props.rubricaId}`, {
            nombre,
            rolId: rol.id,  // Pasar el ID del rol
          })
          toast.success('Rúbrica actualitzada correctament')
          emit('rubricaActualizada')
        } catch (error) {
          console.error('Error al actualizar la rúbrica', error)
          toast.error('Error al actualitzar la rúbrica')
        }
      }
  
      const cancelarEdicion = () => {
        emit('cancelarEdicion')
      }
  
      onMounted(() => {
        obtenerRubrica()
        obtenerRoles()
      })
  
      return {
        rubrica,
        roles,
        submitForm,
        cancelarEdicion
      }
    }
  }
  </script>
  
  <style scoped>
  /* Estilos adicionales si es necesario */
  </style>
  