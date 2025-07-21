<template>
  <div class="component-container">
    <h3>定期的な項目の管理</h3>
    <p>ここで登録した項目は、下のリストから手動で記録できます。</p>
    
    <div class="recurring-manager-grid">
      <form @submit.prevent="handleSubmit" class="recurring-form-grid"> <label>頻度：
          <select v-model="form.frequency">
            <option value="monthly">月ごと</option>
            <option value="yearly">年ごと</option>
          </select>
        </label>
        <label>区分：
          <select v-model="form.type" required>
            <option value="支出">支出</option>
            <option value="収入">収入</option>
          </select>
        </label>
        <label>名前：<input v-model="form.name" required placeholder="例: 家賃" /></label>
        <label>金額：<input type="number" v-model.number="form.amount" required /></label>
        <div class="form-actions">
          <button type="submit" class="add-button">{{ form.id ? '更新' : '追加' }}</button>
          <button v-if="form.id" @click="cancelEdit" type="button" class="cancel-button">ｷｬﾝｾﾙ</button>
        </div>
      </form>

      <div class="list-container recurring-list-area"> <h4>登録済みリスト</h4>
        <ul class="record-list" v-if="recurringItems.length > 0">
          <li class="record-item" v-for="item in recurringItems" :key="item.id">
            <div class="color-bar" :style="{ backgroundColor: item.type === '収入' ? '#9966FF' : '#4BC0C0' }"></div>
            <div class="record-content">
              <div class="record-header">
                <span class="record-name">[{{ item.frequency === 'yearly' ? '年' : '月' }}] {{ item.name }}</span>
                <span class="record-amount" :class="item.type === '収入' ? 'income' : 'expense'">
                  {{ item.amount.toLocaleString() }} 円
                </span>
              </div>
            </div>
            <div class="record-actions">
              <button @click="$emit('log', item)" :disabled="isLogged(item)" class="log-button">
                {{ isLogged(item) ? '記録済み ✔️' : '記録する' }}
              </button>
              <button @click="handleEdit(item)" class="edit-button">✏️</button>
              <button @click="deleteItem(item.id)" class="delete-button">🗑️</button>
            </div>
          </li>
        </ul>
        <p v-else>まだ定期的な項目がありません。</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue' // onMounted 追加
const props = defineProps({
  recurringItems: { type: Array, required: true },
  records: { type: Array, required: true }
});
const emit = defineEmits(['update', 'log']);
const form = reactive({ id: null, type: '支出', name: '', amount: null, frequency: 'monthly' });
const getJSTDate = () => new Date(Date.now() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000));
const isLogged = (item) => {
  const today = getJSTDate();
  const checkPeriod = item.frequency === 'monthly'
    ? today.toISOString().slice(0, 7)
    : String(today.getFullYear());
  return props.records.some(record =>
    record.recurringId === item.id && record.date.startsWith(checkPeriod)
  );
};
const resetForm = () => Object.assign(form, { id: null, type: '支出', name: '', amount: null, frequency: 'monthly' });
const handleSubmit = () => {
  const updatedItems = form.id
    ? props.recurringItems.map(c => c.id === form.id ? { ...c, ...form } : c)
    : [...props.recurringItems, { id: `rc_${Date.now()}`, ...form, category: '固定費' }];
  emit('update', updatedItems);
  resetForm();
};
const handleEdit = (item) => Object.assign(form, item);
const cancelEdit = () => resetForm();
const deleteItem = (id) => {
  if (confirm('この項目を削除しますか？')) {
    emit('update', props.recurringItems.filter(item => item.id !== id));
  }
};
</script>

<style scoped>
/* RecurringManager全体のGridコンテナ */
.recurring-manager-grid {
  display: grid;
  grid-template-columns: 1fr 1fr; /* 2つのカラムを均等に分ける */
  gap: 2rem; /* フォームとリストの間の余白 */
  margin-top: 1.5rem; /* 上部の余白 */
}

/* フォームの内部Gridレイアウト */
.recurring-form-grid { /* クラス名変更 */
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); /* 各入力フィールドの最小幅を調整 */
  gap: 1rem;
  margin-bottom: 0; /* 親グリッドの子なので下マージンは不要 */
}

.recurring-form-grid label {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-weight: bold;
  font-size: 0.9em;
}

.recurring-form-grid input,
.recurring-form-grid select {
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
}

.form-actions {
  grid-column: 1 / -1; /* グリッドの全幅を占める */
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 0.5rem;
}
.add-button { background-color: #0d6efd; }
.cancel-button { background-color: #6c757d; }

/* リストコンテナの調整 */
.list-container {
  margin-top: 0; /* 親グリッドの子なので上マージンは不要 */
  border-top: none; /* 親グリッドの子なので上ボーダーも不要 */
  padding-top: 0; /* 親グリッドの子なので上パディングも不要 */
  max-height: 400px; /* 例えば、最大高さを設定 */
  overflow-y: auto; /* 高さを超えたらスクロール */
}

/* レコードリストの基本スタイルは維持 */
.record-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 1rem; }
.record-item { display: flex; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.08); overflow: hidden; }
.color-bar { width: 8px; flex-shrink: 0; }
.record-content { flex-grow: 1; padding: 0.8rem 1rem; }
.record-header { display: flex; justify-content: space-between; align-items: baseline; }
.record-name { font-weight: bold; }
.record-amount { font-weight: bold; }
.record-amount.income { color: #198754; }
.record-amount.expense { color: #dc3545; }
.record-actions { display: flex; align-items: center; background-color: #f8f9fa; padding: 0 0.5rem; }
.log-button { background-color: #198754; }
.log-button:disabled { background-color: #aaa; cursor: not-allowed; }
.edit-button, .delete-button { background: none; color: #666; }

/* 画面幅が小さい場合のレスポンシブ対応 */
@media (max-width: 768px) {
  .recurring-manager-grid { /* クラス名変更 */
    grid-template-columns: 1fr; /* 1カラムにする（縦並び） */
  }
  .list-container {
    max-height: none; /* スクロール制限を解除 */
  }
}
</style>