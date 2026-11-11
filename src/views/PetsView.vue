<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'

interface Tutor {
  id: number
  nomeTutor: string
}

interface Pet {
  id?: number
  nomePet: string
  especie: string
  raca: string
  tutorId: number | null
}

const pets = ref<Pet[]>([])
const tutores = ref<Tutor[]>([])
const carregando = ref(false)
const erro = ref('')

const novoPet = reactive<Pet>({
  nomePet: '',
  especie: '',
  raca: '',
  tutorId: null
})
const API_BASE = 'http://localhost:5017/api'

const buscarPets = async () => {
  carregando.value = true
  erro.value = ''
  try {
    const response = await fetch(`${API_BASE}/Pets`)
    if (!response.ok) throw new Error('Erro ao carregar lista de pets.')
    pets.value = await response.json()
  } catch (err) {
    if (err instanceof Error) erro.value = err.message
  } finally {
    carregando.value = false
  }
}

const buscarTutores = async () => {
  try {
    const response = await fetch(`${API_BASE}/Tutor`)
    if (response.ok) {
      tutores.value = await response.json()
    }
  } catch (err) {
    console.error('Erro ao carregar lista de tutores.')
  }
}

const cadastrarPet = async () => {
  carregando.value = true
  erro.value = ''
  try {
    const response = await fetch(`${API_BASE}/Pets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoPet)
    })

    if (!response.ok) throw new Error('Erro ao cadastrar pet.')

    novoPet.nomePet = ''
    novoPet.especie = ''
    novoPet.raca = ''
    novoPet.tutorId = null
    await buscarPets()
  } catch (err) {
    if (err instanceof Error) erro.value = err.message
  } finally {
    carregando.value = false
  }
}

const deletarPet = async (id?: number) => {
  if (!id || !confirm('Deseja realmente remover este pet?')) return

  try {
    const response = await fetch(`${API_BASE}/Pets/${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Erro ao deletar pet.')
    await buscarPets()
  } catch (err) {
    if (err instanceof Error) erro.value = err.message
  }
}

onMounted(() => {
  buscarPets()
  buscarTutores()
})
</script>

<template>
  <div class="page-container">
    <h2>Gestão de Pets</h2>

    <div class="card">
      <h3>Cadastrar Novo Pet</h3>
      <form @submit.prevent="cadastrarPet">
        <div class="form-group">
          <label for="nomePet">Nome do Pet</label>
          <input type="text" id="nomePet" v-model="novoPet.nomePet" required />
        </div>

        <div class="form-group">
          <label for="especie">Espécie</label>
          <input type="text" id="especie" v-model="novoPet.especie" required />
        </div>

        <div class="form-group">
          <label for="raca">Raça</label>
          <input type="text" id="raca" v-model="novoPet.raca" required />
        </div>

        <div class="form-group">
          <label for="tutorId">Tutor</label>
          <select id="tutorId" v-model="novoPet.tutorId" required>
            <option :value="null" disabled>Selecione um Tutor</option>
            <option v-for="t in tutores" :key="t.id" :value="t.id">
              {{ t.nomeTutor }} (ID: {{ t.id }})
            </option>
          </select>
        </div>

        <button type="submit" :disabled="carregando">
          {{ carregando ? 'Salvando...' : 'Cadastrar Pet' }}
        </button>
      </form>
    </div>

    <p v-if="erro" style="color: red; margin-top: 15px;">{{ erro }}</p>

    <div class="card" style="margin-top: 20px;">
      <h3>Pets Cadastrados</h3>
      <p v-if="carregando && pets.length === 0">Carregando...</p>

      <table v-if="pets.length > 0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Espécie</th>
            <th>Raça</th>
            <th>ID Tutor</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="pet in pets" :key="pet.id">
            <td>{{ pet.id }}</td>
            <td>{{ pet.nomePet }}</td>
            <td>{{ pet.especie }}</td>
            <td>{{ pet.raca }}</td>
            <td>{{ pet.tutorId }}</td>
            <td>
              <button class="btn-danger" @click="deletarPet(pet.id)">Excluir</button>
            </td>
          </tr>
        </tbody>
      </table>

      <p v-else-if="!carregando">Nenhum pet encontrado.</p>
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