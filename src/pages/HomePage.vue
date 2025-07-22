<template>
  <div class="container">
    <Header />

    <div class="main-content-row">
      <div class="content-left card-container">
        <div class="card-inner character-block">
          <CharacterSection />
        </div>
        
        <div class="card-inner goal-summary-block">
          <div class="mini-goal-summary">
            <div class="summary-item goal-amount-display">
              <span class="label">目標金額</span>
              <span class="value">{{ goalAmount.toLocaleString() }} 円</span>
            </div>

            <div class="summary-item">
              <span class="label">現在の収支</span>
              <span class="value" :class="balance >= 0 ? 'income' : 'expense'">
                {{ balance.toLocaleString() }} 円
              </span>
            </div>
            <div class="summary-item text-right">
              <span class="label">達成率</span>
              <span class="value achievement">{{ achievementRate.toFixed(1) }} %</span>
            </div>
          </div>
        </div>

        <div class="card-inner kuji-block">
          <Kuji />
        </div>
      </div>

      <SummaryArea
        :expense-data="monthlyExpensesByCategory"
        :income-data="monthlyIncomesByCategory"
        :categories="categories"
        class="content-right"
      />
    </div>

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


const records = ref([]);
const categories = ref({
  支出: [
    { name: '食費', color: '#FF6384' }, { name: '交通費', color: '#36A2EB' },
    { name: '日用品', color: '#FFCE56' }, { name: '固定費', color: '#4BC0C0' },
    { name: 'その他', color: '#C9CBCF' },
  ],
  収入: [ { name: '給与', color: '#9966FF' }, { name: '副業', color: '#FF9F40' } ]
});

const goalAmount = ref(50000);

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

const monthlyIncome = computed(() => {
  const currentMonth = getJSTDate().toISOString().slice(0, 7);
  return records.value.filter(r => r.date.startsWith(currentMonth) && r.type === '収入').reduce((sum, record) => sum + (Number(record.amount) || 0), 0);
});

const monthlyExpense = computed(() => {
  const currentMonth = getJSTDate().toISOString().slice(0, 7);
  return records.value.filter(r => r.date.startsWith(currentMonth) && r.type === '支出').reduce((sum, record) => sum + (Number(record.amount) || 0), 0);
});

const balance = computed(() => monthlyIncome.value - monthlyExpense.value);

const achievementRate = computed(() => {
  if (goalAmount.value <= 0) return 0;
  return (balance.value / goalAmount.value) * 100;
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
  const savedGoal = localStorage.getItem('kakeibo-goal');
  if (savedGoal) {
    goalAmount.value = Number(savedGoal);
  }
});
</script>

<style scoped>
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: calc(72px + 2rem) 2rem 2rem;
  min-height: calc(100vh - 72px);
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

.content-left {
  flex: 1;
  min-width: 300px;
  margin-top: 0;
}

.card-container {
  background-color: #fff; /* 親の白い枠 */
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 0; /* 子のcard-innerがパディングを持つ */
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  box-sizing: border-box;
  display: flex;
  flex-direction: column; /* 子要素を縦に並べる */
  overflow: hidden; /* 角丸を効かせる */
}

/* 各セクションを囲む白い枠の共通スタイル */
.card-inner {
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0; /* 基本は下線あり */
  padding: 1.5rem; /* 内部パディング */
  box-sizing: border-box;
}
.card-inner:last-of-type { /* 最後の子要素の下線はなし */
  border-bottom: none;
}

/* インコの写真とコメントのブロック */
.character-block {
  /* .card-innerの共通スタイルを継承しつつ、必要に応じて調整 */
}

/* 目標金額サマリーのブロックのスタイル */
.goal-summary-block {
  /* .card-innerの共通スタイルを継承しつつ、必要に応じて調整 */
  border-bottom: none; /* ★ここを修正します★ 不要な下線を削除 */
}

/* くじ引きのブロックのスタイル */
.kuji-block {
  /* .card-innerの共通スタイルを継承しつつ、必要に応じて調整 */
  border-top: 1px solid #e0e0e0; /* ★ここを修正します★ 目標金額サマリーとの間に線を追加 */
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}


/* CharacterSectionのマージンとボーダーを調整 */
:deep(.character-section) {
  text-align: center;
  font-size: 1.5rem;
  margin-top: 0;
  margin-bottom: 0;
  padding-bottom: 1.5rem; /* インコと目標金額の間のパディング */
  border-bottom: 1px solid #e0e0e0; /* インコと目標金額の間に線 */
}
/* CharacterSection内のpタグのマージンも調整 */
:deep(.character-section p) {
    margin-top: 0.5rem;
    margin-bottom: 0;
}


.mini-goal-summary {
  margin-top: 1.5rem; /* CharacterSectionとmini-goal-summaryの間の余白を調整 */
  border-top: 1px solid #eee; /* CharacterSectionとの間に線を追加 */
  padding-top: 1rem;
  display: flex;
  justify-content: space-between;
  color: #2c3e50;
  flex-wrap: wrap;
}

.mini-goal-summary .summary-item {
  display: flex;
  flex-direction: column;
  flex: 1 1 45%;
  min-width: 120px;
  box-sizing: border-box;
  padding: 0.2rem 0;
}

.mini-goal-summary .summary-item.goal-amount-display {
  order: -1;
  flex: 1 1 100%;
  text-align: center;
  margin-bottom: 0.8rem;
}

.mini-goal-summary .summary-item.text-right {
  text-align: right;
}

.mini-goal-summary .label {
  font-size: 0.9em;
  opacity: 0.8;
}

.mini-goal-summary .value {
  font-size: 1.2em;
  font-weight: bold;
}

.mini-goal-summary .value.income {
  color: #1abc9c;
}
.mini-goal-summary .value.expense {
  color: #dc3545;
}
.mini-goal-summary .value.achievement {
  color: #1abc9c;
}


.content-right {
  flex: 1;
  min-width: 300px;
  margin-top: 0;
}

/* :deep()スタイルの一部は.card-inner内で調整するため、ここでは削除または上書き */
:deep(.season-display),
:deep(.monthly-rating) {
  text-align: center;
  margin-top: 0;
  margin-bottom: 0;
}

/* Kujiコンポーネント内部のスタイルを調整 */
:deep(.kuji-area) {
  margin-top: 0;
  text-align: center;
  width: 100%;
  padding: 0;
}
:deep(.kuji-area h2) {
  font-size: 1.4rem;
  margin-bottom: 1rem;
  color: #2c3e50;
}
:deep(.kuji-area button) {
  background-color: #ff6666;
  color: white;
  border: none;
  padding: 0.8rem 1.2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
:deep(.kuji-area button:hover) {
  background-color: #e53935;
}
:deep(.result-area) {
  margin-top: 1rem;
}
:deep(.result-text) {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}
:deep(.result-img) {
  width: 100px;
  height: 100px;
  object-fit: contain;
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

  /* card-inner のモバイルでのパディング調整 */
  .card-inner {
    padding: 1rem;
  }
  /* CharacterSectionはcard-innerのパディングを使うのでpaddingはリセット */
  :deep(.character-section) {
    padding: 0;
    padding-bottom: 1rem;
  }
  .mini-goal-summary {
    margin-top: 1rem;
    padding-top: 1rem;
  }
  .kuji-block {
    padding: 1rem;
  }

  .mini-goal-summary .summary-item {
    flex: 1 1 100%;
    text-align: center;
  }
  .mini-goal-summary .summary-item.goal-amount-display {
    text-align: center;
  }
}
</style>