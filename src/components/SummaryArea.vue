<template>
  <section class="summary-area">
    <div class="graph-placeholder">📊 円グラフ</div>
    
     <div class="summary-area">
    <h2>{{ year }}年{{ month }}月の収支</h2>
    <div class="summary">
      <p>💰 収入合計: {{ incomeTotal }} 円</p>
      <p>💸 支出合計: {{ expenseTotal }} 円</p>
      <p>📊 差額: {{ balance }} 円</p>
    </div>
  </div>

  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const records = ref([])
const year = new Date().getFullYear()
const month = new Date().getMonth() + 1

const filtered = computed(() => {
  return records.value.filter(r => {
    const [y, m] = r.date.split('-')
    return Number(y) === year && Number(m) === month
  })
})

const incomeTotal = computed(() =>
  filtered.value
    .filter(r => r.type === '収入')
    .reduce((sum, r) => sum + Number(r.amount), 0)
)

const expenseTotal = computed(() =>
  filtered.value
    .filter(r => r.type === '支出')
    .reduce((sum, r) => sum + Number(r.amount), 0)
)

const balance = computed(() => incomeTotal.value - expenseTotal.value)

onMounted(() => {
  const data = JSON.parse(localStorage.getItem('kakeibo-records') || '[]')
  records.value = data
})
</script>

<style scoped>
.graph-placeholder {
  height: 150px;
  border: 1px dashed #aaa;
  margin-bottom: 1rem;
}
.total {
  font-weight: bold;
  font-size: 1.4rem;
}
.summary-area {
  margin: 2rem;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.summary p {
  font-size: 1.1rem;
  margin: 0.5rem 0;
}
</style>
