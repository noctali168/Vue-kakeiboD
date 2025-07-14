<template>
  <div class="reset-area">
    <h3>データリセット</h3>
    <button @click="resetAll" class="btn-reset-all">
      🔄 全データをリセット（名前・固定費も含む）
    </button>
    <button @click="resetThisMonth" class="btn-reset-month">
      🗑️ 今月の入力データだけリセット（固定費・名前は残す）
    </button>
    <p v-if="message" class="message">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const message = ref('')

const resetAll = () => {
  if (confirm('本当に全データ（名前・固定費含む）を消しますか？')) {
    localStorage.clear()
    message.value = 'すべてのデータをリセットしました。'
    setTimeout(() => (message.value = ''), 3000)
    location.reload() // ページをリロードして反映
  }
}

const resetThisMonth = () => {
  if (!confirm('今月の入力データだけをリセットしますか？ 固定費・名前は残ります。')) return

  const records = JSON.parse(localStorage.getItem('kakeibo-records') || '[]')
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1

  // 今月以外のデータだけ残すフィルター
  const filtered = records.filter(r => {
    const [y, m] = r.date.split('-').map(Number)
    return !(y === year && m === month)
  })

  localStorage.setItem('kakeibo-records', JSON.stringify(filtered))
  message.value = '今月の入力データをリセットしました。'
  setTimeout(() => (message.value = ''), 3000)
  location.reload() // ページをリロードして反映
}
</script>

<style scoped>
.reset-area {
  margin-top: 1rem;
}
button {
  display: block;
  margin-bottom: 0.7rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border-radius: 5px;
  border: none;
  cursor: pointer;
}
.btn-reset-all {
  background-color: #e53935;
  color: white;
}
.btn-reset-month {
  background-color: #fbc02d;
  color: black;
}
button:hover {
  opacity: 0.9;
}
.message {
  color: green;
  font-weight: bold;
}
</style>
