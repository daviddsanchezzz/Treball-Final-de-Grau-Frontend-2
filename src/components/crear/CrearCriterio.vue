<template>
  <div class="max-w-[90%] mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow mt-8">
    <h2 class="text-xl font-semibold text-gray-800">{{ $t('crearCriterioTitulo') }}</h2>
    <form @submit.prevent="crearCriterio">
      <!-- Nombre del criterio -->
      <div class="mt-4">
        <label for="nombre" class="block text-sm font-semibold text-gray-700">{{ $t('crearCriterioNombreCriterio') }}
          <span class="text-red-500 ml-1">*</span>
        </label>
        <input
          v-model="nombre"
          type="text"
          id="nombre"
          class="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
          required
        />
      </div>

      <div class="mt-4">
        <label for="nombreEs" class="block text-sm font-semibold text-gray-700">{{ $t('crearCriterioNombreCriterioEs') }}</label>
        <input
          v-model="nombreEs"
          type="text"
          id="nombreEs"
          class="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div class="mt-4">
        <label for="nombreEn" class="block text-sm font-semibold text-gray-700">{{ $t('crearCriterioNombreCriterioEn') }}</label>
        <input
          v-model="nombreEn"
          type="text"
          id="nombreEn"
          class="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>

      <!-- Pesos por punto de control -->
      <div v-if="PuntosControl.length > 1" class="mt-4">
        <h3 class="text-sm font-semibold text-gray-700">{{ $t('crearCriterioPesosPuntosControl') }}</h3>
        <div class="flex flex-row justify-center">

          <div v-for="(punto) in PuntosControl" :key="punto.puntoControlId" class="mt-2 mx-8">
            <label :for="'peso-' + punto.puntoControlId" class="block text-sm text-gray-700">
              {{ punto.puntoControlNombre }}
            </label>
            <input
              v-model.number="pesosPuntosControl[punto.puntoControlId]"
              type="number"
              :id="'peso-' + punto.puntoControlId"
              class="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
        </div>
      </div>

      <!-- Botones -->
      <div class="mt-6 flex justify-end">
        <button type="button" @click="$emit('cerrar')" class="btn-cancel">
          {{ $t('cancel') }}
        </button>
        <button type="submit" class="btn-confirm">
          {{ $t('crearCriterioCrearCriterio') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import { useToast } from 'vue-toastification'

const toast = useToast()  

export default {
  props: {
    rubricaId: Number,
    PuntosControl: Array, // Recibe la lista completa de puntos de control
  },
  data() {
    return {
      nombre: '',
      nombreEs: '',
      nombreEn: '',
      pesosPuntosControl: {}, // Objeto para almacenar los pesos por punto de control
    };
  },
  methods: {
    async crearCriterio() {
      try {
        await axios.post('http://localhost:3000/criterios', {
          nombre: this.nombre,
          nombreEs: this.nombreEs,
          nombreEn: this.nombreEn,
          rubricaId: this.rubricaId,
          pesosPuntosControl: this.pesosPuntosControl, // Enviar pesos personalizados
        });

        toast.success(this.$t('crearCriterioExito'));
        this.$emit('cerrar');
      } catch (error) {
        console.error('Error al crear el criterio:', error);
        toast.error(this.$t('crearCriterioError'));
      }
    },
  },
  mounted() {
    console.log(this.PuntosControl)
    this.PuntosControl.forEach((punto) => {
      this.pesosPuntosControl[punto.puntoControlId] = 1;
    });
  },
};
</script>
