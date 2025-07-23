<template>
  <div class="kakeibo-app">
    <GoalTracker
      :goal-amount="goalAmount"
      :total-income="monthlyIncome"
      :total-expense="monthlyExpense"
      @update:goal="updateGoalAmount"
      @update:achievement-rate="currentAchievementRate = $event"
    />
    <div class="view-selector">
      <button @click="visibleSection = 'transactions'" :class="{ active: visibleSection === 'transactions' }">
        日々の記録
      </button>
      <button @click="visibleSection = 'recurring'" :class="{ active: visibleSection === 'recurring' }">
        定期的な項目の管理
      </button>
      <button @click="visibleSection = 'categories'" :class="{ active: visibleSection === 'categories' }">
        カテゴリの管理
      </button>
    </div>
    <div v-show="visibleSection === 'transactions'">
      <TransactionManager
        :records="records"
        :record-to-edit="recordToEdit"
        :categories="categories"
        @submit="handleTransactionSubmit"
        @delete="deleteTransaction"
        @edit="handleTransactionEdit"
        @cancel-edit="recordToEdit = null"
      />
    </div>
    <div v-show="visibleSection === 'recurring'">
      <RecurringManager
        :recurring-items="recurringItems"
        :records="records"
        @update="updateRecurringItems"
        @log="logRecurringItem"
      />
    </div>
    <div v-show="visibleSection === 'categories'">
      <CategoryManager
        :categories="categories"
        @update="updateCategories"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import CategoryManager from '../components/CategoryManager.vue';
import RecurringManager from '../components/RecurringManager.vue';
import TransactionManager from '../components/TransactionManager.vue';
import GoalTracker from '../components/GoalTracker.vue';

const visibleSection = ref('transactions');
const recurringItems = ref([]);
const records = ref([]);
const recordToEdit = ref(null);
const categories = ref({
  支出: [
    { name: '食費', color: '#FF6384' }, { name: '交通費', color: '#36A2EB' },
    { name: '日用品', color: '#FFCE56' }, { name: '固定費', color: '#4BC0C0' },
    { name: 'その他', color: '#C9CBCF' },
  ],
  収入: [ { name: '給与', color: '#9966FF' }, { name: '副業', color: '#FF9F40' } ]
});
const goalAmount = ref(50000);
const currentAchievementRate = ref(0);

const getJSTDate = () => new Date(Date.now() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000));
const monthlyIncome = computed(() => {
  const currentMonth = getJSTDate().toISOString().slice(0, 7);
  return records.value.filter(r => r.date.startsWith(currentMonth) && r.type === '収入').reduce((sum, record) => sum + (Number(record.amount) || 0), 0);
});
const monthlyExpense = computed(() => {
  const currentMonth = getJSTDate().toISOString().slice(0, 7);
  return records.value.filter(r => r.date.startsWith(currentMonth) && r.type === '支出').reduce((sum, record) => sum + (Number(record.amount) || 0), 0);
});
const updateRecurringItems = (updatedItems) => { recurringItems.value = updatedItems; localStorage.setItem('kakeibo-recurring', JSON.stringify(updatedItems)); };
const updateRecords = (updatedRecords) => { records.value = updatedRecords.sort((a, b) => new Date(b.date) - new Date(a.date)); localStorage.setItem('kakeibo-records', JSON.stringify(records.value)); };
const updateCategories = (updatedCategories) => { categories.value = updatedCategories; localStorage.setItem('kakeibo-categories', JSON.stringify(updatedCategories)); };
const updateGoalAmount = (newGoal) => { goalAmount.value = newGoal; localStorage.setItem('kakeibo-goal', newGoal); };
const logRecurringItem = (item) => {
  // 定期的な項目は、ログした日付で記録されるべきなので、ここでは getJSTDate() を使う
  const newRecord = { id: `rec_${Date.now()}`, date: getJSTDate().toISOString().slice(0, 10), type: item.type, recurringId: item.id, name: item.name, amount: item.amount, category: '固定費' };
  updateRecords([newRecord, ...records.value]);
};

// ★ここを修正します★
const handleTransactionSubmit = (submittedRecord) => {
  let updatedRecords;
  if (submittedRecord.id) {
    // 既存レコードの更新
    updatedRecords = records.value.map(r => r.id === submittedRecord.id ? submittedRecord : r);
  } else {
    // 新規レコードの追加
    // TransactionManagerから渡された日付 (submittedRecord.date) をそのまま使用する
    updatedRecords = [{ ...submittedRecord, id: `rec_${Date.now()}` }, ...records.value];
  }
  updateRecords(updatedRecords);
  recordToEdit.value = null;
};

const deleteTransaction = (id) => { updateRecords(records.value.filter(r => r.id !== id)); };
const handleTransactionEdit = (record) => { recordToEdit.value = record; };
onMounted(() => {
  const savedGoal = localStorage.getItem('kakeibo-goal');
  if (savedGoal) goalAmount.value = Number(savedGoal);
  const catData = localStorage.getItem('kakeibo-categories');
  if (catData) categories.value = JSON.parse(catData);
  const recItemData = localStorage.getItem('kakeibo-recurring');
  if (recItemData) recurringItems.value = JSON.parse(recItemData);
  const recData = localStorage.getItem('kakeibo-records');
  if (recData) records.value = JSON.parse(recData);
});
</script>

<style>
body { background-color: #f0f2f5; font-family: sans-serif; }
/* ★ここを修正します★ */
.kakeibo-app {
  max-width: 900px;
  /* margin: 0 auto; はそのまま */
  margin: 0 auto;
  /* ヘッダーとの重なりを解消するためのpadding-top */
  /* ヘッダーの高さ（約72px）+ 必要に応じたコンテンツ上部の余白（例: 2rem）*/
  padding-top: calc(72px + 2rem);
  padding-left: 1rem; /* 左右のpaddingも追加 */
  padding-right: 1rem;
  padding-bottom: 2rem; /* 下のpaddingも追加 */
  
  box-sizing: border-box; /* paddingを含めてサイズが計算されるようにする */
}
.component-container { background-color: #fff; border: 1px solid #e0e0e0; border-radius: 8px; padding: 1.5rem; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
button { border: none; padding: 0.6rem 1.2rem; border-radius: 5px; cursor: pointer; color: white; font-weight: bold; transition: opacity 0.2s; }
button:hover { opacity: 0.85; }
input, select { padding: 0.8rem; border: 1px solid #ddd; border-radius: 8px; font-size: 1rem; width: 100%; }
</style>

<style scoped>
.view-selector { display: flex; margin-bottom: 2rem; border-radius: 8px; overflow: hidden; border: 1px solid #0d6efd; }
.view-selector button { flex-grow: 1; padding: 1rem; background-color: #fff; color: #0d6efd; border: none; font-size: 1.1rem; font-weight: bold; cursor: pointer; transition: all 0.2s; }
.view-selector button.active { background-color: #0d6efd; color: white; }
.view-selector button:not(.active):hover { background-color: #e7f1ff; }
</style>