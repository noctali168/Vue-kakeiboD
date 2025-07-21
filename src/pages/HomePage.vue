<template>
  <div class="container">
    <Header />
    <CharacterSection />
    <Kuji />

    <SummaryArea
      :expense-data="monthlyExpensesByCategory"
      :income-data="monthlyIncomesByCategory"
      :categories="categories"
    />

    <NavCards />
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

// --- グラフ用のデータを準備 ---
const records = ref([]);
const categories = ref({ 支出: [], 収入: [] });

const getJSTDate = () => new Date(Date.now() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000));

// 今月の支出をカテゴリ別に集計
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

// ★★★ 今月の収入をカテゴリ別に集計するロジックを追加 ★★★
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
  padding: 2rem;
}
</style>