<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'

interface Tutor {
  id: number
  nomeTutor: string
}

interface Pet {
  id: number
  nomePet: string
}

interface Agendamento {
  id?: number
  data: string
  servico: string
  tutorId: number | null
  petId: number | null
  nomePet?: string
  nomeTutor?: string
}

const agendamentos = ref<Agendamento[]>([])
const tutores = ref<Tutor[]>([])
const pets = ref<Pet[]>([])
const carregando = ref(false)
const erro = ref('')

const novoAgendamento = reactive<Agendamento>({
  data: '',
  servico: '',
  tutorId: null,
  petId: null
})

// Porta ajustada para 5017 conforme o seu localhost
const API_BASE = 'http://localhost:5017/api'

const buscarAgendamentos = async () => {
  carregando.value = true
  erro.value = ''
  try {
    const response = await fetch(`${API_BASE}/Agendamento`)
    if (!response.ok) throw new Error('Erro ao carregar lista de agendamentos.')
    agendamentos.value = await response.json()
  } catch (err) {
    if (err instanceof Error) erro.value = err.message
  } finally {
    carregando.value = false
  }
}

const buscarTutoresEPets = async () => {
  try {
    const [resTutores, resPets] = await Promise.all([
      fetch(`${API_BASE}/Tutor`),
      fetch(`${API_BASE}/Pets`)
    ])

    if (resTutores.ok) tutores.value = await resTutores.json()
    if (resPets.ok) pets.value = await resPets.json()
  } catch (err) {
    console.error('Erro ao carregar tutores e pets.')
  }
}

const cadastrarAgendamento = async () => {
  carregando.value = true
  erro.value = ''
  try {
    const response = await fetch(`${API_BASE}/Agendamento`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoAgendamento)
    })

    if (!response.ok) {
      const msg = await response.text()
      throw new Error(msg || 'Erro ao cadastrar agendamento.')
    }

    novoAgendamento.data = ''
    novoAgendamento.servico = ''
    novoAgendamento.tutorId = null
    novoAgendamento.petId = null
    await buscarAgendamentos()
  } catch (err) {
    if (err instanceof Error) erro.value = err.message
  } finally {
    carregando.value = false
  }
}

const deletarAgendamento = async (id?: number) => {
  if (!id || !confirm('Deseja realmente cancelar este agendamento?')) return

  try {
    const response = await fetch(`${API_BASE}/Agendamento/${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Erro ao deletar agendamento.')
    await buscarAgendamentos()
  } catch (err) {
    if (err instanceof Error) erro.value = err.message
  }
}

onMounted(() => {
  buscarAgendamentos()
  buscarTutoresEPets()
})
</script>

<template>
  <div class="page-container">
    <h2>Gestão de Agendamentos</h2>

    <div class="card">
      <h3>Cadastrar Novo Agendamento</h3>
      <form @submit.prevent="cadastrarAgendamento">
        <div class="form-group">
          <label for="data">Data e Hora</label>
          <input type="datetime-local" id="data" v-model="novoAgendamento.data" required />
        </div>

        <div class="form-group">
          <label for="servico">Serviço</label>
          <input type="text" id="servico" v-model="novoAgendamento.servico" placeholder="Ex: Consulta, Vacina" required />
        </div>

        <div class="form-group">
          <label for="tutorId">Tutor</label>
          <select id="tutorId" v-model="novoAgendamento.tutorId" required>
            <option :value="null" disabled>Selecione um Tutor</option>
            <option v-for="t in tutores" :key="t.id" :value="t.id">
              {{ t.nomeTutor }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="petId">Pet</label>
          <select id="petId" v-model="novoAgendamento.petId" required>
            <option :value="null" disabled>Selecione um Pet</option>
            <option v-for="p in pets" :key="p.id" :value="p.id">
              {{ p.nomePet }}
            </option>
          </select>
        </div>

        <button type="submit" :disabled="carregando">
          {{ carregando ? 'Salvando...' : 'Cadastrar Agendamento' }}
        </button>
      </form>
    </div>

    <p v-if="erro" style="color: red; margin-top: 15px;">{{ erro }}</p>

    <div class="card" style="margin-top: 20px;">
      <h3>Agendamentos Cadastrados</h3>
      <p v-if="carregando && agendamentos.length === 0">Carregando...</p>

      <table v-if="agendamentos.length > 0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Data e Hora</th>
            <th>Serviço</th>
            <th>Pet</th>
            <th>Tutor</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="agt in agendamentos" :key="agt.id">
            <td>{{ agt.id }}</td>
            <td>{{ new Date(agt.data).toLocaleString('pt-BR') }}</td>
            <td>{{ agt.servico }}</td>
            <td>{{ agt.nomePet ?? agt.petId }}</td>
            <td>{{ agt.nomeTutor ?? agt.tutorId }}</td>
            <td>
              <button class="btn-danger" @click="deletarAgendamento(agt.id)">Excluir</button>
            </td>
          </tr>
        </tbody>
      </table>

      <p v-else-if="!carregando">Nenhum agendamento encontrado.</p>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  max-width: 800px;
  margin: 20px auto;
}

h2, h3 {
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

.form-group input, .form-group select {
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

table, th, td {
  border: 1px solid #ddd;
}

th, td {
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
  color: #333;
}
</style>