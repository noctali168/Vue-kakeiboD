<template>
  <BackHomeLink />
  <div class="calendar">
    <div class="nav">
      <button @click="prevMonth">＜ 前の月</button>
      <h2>{{ currentYear }}年{{ currentMonth }}月のカレンダー</h2>
      <button @click="nextMonth">次の月 ＞</button>
    </div>
    <div class="grid">
      <div class="day header" v-for="d in weekDays" :key="d">{{ d }}</div>
      <div v-for="n in blankDays" :key="'b' + n" class="day empty"></div>
      <div
        v-for="day in daysInMonth"
        :key="day"
        class="day"
        :class="{ hasData: hasEntry(day) }"
        @click="showDetails(day)"
      >
        {{ day }}
        <span v-if="hasEntry(day)">⭐</span>
      </div>
    </div>

    <div v-if="selectedDay">
      <h3>{{ currentYear }}年{{ currentMonth }}月{{ selectedDay }}日の記録</h3>
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
import {ref, computed, watch, onMounted} from 'vue'
import BackHomeLink from '../components/BackHome.vue'

const now = new Date()
const currentYear = ref(now.getFullYear())
const currentMonth = ref(now.getMonth() + 1) //1～12

const weekDays = ['日', '月', '火', '水', '木', '金', '土']
const records = ref([])
const selectedDay = ref(null)

const daysInMonth = ref(0)
const blankDays = ref([])

const updateCalendar = () => {
  const year = currentYear.value
  const month = currentMonth.value
  daysInMonth.value = new Date(year, month, 0).getDate()
  const firstDay = new Date(year, month - 1, 1).getDay()
  blankDays.value = Array(firstDay).fill(null)
}

const prevMonth = () => {
  if (currentMonth.value === 1) {
    currentMonth.value = 12
    currentYear.value -= 1
  } else {
    currentMonth.value -= 1
  }
  selectedDay.value = null
}

const nextMonth = () => {
  if (currentMonth.value === 12) {
    currentMonth.value = 1
    currentYear.value += 1
  } else {
    currentMonth.value += 1
  }
  selectedDay.value = null
}

watch([currentYear, currentMonth], updateCalendar)

onMounted(() => {
  records.value = JSON.parse(localStorage.getItem('kakeibo-records') || '[]')
  updateCalendar()
})

const hasEntry = (day) => {
  const d = `${currentYear.value}-${String(currentMonth.value).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  return records.value.some(r => r.date === d)
}

const showDetails = (day) => {
  selectedDay.value = day
}

const dayRecords = computed(() => {
  if (!selectedDay.value) return []
  const d = `${currentYear.value}-${String(currentMonth.value).padStart(2, '0')}-${String(selectedDay.value).padStart(2, '0')}`;
  return records.value.filter(r => r.date === d)
})
</script>

<style scoped>
.calendar {
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
  background-color: #fefefe;
  border: 2px solid #ccc;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.nav button {
  padding: 0.5rem 1rem;
  background-color: #e3f2fd;
  border: 1px solid #90caf9;
  color: #1565c0;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.3s;
}
.nav button:hover {
  background-color: #bbdefb;
}

.grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.4rem;
  margin-bottom: 1.5rem;
}

.day {
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 8px;
  text-align: center;
  padding: 0.8rem 0;
  cursor: pointer;
  position: relative;
  transition: 0.2s;
}
.day:hover {
  background-color: #f1f8e9;
}
.day.header {
  font-weight: bold;
  background-color: #e0e0e0;
  color: #424242;
}
.day.hasData {
  background-color: #e1f5fe;
  border-color: #29b6f6;
}
.day.empty {
  border: none;
  background: transparent;
  cursor: default;
}

h2 {
  text-align: center;
  margin-bottom: 1rem;
  color: #333;
}

h3 {
  color: #333;
  margin-bottom: 0.5rem;
}

ul {
  padding-left: 1.2rem;
}
</style>