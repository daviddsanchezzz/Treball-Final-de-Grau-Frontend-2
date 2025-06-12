<template>
  <div class="reset-password-container">
    <h2>{{ $t('resetPasswordTitle') }}</h2>
    <form @submit.prevent="cambiarContrasenya">
      <div>
        <label for="password">{{ $t('newPassword') }}</label>
        <input v-model="password" type="password" id="password" required />
      </div>
      <div>
        <label for="confirmPassword">{{ $t('confirmPassword') }}</label>
        <input v-model="confirmPassword" type="password" id="confirmPassword" required />
      </div>
      <button type="submit" :disabled="loading">
        {{ $t('changePassword') }}
      </button>
    </form>
  </div>
</template>

<script>
import { useToast } from 'vue-toastification'

const toast = useToast()

export default {
  data() {
    return {
      password: '',
      confirmPassword: '',
      loading: false,
      token: this.$route.query.token,
    }
  },
  methods: {
    async cambiarContrasenya() {
      if (this.password !== this.confirmPassword) {
        toast.error(this.$t('passwordsDontMatch'))
        return
      }

      try {
        this.loading = true
        await this.$http.post('/api/reset-password', {
          token: this.token,
          password: this.password,
        })
        toast.success(this.$t('passwordChangedSuccess'))
      } catch (error) {
        toast.error(this.$t('passwordChangeError'))
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
