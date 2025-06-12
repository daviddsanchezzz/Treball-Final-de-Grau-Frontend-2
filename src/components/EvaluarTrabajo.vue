<template>
  <div class="flex items-center justify-between">
    <h2 class="text-xl font-semibold text-gray-800">{{ $t('tituloEvaluacion') }}</h2>
  </div>

  <div>
    <h3 class="mt-4 text-lg font-semibold">{{ $t('titulo') }}: {{ titulo }}</h3>
    <p>{{ $t('descripcion') }}: {{ descripcion }}</p>
    <p>{{ $t('estudiante') }}: {{ estudiante }}</p>
    <p>{{ $t('tutor') }}: {{ nombreTutor }}</p>
  </div>

  <div v-if="estado" class="flex flex-row">
    {{ $t('estadoTrabajo') }}:
    <button
      :class="['ml-2 px-2 py-1 rounded text-white font-semibold text-xs', estadoClases(estado)]"
      @click="cambiarEstado()"
    >
      {{ estadoTexto(estado) }}
    </button>
  </div>

  <table class="min-w-full table-fixed border-collapse border border-black text-center text-sm my-4">
    <thead>
      <tr>
        <th colspan="2" class="border border-black px-2">A</th>
        <th colspan="2" class="border border-black px-2">B</th>
        <th colspan="2" class="border border-black px-2">C+</th>
        <th colspan="2" class="border border-black px-2">C-</th>
        <th colspan="3" class="border border-black px-2">D</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="border border-black px-2 py-1 font-bold n10">10</td>
        <td class="border border-black px-2 py-1 font-bold n9">9</td>
        <td class="border border-black px-2 py-1 font-bold n8">8</td>
        <td class="border border-black px-2 py-1 font-bold n7">7</td>
        <td class="border border-black px-2 py-1 font-bold n6 ">6</td>
        <td class="border border-black px-2 py-1 font-bold n5 ">5</td>
        <td class="border border-black px-2 py-1 font-bold n4">4</td>
        <td class="border border-black px-2 py-1 font-bold n3">3</td>
        <td class="border border-black px-2 py-1 font-bold n2">2</td>
        <td class="border border-black px-2 py-1 font-bolds n1">1</td>
        <td class="border border-black px-2 py-1 font-bold n0">0</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import api from '@/services/api'

export default {
  props: {
    titulo: String,
    descripcion: String,
    estudiante: String,
    estado: String,
    tutorId: Number,
  },
  data() {
    return {
      estados: ['PENDIENTE', 'EN_PROGRESO', 'FINALIZADO'],
      nombreTutor: '',
    };
  },
  methods: {
    estadoClases(estado) {
      const clases = {
        PENDIENTE: 'bg-yellow-500',
        EN_PROGRESO: 'bg-blue-500',
        FINALIZADO: 'bg-green-500',
      };
      return clases[estado] || 'bg-gray-500';
    },
    cambiarEstado() {
      const estadoIndex = this.estados.indexOf(this.estado);
      const siguienteEstado = this.estados[(estadoIndex + 1) % this.estados.length];
      this.$emit('cambiar-estado', siguienteEstado);
    },
    async obtenerNombreTutor() {
      try {
        const tutorRes = await api.get(`/usuarios/${this.tutorId}`);
        this.nombreTutor = tutorRes.data.nombre;
      } catch (error) {
        console.error("Error al cargar datos de tutor:", error);
      }
    },
    estadoTexto(estado) {
      const textos = {
        'PENDIENTE': this.$t('pendiente'),
        'EN_PROGRESO': this.$t('en_progreso'),
        'FINALIZADO': this.$t('finalizado'),
      }
      return textos[estado] || 'Desconegut'
    },

  },
  mounted() {
    this.obtenerNombreTutor();
  }
};
</script>
