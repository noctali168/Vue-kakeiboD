<template>
  <BackHome />
  <div class="notify-page">
    <h2>通知・設定</h2>

    <form @submit.prevent="saveName">
      <label>
        あなたの名前：
        <input v-model="username" type="text" placeholder="例: てつこ" />
      </label>
      <button type="submit">保存</button>
    </form>

    <p v-if="saved">✅ 名前を保存しました！</p>
  </div>
</template>

<script setup>
import BackHome from '../components/BackHome.vue'
import { ref, onMounted } from 'vue'

const username = ref('')
const saved = ref(false)

onMounted(() => {
  username.value = localStorage.getItem('kakeibo-username') || ''
})

const saveName = () => {
  localStorage.setItem('kakeibo-username', username.value)
  saved.value = true
  setTimeout(() => (saved.value = false), 2000)
}
</script>

<style scoped>
form {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
input {
  padding: 0.5rem;
  font-size: 1rem;
}
button {
  background-color: #4caf50;
  color: white;
  padding: 0.5rem;
  border: none;
  border-radius: 5px;
}
</style>
