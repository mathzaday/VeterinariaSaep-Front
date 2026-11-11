<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'

interface Tutor {
  id?: number
  nomeTutor: string
  cpfTutor: string
}

const tutores = ref<Tutor[]>([])
const carregando = ref(false)
const erro = ref('')

const novoTutor = reactive<Tutor>({
  nomeTutor: '',
  cpfTutor: '',
})

const API_BASE = 'http://localhost:5017/api'

const buscarTutores = async () => {
  carregando.value = true
  erro.value = ''
  try {
    const response = await fetch(`${API_BASE}/Tutor`)
    if (!response.ok) throw new Error('Erro ao carregar lista de tutores.')
    tutores.value = await response.json()
  } catch (err) {
    if (err instanceof Error) erro.value = err.message
  } finally {
    carregando.value = false
  }
}

const cadastrarTutor = async () => {
  carregando.value = true
  erro.value = ''
  try {
    const response = await fetch(`${API_BASE}/Tutor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoTutor),
    })

    if (!response.ok) throw new Error('Erro ao cadastrar tutor.')

    novoTutor.nomeTutor = ''
    novoTutor.cpfTutor = ''
    await buscarTutores()
  } catch (err) {
    if (err instanceof Error) erro.value = err.message
  } finally {
    carregando.value = false
  }
}

const deletarTutor = async (id?: number) => {
  if (!id || !confirm('Deseja realmente remover este tutor?')) return

  try {
    const response = await fetch(`${API_BASE}/Tutor/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) throw new Error('Erro ao deletar tutor.')
    await buscarTutores()
  } catch (err) {
    if (err instanceof Error) erro.value = err.message
  }
}

onMounted(() => {
  buscarTutores()
})
</script>

<template>
  <div class="page-container">
    <h2>Gestão de Tutores</h2>

    <div class="card">
      <h3>Cadastrar Novo Tutor</h3>
      <form @submit.prevent="cadastrarTutor">
        <div class="form-group">
          <label for="nomeTutor">Nome</label>
          <input type="text" id="nomeTutor" v-model="novoTutor.nomeTutor" required />
        </div>

        <div class="form-group">
          <label for="cpfTutor">CPF</label>
          <input type="text" id="cpfTutor" v-model="novoTutor.cpfTutor" required />
        </div>

        <button type="submit" :disabled="carregando">
          {{ carregando ? 'Salvando...' : 'Cadastrar Tutor' }}
        </button>
      </form>
    </div>

    <p v-if="erro" style="color: red; margin-top: 15px">{{ erro }}</p>

    <div class="card" style="margin-top: 20px">
      <h3>Tutores Cadastrados</h3>
      <p v-if="carregando && tutores.length === 0">Carregando...</p>

      <table v-if="tutores.length > 0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>CPF Criptografado</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="tutor in tutores" :key="tutor.id">
            <td>{{ tutor.id }}</td>
            <td>{{ tutor.nomeTutor }}</td>
            <td
              style="
                max-width: 250px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              "
            >
              {{ tutor.cpfTutor }}
            </td>
            <td>
              <button class="btn-danger" @click="deletarTutor(tutor.id)">Excluir</button>
            </td>
          </tr>
        </tbody>
      </table>

      <p v-else-if="!carregando">Nenhum tutor encontrado.</p>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  max-width: 800px;
  margin: 20px auto;
}

h2,
h3 {
  margin-bottom: 15px;
}

.card {
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 4px;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
}

.form-group label {
  margin-bottom: 5px;
}

.form-group input,
.form-group select {
  padding: 8px;
  box-sizing: border-box;
}

button {
  padding: 8px 15px;
  cursor: pointer;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

table,
th,
td {
  border: 1px solid #ddd;
}

th,
td {
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
  color: #333;
}
</style>
