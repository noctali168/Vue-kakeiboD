<template>
  <div class="container">
    <Header />

    <div class="main-content-row">
      <CharacterSection class="content-left" />

      <SummaryArea
        :expense-data="monthlyExpensesByCategory"
        :income-data="monthlyIncomesByCategory"
        :categories="categories"
        class="content-right"
      />
    </div>

    <NavCards />
    <Kuji />
    <Calender />
    <Reminder />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import Header from '../components/Header.vue'
import CharacterSection from '../components/CharacterSection.vue'
import SummaryArea from '../components/SummaryArea.vue'
import NavCards from '../components/NavCards.vue'
import Kuji from '../components/Kuji.vue'
import Reminder from '../components/Reminder.vue'
import Calender from '../components/Calender.vue'

const records = ref([]);
const categories = ref({
  支出: [
    { name: '食費', color: '#FF6384' }, { name: '交通費', color: '#36A2EB' },
    { name: '日用品', color: '#FFCE56' }, { name: '固定費', color: '#4BC0C0' },
    { name: 'その他', color: '#C9CBCF' },
  ],
  収入: [ { name: '給与', color: '#9966FF' }, { name: '副業', color: '#FF9F40' } ]
});

const getJSTDate = () => new Date(Date.now() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000));

const monthlyExpensesByCategory = computed(() => {
  const currentMonth = getJSTDate().toISOString().slice(0, 7);
  const expenses = {};
  records.value
    .filter(r => r.date.startsWith(currentMonth) && r.type === '支出')
    .forEach(record => {
      const category = record.category;
      const amount = Number(record.amount) || 0;
      if (expenses[category]) {
        expenses[category] += amount;
      } else {
        expenses[category] = amount;
      }
    });
  return expenses;
});

const monthlyIncomesByCategory = computed(() => {
  const currentMonth = getJSTDate().toISOString().slice(0, 7);
  const incomes = {};
  records.value
    .filter(r => r.date.startsWith(currentMonth) && r.type === '収入')
    .forEach(record => {
      const category = record.category;
      const amount = Number(record.amount) || 0;
      if (incomes[category]) {
        incomes[category] += amount;
      } else {
        incomes[category] = amount;
      }
    });
  return incomes;
});

onMounted(() => {
  const recData = localStorage.getItem('kakeibo-records');
  if (recData) {
    records.value = JSON.parse(recData);
  }
  const catData = localStorage.getItem('kakeibo-categories');
  if (catData) {
    categories.value = JSON.parse(catData);
  }
});
</script>

<style scoped>
.container {
  max-width: 1400px;
  margin: 0 auto;
  /* ★ここを修正します★ */
  /* padding-topをさらに大きく調整します。例: ヘッダーの高さが約72px + 下の余白2rem + さらに少し余裕を持たせて10px */
  padding: calc(72px + 2rem + 10px) 2rem 2rem; /* 約104px + 2rem = 約136px */
  /* もしこの値でも足りない場合は、さらに値を大きくしてください */

  min-height: calc(100vh - 72px); /* ヘッダーの高さ分を引いた最小高さを確保 */
  box-sizing: border-box;
}

.main-content-row {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  align-items: flex-start;
  margin-bottom: 2rem;
  justify-content: center;
}

.content-left,
.content-right {
  flex: 1;
  min-width: 300px;
  margin-top: 0;
}

:deep(.character-section) {
  text-align: center;
  font-size: 1.5rem;
  margin-top: 0;
}

:deep(.season-display),
:deep(.monthly-rating) {
  text-align: center;
}

@media (max-width: 768px) {
  .main-content-row {
    flex-direction: column;
    align-items: center;
  }

  .content-left,
  .content-right {
    width: 100%;
    min-width: unset;
  }
}
</style>