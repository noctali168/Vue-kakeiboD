<template>
  <section class="kuji-area">
    <h2>凶のくじ引きコーナー</h2>
    <button @click="drawKuji">くじを引く！</button>
    <p v-if="result" class="result">結果：{{ result }}</p>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const result = ref('')

const kujiList = [
  '大吉',
  '中吉',
  '小吉',
  '吉',
  '末吉',
  '凶',
  '大凶'
]

function drawKuji() {
  // たまには凶が出る確率を上げたい場合はここで調整可能
  const index = Math.floor(Math.random() * kujiList.length)
  result.value = kujiList[index]
}
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
