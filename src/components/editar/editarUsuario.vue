<!-- src/components/editar/EditarUsuario.vue -->
<template>
    <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-md space-y-4">
      <h3 class="text-xl font-semibold text-gray-800">{{ $t('editarUsuario') }}</h3>
      <form @submit.prevent="actualizarUsuario" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">{{ $t('nom') }}</label>
          <input
            v-model="form.nombre"
            type="text"
            required
            class="w-full mt-1 px-4 py-2 border rounded-md focus:ring-green-500 focus:border-green-500"
          />
        </div>
  
        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input
            v-model="form.email"
            type="email"
            required
            class="w-full mt-1 px-4 py-2 border rounded-md focus:ring-green-500 focus:border-green-500"
          />
        </div>
  
        <div>
          <label class="inline-flex items-center space-x-2">
            <input
              v-model="form.esAdmin"
              type="checkbox"
              class="form-checkbox text-green-600"
            />
            <span> {{ $t('admin') }}</span>
          </label>
        </div>
  
        <div class="flex justify-end space-x-4">
          <button
            type="button"
            @click="cancelarEdicion"
            class="btn-cancel"
          >
            {{ $t('cancel') }}
          </button>
          <button
            type="submit"
            class="btn-confirm"
          >
            {{ $t('actualitzarUsuari') }}
          </button>
        </div>
      </form>
    </div>
  </template>
  
  <script>
  import { useToast } from 'vue-toastification'
  import api from '@/services/api'

  const toast = useToast()
  export default {
    name: 'EditarUsuario',
    props: {
      usuario: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        form: {
          nombre: '',
          email: '',
          esAdmin: false
        }
      }
    },
    watch: {
      usuario: {
        handler(nuevoUsuario) {
          if (nuevoUsuario) {
            this.form.nombre = nuevoUsuario.nombre
            this.form.email = nuevoUsuario.email
            this.form.esAdmin = nuevoUsuario.esAdmin
          }
        },
        immediate: true
      }
    },
    methods: {
      async actualizarUsuario() {
        try {
          await api.put(`/usuarios/${this.usuario.id}`, {
            nombre: this.form.nombre,
            email: this.form.email,
            esAdmin: this.form.esAdmin
          })
          toast.success('Usuari actualitzat correctament')
          this.$emit('usuarioActualizado')
        } catch (error) {
          console.error('Error al actualizar usuario:', error)
          toast.error(`Error al actualitzar l'usuari`)
        }
      },
      cancelarEdicion() {
        this.$emit('cancelarEdicion')
      }
    }
  }
  </script>
  
  <style scoped>
  /* Espacio para estilos adicionales */
  </style>
  