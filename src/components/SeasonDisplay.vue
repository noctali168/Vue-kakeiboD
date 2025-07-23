<template>
  <section class="season-display">
    <p>現在の季節：<strong>{{ season }}</strong></p>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const season = ref('')

function getSeason(month) {
  // 日本の季節：気象庁基準（暦ではない）
  if (month >= 3 && month <= 5) return '春'
  if (month >= 6 && month <= 8) return '夏'
  if (month >= 9 && month <= 11) return '秋'
  return '冬' // month: 12, 1, 2
}

onMounted(() => {
  const now = new Date()
  const month = now.getMonth() + 1 // getMonth() は 0〜11 なので +1
  season.value = getSeason(month)
})
</script>

<style scoped>
.season-display {
  text-align: center;
  margin: 1rem;
  font-size: 1.4rem;
}
strong {
  color: #2c3e50;
}
</style>