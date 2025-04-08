<template>
    <div class="space-y-4 mx-auto mt-8 p-6 bg-white rounded-xl shadow-md">
      <h2 class="text-2xl font-semibold text-gray-800 mb-4">Editar Treball</h2>
      
      <!-- Notificación -->
      <SaltoNotificacio 
        v-if="notificacion.mostrar"
        :mensaje="notificacion.mensaje"
        :tipo="notificacion.tipo"
      />
  
      <form @submit.prevent="actualizarTrabajo">
        <!-- Títol -->
        <div class="mb-4">
          <label class="block text-gray-700">Títol</label>
          <input
            v-model="form.titulo"
            type="text"
            class="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
  
        <!-- Estudiant -->
        <div class="mb-4">
          <label class="block text-gray-700">Estudiant</label>
          <input
            v-model="form.estudiante"
            type="text"
            class="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
  
        <!-- Descripció -->
        <div class="mb-4">
          <label class="block text-gray-700">Descripció</label>
          <textarea
            v-model="form.descripcion"
            class="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            required
          ></textarea>
        </div>
  
        <!-- Tutor -->
        <div class="mb-4">
          <label class="block text-gray-700">Tutor</label>
          <div v-if="tutores.length">
            <multiselect
              v-model="form.tutor"
              :options="tutores"
              track-by="id"
              label="nombre"
              placeholder="Selecciona un tutor"
              :customLabel="customLabel"
              required
            ></multiselect>
          </div>
          <div v-else class="text-gray-500 italic text-sm">No hi ha tutors disponibles.</div>
        </div>
  
        <!-- Àrea -->
        <div class="mb-4">
          <label class="block text-gray-700">Àrea</label>
          <div v-if="areas.length">
            <multiselect
              v-model="form.area"
              :options="areas"
              track-by="id"
              label="nombre"
              placeholder="Selecciona una àrea"
              :customLabel="customLabel"
              required
            ></multiselect>
          </div>
          <div v-else class="text-gray-500 italic text-sm">No hi ha àrees disponibles.</div>
        </div>
  
        <!-- Botones -->
        <div class="flex justify-end mb-6">
          <button
            type="button"
            @click="cancelarEdicion"
            class="btn-cancel"
          >
            Cancel·lar
          </button>
          <button
          type="submit"
          class="btn-confirm ml-4"
        >
          Actualitzar Treball
        </button>
        </div>
      </form>
    </div>
  </template>
  
  <script>
  import Multiselect from 'vue-multiselect'
  import 'vue-multiselect/dist/vue-multiselect.min.css'
  import axios from 'axios'
  import SaltoNotificacio from '../SaltoNotificacion.vue' // Asegúrate de importar correctamente
  
  export default {
    components: {
      Multiselect,
      SaltoNotificacio
    },
    props: {
      trabajo: Object
    },
    emits: ['actualizado', 'cancelar'],
    data() {
      return {
        form: {
          titulo: this.trabajo.titulo,
          estudiante: this.trabajo.estudiante,
          descripcion: this.trabajo.descripcion || '',
          tutor: null,
          area: null
        },
        tutores: [],
        areas: [],
        notificacion: {
          mostrar: false,
          mensaje: '',
          tipo: 'success'
        }
      }
    },
    async mounted() {
      await this.cargarDatos()
      this.preseleccionarValores()
    },
    methods: {
      async cargarDatos() {
        try {
          const [resTutores, resAreas] = await Promise.all([
            axios.get('http://localhost:3000/usuarios'),
            axios.get('http://localhost:3000/areas')
          ])
          this.tutores = resTutores.data
          this.areas = resAreas.data
        } catch (error) {
          console.error('Error al cargar tutores y áreas:', error)
        }
      },
      preseleccionarValores() {
        this.form.tutor = this.tutores.find(t => t.id === this.trabajo.tutorId) || null
        this.form.area = this.areas.find(a => a.id === this.trabajo.areaId) || null
      },
      async actualizarTrabajo() {
        try {
          const tutorId = this.form.tutor?.id || null
          const areaId = this.form.area?.id || null
  
          await axios.put(`http://localhost:3000/trabajos/${this.trabajo.id}`, {
            titulo: this.form.titulo,
            estudiante: this.form.estudiante,
            descripcion: this.form.descripcion,
            tutorId,
            areaId
          })
  
          this.mostrarNotificacion('Treball actualitzat correctament', 'success')
          this.$emit('actualizado')
        } catch (error) {
          console.error('Error al actualizar trabajo:', error)
          this.mostrarNotificacion('Error al actualitzar el treball', 'error')
        }
      },
      cancelarEdicion() {
        this.$emit('cancelar')
      },
      customLabel(option) {
        return option.nombre
      },
      mostrarNotificacion(mensaje, tipo) {
        this.notificacion.mostrar = true
        this.notificacion.mensaje = mensaje
        this.notificacion.tipo = tipo
  
        setTimeout(() => {
          this.notificacion.mostrar = false
        }, 3000)
      }
    }
  }
  </script>
  