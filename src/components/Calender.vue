<template>
  <BackHomeLink />
  <div class="calendar">
    <div class="nav">
      <button @click="prevMonth">＜ 前の月</button>
      <h2>{{ currentYear }}年{{ currentMonth }}月</h2>
      <button @click="nextMonth">次の月 ＞</button>
    </div>
    <div class="grid">
      <div class="day header" v-for="d in weekDays" :key="d">{{ d }}</div>
      <div v-for="n in blankDays" :key="'b' + n" class="day empty"></div>
      <div
        v-for="day in daysInMonth"
        :key="day"
        class="day"
        :class="{
          'is-today': isToday(day),
          'has-record': getCategoriesForDay(day).length > 0
        }"
        @click="showDetails(day)"
      >
        <span class="day-number">
          {{ day }}
        </span>
        <div class="bars-container">
          <span
            v-for="cat in getCategoriesForDay(day)"
            :key="cat.name"
            class="category-bar"
            :style="{ backgroundColor: cat.color }"
          ></span>
        </div>
      </div>
    </div>

    <div v-if="selectedDay" class="details-section">
      <h3>{{ currentYear }}年{{ currentMonth }}月{{ selectedDay }}日の記録</h3>
      <ul class="details-list">
        <li v-for="r in dayRecords" :key="r.id" class="detail-item">
          <span class="category-dot" :style="{ backgroundColor: getCategoryColor(r.category, r.type) }"></span>
          <span class="detail-name">[{{ r.category }}] {{ r.name }}</span>
          <span class="detail-amount" :class="r.type === '収入' ? 'income' : 'expense'">
            {{ r.amount.toLocaleString() }}円
          </span>
        </li>
        <li v-if="dayRecords.length === 0" class="no-record">記録はありません</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import BackHomeLink from '../components/BackHome.vue';

const now = new Date();
const currentYear = ref(now.getFullYear());
const currentMonth = ref(now.getMonth() + 1);

const weekDays = ['日', '月', '火', '水', '木', '金', '土'];
const records = ref([]);
const categories = ref({ 支出: [], 収入: [] });
const selectedDay = ref(null);
const daysInMonth = ref(0);
const blankDays = ref([]);

const updateCalendar = () => {
  const year = currentYear.value;
  const month = currentMonth.value;
  daysInMonth.value = new Date(year, month, 0).getDate();
  const firstDay = new Date(year, month - 1, 1).getDay();
  blankDays.value = Array(firstDay).fill(null);
};

const prevMonth = () => {
  if (currentMonth.value === 1) { currentMonth.value = 12; currentYear.value -= 1; } 
  else { currentMonth.value -= 1; }
  selectedDay.value = null;
};

const nextMonth = () => {
  if (currentMonth.value === 12) { currentMonth.value = 1; currentYear.value += 1; } 
  else { currentMonth.value += 1; }
  selectedDay.value = null;
};

watch([currentYear, currentMonth], updateCalendar);

onMounted(() => {
  records.value = JSON.parse(localStorage.getItem('kakeibo-records') || '[]');
  const catData = localStorage.getItem('kakeibo-categories');
  if (catData) {
    categories.value = JSON.parse(catData);
  }
  updateCalendar();
});

const getJSTDate = () => new Date(Date.now() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000));

const isToday = (day) => {
  const today = getJSTDate();
  return currentYear.value === today.getFullYear() &&
         currentMonth.value === today.getMonth() + 1 &&
         day === today.getDate();
};

const getCategoryColor = (categoryName, type) => {
  const categoryType = type || '支出';
  const category = categories.value[categoryType]?.find(c => c.name === categoryName);
  return category ? category.color : '#cccccc';
};

const getCategoriesForDay = (day) => {
  const dateStr = `${currentYear.value}-${String(currentMonth.value).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const dayRecords = records.value.filter(r => r.date === dateStr);
  if (!dayRecords.length) return [];
  const uniqueCategoryNames = [...new Set(dayRecords.map(r => r.category))];
  return uniqueCategoryNames.map(name => {
    const record = dayRecords.find(r => r.category === name);
    return { name: name, color: getCategoryColor(name, record.type) };
  }).slice(0, 4); // 表示するバーは最大4つまでに制限
};

const showDetails = (day) => {
  selectedDay.value = day;
};

const dayRecords = computed(() => {
  if (!selectedDay.value) return [];
  const d = `${currentYear.value}-${String(currentMonth.value).padStart(2, '0')}-${String(selectedDay.value).padStart(2, '0')}`;
  return records.value.filter(r => r.date === d);
});
</script>

<style scoped>
.calendar {
  padding: 2rem; max-width: 800px; margin: 0 auto;
  background-color: #fff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}
.nav {
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;
}
.nav button {
  padding: 0.5rem 1rem; background-color: #f5f5f5;
  border: 1px solid #ddd; color: #333;
  border-radius: 6px; cursor: pointer; transition: 0.3s;
}
.nav button:hover { background-color: #e0e0e0; }
.grid {
  display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.5rem;
}
.day {
  border-radius: 8px; text-align: center; padding: 0.5rem 0.2rem;
  cursor: pointer; position: relative; transition: background-color 0.2s;
  display: flex; flex-direction: column; justify-content: space-between; min-height: 80px;
  background-color: #fff; border: 1px solid #f0f0f0;
}
.day:hover {
  background-color: #f5f5f5;
}
.day.header {
  font-weight: bold; background-color: transparent; border: none; min-height: auto;
}
.day.empty {
  border: none; background: transparent; cursor: default;
}
.day.has-record {
  background-color: #eeeeee; /* マス目自体を鼠色にする */
}
.day.has-record:hover {
  background-color: #e0e0e0;
}
h2 {
  text-align: center; margin: 0 1rem; font-size: 1.5rem;
}
h3 {
  margin-bottom: 1rem;
}
.day-number {
  padding: 2px 0;
}
.day.is-today .day-number {
  font-weight: bold; /* 今日の日付は太字にするだけ */
}
.bars-container {
  display: flex; gap: 2px; height: 5px; margin: 0.3rem auto 0; padding: 0 4px;
}
.category-bar {
  flex-grow: 1; border-radius: 2px;
}
.details-section {
  margin-top: 2rem; border-top: 1px solid #eee; padding-top: 1.5rem;
}
.details-list {
  list-style: none; padding: 0;
}
.detail-item {
  display: flex; align-items: center; padding: 0.5rem; border-radius: 6px;
}
.detail-item:nth-child(odd) {
  background-color: #f9f9f9;
}
.category-dot {
  width: 12px; height: 12px;
  border-radius: 50%; margin-right: 0.8rem; flex-shrink: 0;
}
.detail-name {
  flex-grow: 1;
}
.detail-amount {
  font-weight: bold;
}
.detail-amount.income {
  color: #198754;
}
.detail-amount.expense {
  color: #dc3545;
}
.no-record {
  color: #888;
}
</style>