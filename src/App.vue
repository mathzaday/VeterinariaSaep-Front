<script setup lang="ts">
import { RouterLink, RouterView, useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const realizarLogout = () => {
  localStorage.removeItem('user_token')
  router.push('/login')
}
</script>

<template>
  <div id="app" class="layout-container">
    <nav class="menu">
      <RouterLink to="/login">Login</RouterLink>
      <RouterLink to="/tutores">Tutores</RouterLink>
      <RouterLink to="/pets">Pets</RouterLink>
      <RouterLink to="/agendamentos">Agendamentos</RouterLink>
      
      <button 
        v-if="route.path !== '/login'" 
        @click="realizarLogout" 
        class="btn-logout"
      >
        Sair
      </button>
    </nav>
    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.menu {
  display: flex;
  align-items: center;
}

.btn-logout {
  margin-left: auto;
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-logout:hover {
  background-color: #bd2130;
}
</style>