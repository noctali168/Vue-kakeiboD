<template>
  <div class="kakeibo-app">
    <GoalTracker
      :goal-amount="goalAmount"
      :total-income="monthlyIncome"
      :total-expense="monthlyExpense"
      @update:goal="updateGoalAmount"
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

    <div v-if="visibleSection === 'transactions'">
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
    <div v-if="visibleSection === 'recurring'">
      <RecurringManager
        :recurring-items="recurringItems"
        :records="records"
        @update="updateRecurringItems"
        @log="logRecurringItem"
      />
    </div>
    <div v-if="visibleSection === 'categories'">
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

// --- データ（状態） ---
const visibleSection = ref('transactions');
const recurringItems = ref([]);
const records = ref([]);
const recordToEdit = ref(null);
const categories = ref({ /* (変更なし) */ });
const goalAmount = ref(50000);

const getJSTDate = () => new Date(Date.now() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000));

// --- ★★★ ここからが修正点 ★★★ ---
const monthlyIncome = computed(() => {
  const currentMonth = getJSTDate().toISOString().slice(0, 7);
  return records.value
    .filter(r => r.date.startsWith(currentMonth) && r.type === '収入')
    // ★変更点: record.amount が数値でない場合も考慮し、安全に合計する
    .reduce((sum, record) => sum + (Number(record.amount) || 0), 0);
});

const monthlyExpense = computed(() => {
  const currentMonth = getJSTDate().toISOString().slice(0, 7);
  return records.value
    .filter(r => r.date.startsWith(currentMonth) && r.type === '支出')
    // ★変更点: record.amount が数値でない場合も考慮し、安全に合計する
    .reduce((sum, record) => sum + (Number(record.amount) || 0), 0);
});
// --- ★★★ ここまでが修正点 ★★★ ---


// --- 更新ロジック ---
const updateRecurringItems = (updatedItems) => { /* (変更なし) */ };
const updateRecords = (updatedRecords) => {
  records.value = updatedRecords.sort((a, b) => new Date(b.date) - new Date(a.date));
  localStorage.setItem('kakeibo-records', JSON.stringify(updatedRecords));
};
const updateCategories = (updatedCategories) => { /* (変更なし) */ };
const updateGoalAmount = (newGoal) => {
  goalAmount.value = newGoal;
  localStorage.setItem('kakeibo-goal', newGoal);
};

// --- イベントハンドラ ---
const logRecurringItem = (item) => {
  const newRecord = {
    id: `rec_${Date.now()}`, date: getJSTDate().toISOString().slice(0, 10),
    type: item.type, recurringId: item.id, name: item.name,
    amount: item.amount, category: '固定費',
  };
  updateRecords([newRecord, ...records.value]);
};
const handleTransactionSubmit = (submittedRecord) => {
  let updatedRecords;
  if (submittedRecord.id) {
    updatedRecords = records.value.map(r => r.id === submittedRecord.id ? submittedRecord : r);
  } else {
    updatedRecords = [{ ...submittedRecord, id: `rec_${Date.now()}`, date: getJSTDate().toISOString().slice(0, 10) }, ...records.value];
  }
  updateRecords(updatedRecords);
  recordToEdit.value = null;
};
const deleteTransaction = (id) => { updateRecords(records.value.filter(r => r.id !== id)); };
const handleTransactionEdit = (record) => { recordToEdit.value = record; };

// --- 初期化 ---
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

<style scoped>
/* (スタイルは変更なし) */
</style>