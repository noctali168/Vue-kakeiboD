<template>
  <div class="kakeibo-app">
    <AchievementNotifier :achievements="newlyUnlocked" />

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
      <button @click="visibleSection = 'achievements'" :class="{ active: visibleSection === 'achievements' }">
        アチーブメント
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
    <div v-show="visibleSection === 'achievements'">
      <AchievementList
        :all-achievements="allAchievements"
        :unlocked-ids="unlockedAchievements"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import CategoryManager from '../components/CategoryManager.vue';
import RecurringManager from '../components/RecurringManager.vue';
import TransactionManager from '../components/TransactionManager.vue';
import GoalTracker from '../components/GoalTracker.vue';
// --- ここから追加 ---
import AchievementList from '../components/AchievementList.vue';
import AchievementNotifier from '../components/AchievementNotifier.vue';
import { achievements as allAchievements } from '../lib/achievements.js';
// --- ここまで追加 ---

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

// --- ここから追加 ---
const unlockedAchievements = ref(new Set());
const newlyUnlocked = ref([]);
// --- ここまで追加 ---

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
  const newRecord = { id: `rec_${Date.now()}`, date: getJSTDate().toISOString().slice(0, 10), type: item.type, recurringId: item.id, name: item.name, amount: item.amount, category: '固定費' };
  updateRecords([newRecord, ...records.value]);
};

// --- ここから追加 ---
const checkAchievements = () => {
  const dataForCheck = {
    records: records.value,
    recurringItems: recurringItems.value,
    categories: categories.value,
    currentAchievementRate: currentAchievementRate.value,
  };

  const justUnlocked = [];
  for (const ach of allAchievements) {
    if (!unlockedAchievements.value.has(ach.id) && ach.condition(dataForCheck)) {
      unlockedAchievements.value.add(ach.id);
      justUnlocked.push(ach);
    }
  }

  if (justUnlocked.length > 0) {
    newlyUnlocked.value.push(...justUnlocked);
    localStorage.setItem('kakeibo-unlocked-achievements', JSON.stringify(Array.from(unlockedAchievements.value)));

    // 5秒後に通知を消す
    setTimeout(() => {
      newlyUnlocked.value = newlyUnlocked.value.filter(n => !justUnlocked.some(j => j.id === n.id));
    }, 5000);
  }
};

// 状態を監視してアチーブメントをチェック
watch([records, recurringItems, categories, currentAchievementRate], checkAchievements, { deep: true });
// --- ここまで追加 ---

const handleTransactionSubmit = (submittedRecord) => {
  let updatedRecords;
  if (submittedRecord.id) {
    updatedRecords = records.value.map(r => r.id === submittedRecord.id ? submittedRecord : r);
  } else {
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

  // --- ここから追加 ---
  // アチーブメントデータのロード
  const savedAchievements = localStorage.getItem('kakeibo-unlocked-achievements');
  if (savedAchievements) {
    unlockedAchievements.value = new Set(JSON.parse(savedAchievements));
  }
  // 初回ロード時にもチェックを実行
  checkAchievements();
  // --- ここまで追加 ---
});
</script>

<style>
body { background-color: #f0f2f5; font-family: sans-serif; }
.kakeibo-app {
  max-width: 900px;
  margin: 0 auto;
  padding-top: calc(72px + 2rem);
  padding-left: 1rem;
  padding-right: 1rem;
  padding-bottom: 2rem;
  box-sizing: border-box;
}
.component-container { background-color: #fff; border: 1px solid #e0e0e0; border-radius: 8px; padding: 1.5rem; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
button { border: none; padding: 0.6rem 1.2rem; border-radius: 5px; cursor: pointer; color: white; font-weight: bold; transition: opacity 0.2s; }
button:hover { opacity: 0.85; }
input, select { padding: 0.8rem; border: 1px solid #ddd; border-radius: 8px; font-size: 1rem; width: 100%; }
</style>

<style scoped>
.view-selector { display: flex; margin-bottom: 2rem; border-radius: 8px; overflow: hidden; border: 1px solid #0d6efd; }
.view-selector button { flex-grow: 1; padding: 1rem; background-color: #fff; color: #0d6efd; border: none; font-size: 1.1rem; font-weight: bold; cursor: pointer; transition: all 0.2s; }
/* ボタンが4つになったため、フォントサイズを少し調整 */
@media (min-width: 769px) {
  .view-selector button {
    font-size: 1.1rem;
  }
}
@media (max-width: 768px) {
  .view-selector {
    flex-direction: column;
  }
  .view-selector button {
    font-size: 1rem;
    border-bottom: 1px solid #0d6efd;
  }
  .view-selector button:last-child {
    border-bottom: none;
  }
}

.view-selector button.active { background-color: #0d6efd; color: white; }
.view-selector button:not(.active):hover { background-color: #e7f1ff; }
</style>