<template>
  <div class="kakeibo-app">
    <div class="view-selector">
      <button @click="visibleSection = 'fixed'" :class="{ active: visibleSection === 'fixed' }">
        固定費の管理
      </button>
      <button @click="visibleSection = 'transactions'" :class="{ active: visibleSection === 'transactions' }">
        日々の記録
      </button>
    </div>

    <div v-if="visibleSection === 'fixed'">
      <FixedCostManager
        :fixed-costs="fixedCosts"
        @update="updateFixedCosts"
      />
    </div>

    <div v-if="visibleSection === 'transactions'">
      <TransactionManager
        :records="records"
        :record-to-edit="recordToEdit"
        @submit="handleTransactionSubmit"
        @delete="deleteTransaction"
        @edit="handleTransactionEdit"
        @cancel-edit="recordToEdit = null"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import FixedCostManager from '../components/FixedCostManager.vue';
import TransactionManager from '../components/TransactionManager.vue';

// --- データ（状態） ---
const visibleSection = ref('transactions');
const fixedCosts = ref([]);
const records = ref([]);
const recordToEdit = ref(null);

const getJSTDate = () => new Date(Date.now() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000));

// --- 更新ロジック ---
const updateFixedCosts = (updatedCosts) => {
  fixedCosts.value = updatedCosts;
  localStorage.setItem('kakeibo-fixed', JSON.stringify(updatedCosts));
};
const updateRecords = (updatedRecords) => {
  records.value = updatedRecords.sort((a, b) => new Date(b.date) - new Date(a.date));
  localStorage.setItem('kakeibo-records', JSON.stringify(records.value));
};

// --- ★定期的な記録を追加するロジック（修正後） ---
const processRecurringCosts = () => {
  const today = getJSTDate();
  const currentYearMonth = today.toISOString().slice(0, 7); // "YYYY-MM"
  const lastCheckMonth = localStorage.getItem('kakeibo-last-check-month');

  // 今月分が既にチェック済みなら、何もせずに処理を終了
  if (lastCheckMonth === currentYearMonth) {
    return;
  }

  const newRecords = [];
  // 現在の記録から、今月記録済みの固定費IDをリストアップ
  const loggedIdsThisMonth = new Set(
    records.value
      .filter(r => r.date && r.date.startsWith(currentYearMonth))
      .map(r => r.fixedCostId)
  );

  // 【月ごとのテンプレートをチェック】
  fixedCosts.value.forEach(cost => {
    if (cost.frequency === 'monthly' && !loggedIdsThisMonth.has(cost.id)) {
      newRecords.push({
        id: `rec_${cost.id}_${currentYearMonth}`,
        date: `${currentYearMonth}-01`, // 月の初日で記録
        type: cost.type,
        fixedCostId: cost.id,
        name: cost.name,
        amount: cost.amount,
        category: cost.category,
      });
    }
  });

  // 【年ごとのテンプレートをチェック】（今が1月の場合のみ）
  if (today.getMonth() + 1 === 1) {
    const currentYear = today.getFullYear();
    const loggedYearlyIds = new Set(
      records.value
        .filter(r => r.date && r.date.startsWith(String(currentYear)) && fixedCosts.value.find(c => c.id === r.fixedCostId)?.frequency === 'yearly')
        .map(r => r.fixedCostId)
    );

    fixedCosts.value.forEach(cost => {
      if (cost.frequency === 'yearly' && !loggedYearlyIds.has(cost.id)) {
        newRecords.push({
          id: `rec_${cost.id}_${currentYear}`,
          date: `${currentYear}-01-01`, // 年の初日で記録
          type: cost.type,
          fixedCostId: cost.id,
          name: cost.name,
          amount: cost.amount,
          category: cost.category,
        });
      }
    });
  }

  if (newRecords.length > 0) {
    updateRecords([...records.value, ...newRecords]);
    alert(`${newRecords.length}件の定期的な項目を自動で記録しました。`);
  }

  // 今回チェックした年月を保存
  localStorage.setItem('kakeibo-last-check-month', currentYearMonth);
};

// --- イベントハンドラ ---
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
const deleteTransaction = (id) => {
  updateRecords(records.value.filter(r => r.id !== id));
};
const handleTransactionEdit = (record) => {
  recordToEdit.value = record;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// --- 初期化 ---
onMounted(() => {
  const fcData = localStorage.getItem('kakeibo-fixed');
  if (fcData) fixedCosts.value = JSON.parse(fcData);
  const recData = localStorage.getItem('kakeibo-records');
  if (recData) records.value = JSON.parse(recData);

  // 起動時に定期的な項目のチェックを実行
  processRecurringCosts();
});
</script>

<style scoped>
.kakeibo-app { max-width: 800px; margin: 2rem auto; padding: 1rem; }
.view-selector { display: flex; margin-bottom: 2rem; border-radius: 8px; overflow: hidden; border: 1px solid #0d6efd; }
.view-selector button { flex-grow: 1; padding: 1rem; background-color: #fff; color: #0d6efd; border: none; font-size: 1.1rem; font-weight: bold; cursor: pointer; transition: all 0.2s; }
.view-selector button.active { background-color: #0d6efd; color: white; }
.view-selector button:not(.active):hover { background-color: #e7f1ff; }
</style>