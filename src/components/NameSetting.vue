<template>
  <div class="username-setting">
    <p>こんにちは、<strong>{{ currentName || '名無し' }}</strong>さん！</p>

    <form @submit.prevent="updateName">
      <label>
        名前を変更：
        <input v-model="newName" type="text" placeholder="新しい名前を入力" />
      </label>
      <button type="submit" :disabled="!newName.trim()">変更</button>
    </form>

    <p v-if="saved" class="saved-msg">✅ 名前を変更しました！</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const currentName = ref('')
const newName = ref('')
const saved = ref(false)

onMounted(() => {
  currentName.value = localStorage.getItem('kakeibo-username') || ''
})

const updateName = () => {
  const trimmedName = newName.value.trim()
  if (!trimmedName) return
  localStorage.setItem('kakeibo-username', trimmedName)
  currentName.value = trimmedName
  newName.value = ''
  saved.value = true
  setTimeout(() => (saved.value = false), 2000)
}
</script>

<style scoped>
.username-setting p {
  margin-bottom: 0.5rem;
}
form {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
input {
  flex: 1;
  padding: 0.5rem;
  font-size: 1rem;
}
button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
}
button:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}
.saved-msg {
  margin-top: 0.5rem;
  color: green;
  font-weight: bold;
}
</style>