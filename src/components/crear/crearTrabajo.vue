<template>
  <div class="space-y-4 mx-auto mt-8 p-6 bg-white rounded-xl shadow-md">
    <h2 class="text-2xl font-semibold text-gray-800 mb-4">{{$t('crearTreball')}}</h2>
    <form @submit.prevent="crearTrabajo">
      <div class="mb-4">
        <label class="block text-gray-700">{{$t('titulo')}}</label>
        <input
          v-model="titulo"
          type="text"
          class="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div class="mb-4">
        <label class="block text-gray-700">{{$t('descripcion')}}</label>
        <textarea
          v-model="descripcion"
          class="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        ></textarea>
      </div>

      <div class="mb-4">
        <label class="block text-gray-700">{{$t('estudiante')}}</label>
        <input
          v-model="estudiante"
          type="text"
          class="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div class="mb-4">
        <label class="block text-gray-700">{{$t('tutor')}}</label>
        <multiselect
          v-model="tutorId"
          :options="tutores"
          track-by="id"
          label="nombre"
          :placeholder="$t('seleccionarTutor')"
          required
        ></multiselect>
      </div>

      <div class="mb-4">
        <label class="block text-gray-700">{{$t('area')}}</label>
        <multiselect
          v-model="areaId"
          :options="areas"
          track-by="id"
          label="nombre"
          :placeholder="$t('seleccionarArea')"
          required
        ></multiselect>
      </div>

      <div class="flex justify-end space-x-4">
        <button
          class="btn-cancel"
          @click="cancelarCrear()"
        >
          {{ $t('cancel') }}
        </button>
        <button
          type="submit"
          class="btn-confirm"
        >
          {{ $t('crearTreball') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.min.css';
import { useToast } from 'vue-toastification'
import api from '@/services/api'

const toast = useToast()  

export default {
  components: {
    Multiselect
  },
  data() {
    return {
      titulo: '',
      descripcion: '',
      estudiante: '',
      tutorId: '',
      areaId: '',
      tutores: [],
      areas: []
    };
  },
  async mounted() {
    await this.cargarDatos();
  },
  methods: {
    async cargarDatos() {
      try {
        const [resTutores, resAreas] = await Promise.all([
          api.get('/usuarios'),
          api.get('/areas')
        ]);
        this.tutores = resTutores.data;
        this.areas = resAreas.data;
      } catch (error) {
        console.error('Error cargando datos:', error);
      }
    },
    async crearTrabajo() {
      try {
        // Obtener solo el ID de los objetos seleccionados
        const tutorId = this.tutorId ? this.tutorId.id : '';  // Acceder al id del objeto tutor
        const areaId = this.areaId ? this.areaId.id : '';  // Acceder al id del objeto área

        // Hacer la petición POST con los IDs
        await api.post('/trabajos', {
          titulo: this.titulo,
          descripcion: this.descripcion,
          estudiante: this.estudiante,
          tutorId: tutorId,
          areaId: areaId
        });

        this.titulo = '';
        this.descripcion = '';
        this.estudiante = '';
        this.tutorId = '';
        this.areaId = '';
        this.$emit('trabajoCreado')
        toast.success(this.$t('trabajoCreadoCorrectamente'))
      } catch (error) {
        console.error(error);
        toast.error(this.$t('errorCrearTrabajo'));
      }
    },
    cancelarCrear(){
      this.$emit('cancelar')
    }
  }
};
</script>

<style scoped>
/* Estilos opcionales para el formulario */
</style>
