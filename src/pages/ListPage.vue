<template>
    <BackHomeLink />
    <div class="list">
    <h2>{{ year }}年{{ month }}月の記録</h2>
    <table v-if="filtered.length > 0">
      <thead>
        <tr>
          <th>日付</th><th>区分</th><th>品物</th><th>カテゴリ</th><th>金額</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in filtered" :key="r.id">
          <td>{{ r.date }}</td>
          <td>{{ r.type }}</td>
          <td>{{ r.name }}</td>
          <td>{{ r.category }}</td>
          <td>{{ r.amount }}円</td>
        </tr>
      </tbody>
    </table>
    <p v-else>この月のデータはありません。</p>
  </div>
</template>


<script setup>
import BackHomeLink from '../components/BackHome.vue'
import Header from '../components/Header.vue'
import { ref, onMounted, computed } from 'vue'

const records = ref([])
const year = new Date().getFullYear()
const month = new Date().getMonth() + 1 // 0-indexedなので+1

const filtered = computed(() => {
  return records.value.filter(r => {
    const [y, m] = r.date.split('-')
    return Number(y) === year && Number(m) === month
  })
})

onMounted(() => {
  const data = JSON.parse(localStorage.getItem('kakeibo-records') || '[]')
  records.value = data
})
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}
th, td {
  border: 1px solid #ccc;
  padding: 0.5rem;
  text-align: center;
}
th {
  background-color: #f0f0f0;
}
</style>

