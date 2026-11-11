<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const credenciais = reactive({
  email: '',
  senha: '',
})

const erroLogin = ref('')
const carregando = ref(false)

const API_BASE = 'http://localhost:5017/api'

const realizarLogin = async () => {
  carregando.value = true
  erroLogin.value = ''

  try {
    const response = await fetch(`${API_BASE}/Login/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: credenciais.email,
        senha: credenciais.senha,
      }),
    })

    if (!response.ok) {
      throw new Error('Falha na autenticação. Verifique suas credenciais.')
    }

    const dados = await response.json()
    localStorage.setItem('user_token', dados.token || 'autenticado')
    router.push('/schedules')
  } catch (erro) {
    if (erro instanceof Error) {
      erroLogin.value = erro.message
    } else {
      erroLogin.value = 'Ocorreu um erro desconhecido. Tente novamente.'
    }
  } finally {
    carregando.value = false
  }
}
</script>

<template> 
  <div class="login-wrapper">
    <div class="login-container">
      <h2>Veterinária SAEP</h2>
      
      <form @submit.prevent="realizarLogin">
        <div class="form-group">
          <label for="email">E-mail</label>
          <input 
            type="email" 
            id="email" 
            v-model="credenciais.email" 
            required
            placeholder="Digite seu e-mail..."
          />
        </div>

        <div class="form-group">
          <label for="senha">Senha</label>
          <input 
            type="password" 
            id="senha" 
            v-model="credenciais.senha" 
            required
            placeholder="Digite sua senha..."
          />
        </div>

        <button type="submit" :disabled="carregando">
          {{ carregando ? 'Entrando...' : 'Entrar' }}
        </button>

        <p v-if="erroLogin" style="color: red; margin-top: 10px;">{{ erroLogin }}</p>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 150px;
}

.login-container {
  width: 100%;
  max-width: 300px;
}

h2 {
  text-align: center;
  margin-bottom: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}

.form-group label {
  margin-bottom: 5px;
}

.form-group input {
  padding: 8px;
  box-sizing: border-box;
}

button {
  width: 100%;
  padding: 10px;
  cursor: pointer;
}
</style>