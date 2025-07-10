<template>
  <BackHomeLink />
  <div class="calendar">
    <h2>{{ year }}年{{ month }}月のカレンダー</h2>
    <div class="grid">
      <div class="day header" v-for="d in weekDays" :key="d">{{ d }}</div>
      <div
        v-for="day in blankDays" :key="'b'+day"
        class="day empty"
      ></div>
      <div
        v-for="day in daysInMonth"
        :key="day"
        class="day"
        :class="{ hasData: hasEntry(day) }"
        @click="showDetails(day)"
      >
        {{ day }}
        <span v-if="hasEntry(day)">●</span>
      </div>
    </div>

    <div v-if="selectedDay">
      <h3>{{ year }}年{{ month }}月{{ selectedDay }}日の記録</h3>
      <ul>
        <li v-for="r in dayRecords" :key="r.id">
          {{ r.type }}：{{ r.name }}（{{ r.category }}） - {{ r.amount }}円
        </li>
        <li v-if="dayRecords.length === 0">記録なし</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import BackHomeLink from '../components/BackHome.vue'
import { ref, computed, onMounted } from 'vue'

const now = new Date()
const year = now.getFullYear()
const month = now.getMonth() + 1 // 1〜12

const daysInMonth = new Date(year, month, 0).getDate()
const firstDay = new Date(year, month - 1, 1).getDay() // 0:日〜6:土
const blankDays = Array(firstDay).fill(null)
const weekDays = ['日', '月', '火', '水', '木', '金', '土']

const records = ref([])
const selectedDay = ref(null)

onMounted(() => {
  records.value = JSON.parse(localStorage.getItem('kakeibo-records') || '[]')
})

const hasEntry = (day) => {
  const d = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  return records.value.some(r => r.date === d)
}

const showDetails = (day) => {
  selectedDay.value = day
}

const dayRecords = computed(() => {
  if (!selectedDay.value) return []
  const d = `${year}-${String(month).padStart(2, '0')}-${String(selectedDay.value).padStart(2, '0')}`
  return records.value.filter(r => r.date === d)
})
</script>

<style scoped>
.calendar {
  padding: 1rem;
}
.grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.day {
  border: 1px solid #ccc;
  text-align: center;
  padding: 1rem;
  cursor: pointer;
  position: relative;
}
.day.header {
  font-weight: bold;
  background: #f0f0f0;
}
.day.hasData {
  background: #e0f7fa;
}
.day.empty {
  border: none;
  background: transparent;
}
</style>
