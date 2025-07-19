<template>
  <section class="kuji-area">
    <h2>凶のくじ引きコーナー</h2>
    <button v-if="!hasDrawnToday" @click="drawKuji">くじを引く！</button>
    <p v-if="result" class="result">今日の結果：{{ result }}</p>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const result = ref('')
const hasDrawnToday = ref(false)

const kujiList = [
  '大吉', '中吉', '小吉', '吉', '末吉', '凶', '大凶'
]

function drawKuji() {
  const index = Math.floor(Math.random() * kujiList.length)
  result.value = kujiList[index]

  const today = new Date().toISOString().slice(0, 10)
  localStorage.setItem('kuji-last-date', today)
  localStorage.setItem('kuji-result', result.value)
  hasDrawnToday.value = true
}

onMounted(() => {
  const today = new Date().toISOString().slice(0, 10)
  const lastDate = localStorage.getItem('kuji-last-date')
  const savedResult = localStorage.getItem('kuji-result')

  if (lastDate === today && savedResult) {
    result.value = savedResult
    hasDrawnToday.value = true
  }
})
</script>

<style scoped>
.kuji-area {
  margin-top: 2rem;
  text-align: center;
}
button {
  background-color: #ff6666;
  color: white;
  border: none;
  padding: 0.8rem 1.2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}
button:hover {
  background-color: #ff3333;
}
.result {
  margin-top: 1rem;
  font-weight: bold;
  font-size: 1.5rem;
  color: #cc0000;
}
</style>
