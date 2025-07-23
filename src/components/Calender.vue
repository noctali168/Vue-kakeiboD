<template>
  <BackHomeLink />
  <div class="calendar">
    <div class="nav">
      <button @click="prevMonth">＜ 前の月</button>
      <div class="nav-center">
        <select v-model.number="currentYear">
          <option v-for="y in yearOptions" :key="y" :value="y">{{ y }}年</option>
        </select>
        <select v-model.number="currentMonth">
          <option v-for="m in 12" :key="m" :value="m">{{ m }}月</option>
        </select>
      </div>
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
const currentYearRaw = new Date().getFullYear();
const yearOptions = Array.from({ length: 6 }, (_, i) => currentYearRaw - 3 + i); // 例: 3年前〜2年後


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
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}
.nav button {
  padding: 0.5rem 1rem;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  color: #333;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.3s;
}
.nav button:hover {
  background-color: #e0e0e0;
}
.nav-center {
  display: flex;
  gap: 1.0rem;
  align-items: center;
}
.nav select {
  padding: 0.6rem 0.6rem;
  border-radius: 7px;
  border: 1px solid #ccc;
  background-color: white;
  font-size: 1rem;
  cursor: pointer;
  min-width: 6rem;
}
h2 {
  text-align: center;
  margin: 0 1rem;
  font-size: 1.8rem; /* タイトルを少し大きく */
  color: #2c3e50;
}
.grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem; /* セル間の間隔 */
}
.day {
  border-radius: 8px;
  text-align: center;
  padding: 0.5rem 0.2rem;
  cursor: pointer;
  position: relative;
  transition: background-color 0.2s;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 90px; /* セルの高さを少し高く */
  background-color: #ffffff; /* デフォルトの背景色 */
  border: 1px solid #e0e0e0; /* 細いボーダー */
  box-sizing: border-box; /* パディングとボーダーを幅に含める */
}
.day:hover {
  background-color: #f0f0f0; /* ホバー時の背景色を少し濃く */
}
.day.header {
  font-weight: bold;
  background-color: #f9f9f9; /* ヘッダーの背景色 */
  color: #555;
  border: none;
  min-height: auto;
  padding: 0.8rem 0; /* ヘッダーのパディング調整 */
}
.day.empty {
  border: none;
  background: transparent;
  cursor: default;
}

/* ★日付番号のスタイルを強化★ */
.day-number {
  font-size: 1.2em; /* 日付の数字を大きく */
  font-weight: bold; /* 太字 */
  color: #2c3e50; /* 日付の数字の色 */
  margin-bottom: 0.4rem; /* バーとの間隔 */
}

/* ★今日の日付の強調を改善★ */
.day.is-today {
  background-color: #e0f7fa; /* 明るい水色 */
  border: 2px solid #00bcd4; /* 青いボーダー */
  transform: scale(1.02); /* 少し拡大して強調 */
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.day.is-today .day-number {
  color: #00796b; /* 今日の日付の色を濃くする */
}
.day.is-today:hover {
  background-color: #b2ebf2;
}

/* ★記録のある日の強調を改善★ */
.day.has-record {
  background-color: #f0fbf0; /* 緑がかった薄い背景色 */
  border: 1px solid #a5d6a7; /* 薄い緑のボーダー */
}
.day.has-record:hover {
  background-color: #e6f6e6; /* ホバー時の背景色 */
}
.day.has-record.is-today {
  background-color: #e0f7fa; /* 今日かつ記録ありの場合は今日のスタイル優先 */
  border: 2px solid #00bcd4;
}

.bars-container {
  display: flex;
  gap: 2px;
  height: 6px; /* バーの高さを少し高く */
  margin: 0.3rem auto 0;
  padding: 0 4px;
  justify-content: center; /* バーを中央寄せ */
  align-items: flex-end; /* バーを下揃え */
  flex-wrap: wrap; /* バーが多すぎる場合に折り返す */
}
.category-bar {
  width: 10px; /* バーの幅を固定 */
  height: 100%; /* 親の高さに合わせる */
  border-radius: 2px;
  flex-shrink: 0; /* 幅を固定するため縮まないようにする */
}

.details-section {
  margin-top: 2.5rem; /* 上のマージンを大きく */
  border-top: 1px solid #eee;
  padding-top: 1.5rem;
}
.details-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.detail-item {
  display: flex;
  align-items: center;
  padding: 0.8rem 1rem; /* パディングを大きく */
  margin-bottom: 0.5rem; /* アイテム間のマージン */
  border-radius: 6px;
  background-color: #fefefe;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  font-size: 0.95rem; /* 文字サイズ調整 */
}
.detail-item:last-child {
  margin-bottom: 0;
}
.detail-item:nth-child(odd) {
  background-color: #f9f9f9;
}
.category-dot {
  width: 14px; /* ドットを大きく */
  height: 14px;
  border-radius: 50%;
  margin-right: 1rem; /* ドットとテキストの間隔を広げる */
  flex-shrink: 0;
}
.detail-name {
  flex-grow: 1;
  color: #333;
  font-weight: 500;
}
.detail-amount {
  font-weight: bold;
  font-size: 1.1em; /* 金額を強調 */
}
.detail-amount.income {
  color: #198754;
}
.detail-amount.expense {
  color: #dc3545;
}
.no-record {
  color: #888;
  text-align: center;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 6px;
}
</style>