<template>
  <section class="character-section">
    <h2 v-if="username">{{ username }}さん、こんにちは！</h2>
    <h2 v-else>こんにちは！</h2>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const username = ref('')

onMounted(() => {
  username.value = localStorage.getItem('kakeibo-username') || ''
})
</script>

<style scoped>
.character-section {
  text-align: center;
  font-size: 1.5rem;
  margin-top: 1rem;
}
</style>
