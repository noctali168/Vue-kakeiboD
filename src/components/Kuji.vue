<template>
  <section class="kuji-area">
    <h2>今日のくじ引きコーナー</h2>
    <button v-if="!hasDrawnToday" @click="drawKuji">くじを引く！</button>

    <div v-if="result" class="result-area">
      <div class="result-content">
        <p class="result-text">今日の結果：{{ result.label }}</p>
        <img :src="result.image" alt="くじ結果画像" class="result-img" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const result = ref(null)
const hasDrawnToday = ref(false)

const kujiList = [
  { label: '大吉', image: '/partyparrt-A.gif' },
  { label: '中吉', image: '/partyparrt-A.gif' },
  { label: '小吉', image: '/partyparrt-B.gif' },
  { label: '吉',    image: '/partyparrt-B.gif' },
  { label: '末吉', image: '/partyparrt-B.gif' },
  { label: '凶',    image: '/partyparrt-C.gif' },
  { label: '大凶', image: '/partyparrt-C.gif' }
]

function drawKuji() {
  const index = Math.floor(Math.random() * kujiList.length)
  result.value = kujiList[index]

  const today = new Date().toISOString().slice(0, 10)
  localStorage.setItem('kuji-last-date', today)
  localStorage.setItem('kuji-result-label', result.value.label)
  localStorage.setItem('kuji-result-image', result.value.image)
  hasDrawnToday.value = true
}

onMounted(() => {
  const today = new Date().toISOString().slice(0, 10)
  const lastDate = localStorage.getItem('kuji-last-date')
  const savedLabel = localStorage.getItem('kuji-result-label')
  const savedImage = localStorage.getItem('kuji-result-image')

  if (lastDate === today && savedLabel && savedImage) {
    result.value = {
      label: savedLabel,
      image: savedImage
    }
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
  background-color: #007702;
}

.result-area {
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
}

.result-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap; /* スマホなどで狭い時に縦に折り返す */
  justify-content: center;
}

.result-text {
  font-weight: bold;
  font-size: 1.5rem;
  color: #1e1e1e;
}

.result-img {
  width: 150px;
  height: auto;
  border-radius: 8px;
}
</style>
