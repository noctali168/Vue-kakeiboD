<template>
  <div class="component-container">
    <h3>日々の記録</h3>
    
    <div class="transaction-manager-grid">
      <div class="input-form-card component-container">
        <form @submit.prevent="handleSubmit" class="transaction-form-layout">
          <label class="form-label-item">区分：
            <select v-model="form.type" required @change="form.category = ''">
              <option value="支出">支出</option>
              <option value="収入">収入</option>
            </select>
          </label>
          <label class="form-label-item">カテゴリ：
            <select v-model="form.category" required>
              <option disabled value="">選択してください</option>
              <option v-for="cat in categories[form.type]" :key="cat.name" :value="cat.name">{{ cat.name }}</option>
            </select>
          </label>
          <label class="form-label-item">品目：<input v-model="form.name" required /></label>
          <label class="form-label-item">金額：<input type="number" v-model.number="form.amount" required /></label>
          <label class="form-label-item">日付：<input type="date" v-model="form.date" required /></label>
          <div class="form-actions">
            <button type="submit" class="add-button">{{ form.id ? '更新' : '追加' }}</button>
            <button v-if="form.id" @click="cancelEdit" type="button" class="cancel-button">ｷｬﾝｾﾙ</button>
          </div>
        </form>
      </div>

      <div class="list-container transaction-list-area component-container"> <h4>全記録リスト</h4>
        <ul v-if="records.length > 0" class="record-list">
          <li class="record-item" v-for="record in records" :key="record.id">
            <div class="color-bar" :style="{ backgroundColor: getCategoryColor(record.category, record.type) }"></div>
            <div class="record-content">
              <div class="record-header">
                <span class="record-name">{{ record.name }}</span>
                <span class="record-amount" :class="record.type === '収入' ? 'income' : 'expense'">
                  {{ record.type === '収入' ? '+' : '-' }} {{ record.amount.toLocaleString() }} 円
                </span>
              </div>
              <div class="record-footer">
                <span class="record-category">{{ record.category }}</span>
                <span class="record-date">{{ record.date }}</span>
              </div>
            </div>
            <div class="record-actions">
              <button @click="$emit('edit', record)" class="edit-button">✏️</button>
              <button @click="$emit('delete', record.id)" class="delete-button">🗑️</button>
            </div>
          </li>
        </ul>
        <p v-else>まだ記録がありません。</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue';

const props = defineProps({
  records: { type: Array, required: true },
  recordToEdit: { type: Object, default: null },
  categories: { type: Object, required: true }
});
const emit = defineEmits(['submit', 'delete', 'edit', 'cancelEdit']);

const getJSTDateString = () => {
  const now = new Date(Date.now() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000));
  return now.toISOString().slice(0, 10);
};

const createEmptyForm = () => ({ id: null, type: '支出', category: '', name: '', amount: null, date: getJSTDateString() });
const form = reactive(createEmptyForm());

watch(() => props.recordToEdit, (newVal) => {
  Object.assign(form, newVal || createEmptyForm());
}, { deep: true });

const handleSubmit = () => {
  emit('submit', { ...form });
  if (!form.id) {
    Object.assign(form, createEmptyForm());
  }
};

const cancelEdit = () => emit('cancelEdit');

const getCategoryColor = (categoryName, type) => {
  const category = props.categories[type]?.find(c => c.name === categoryName);
  return category ? category.color : '#cccccc';
};
</script>

<style scoped>
/* TransactionManager全体のGridコンテナ */
.transaction-manager-grid {
  display: grid;
  grid-template-columns: 1fr 1fr; /* フォームとリストを均等に2列に分ける */
  gap: 2rem; /* フォームとリストの間の余白を調整 */
  margin-top: 1.5rem;
}

/* 各フォーム/リストを囲むカード状のコンテナ */
.input-form-card,
.list-container.transaction-list-area {
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem; /* 内部パディング */
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  box-sizing: border-box; /* パディングとボーダーを幅に含める */
}


/* フォームの内部レイアウト調整 */
.transaction-form-layout { /* クラス名を変更 */
  display: grid;
  /* 2列にして、各行に2つのフィールドを配置 */
  grid-template-columns: 1fr 1fr;
  gap: 1rem; /* フィールド間の余白 */
  margin-bottom: 0; /* 下マージンは不要 */
}

/* 各フォームラベルと入力フィールドのコンテナ */
.form-label-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-weight: bold;
  font-size: 0.9em;
  color: #2c3e50;
}

/* input と select のスタイルを調整して、カレンダーマークが見やすくなるようにする */
.transaction-form-layout input,
.transaction-form-layout select {
  padding: 0.8rem; /* 縦パディングを増やす */
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
  background-color: #f8f8f8;
  color: #2c3e50;
  height: 40px; /* 明示的に高さを設定し、アイコン領域を確保 */
  line-height: 1; /* テキストの垂直方向の位置を調整 */
}

/* 日付入力フィールドの特別な調整 */
.transaction-form-layout input[type="date"] {
  /* ブラウザのデフォルトスタイルに依存するため、直接アイコンの色やサイズ変更は難しい */
  /* paddingを調整して、アイコンがコンテンツと被らないようにする */
  padding-right: 10px; /* アイコンの領域を確保 */
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
.list-container.transaction-list-area {
  margin-top: 0;
  border-top: none;
  padding-top: 0;
  max-height: 400px; /* リストの最大高さを設定 */
  overflow-y: auto; /* 高さを超えたらスクロール */
  scrollbar-width: thin;
  scrollbar-color: #ccc transparent;
}

.list-container.transaction-list-area::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.list-container.transaction-list-area::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 4px;
}
.list-container.transaction-list-area::-webkit-scrollbar-track {
  background-color: transparent;
}


/* レコードリストの基本スタイルは維持 */
.record-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 1rem; }
.record-item { display: flex; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow: hidden; }
.color-bar { width: 8px; flex-shrink: 0; }
.record-content { flex-grow: 1; padding: 0.8rem 1rem; }
.record-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.25rem; }
.record-name { font-weight: bold; font-size: 1.1em; }
.record-amount { font-weight: bold; font-size: 1.2em; }
.record-amount.income { color: #198754; }
.record-amount.expense { color: #dc3545; }
.record-footer { display: flex; justify-content: space-between; font-size: 0.85em; color: #666; }
.record-actions { display: flex; align-items: center; background-color: #f8f9fa; padding: 0 0.5rem; }
.edit-button, .delete-button { background: none; color: #666; }

/* 画面幅が小さい場合のレスポンシブ対応 */
@media (max-width: 768px) {
  .transaction-manager-grid {
    grid-template-columns: 1fr; /* 1カラムにする（縦並び） */
    gap: 1.5rem;
  }
  .transaction-form-layout {
    grid-template-columns: 1fr; /* スマホでは縦1列にする */
  }
  /* カード状のコンテナのパディングをモバイルで調整することも検討 */
  .input-form-card,
  .list-container.transaction-list-area {
    padding: 1rem; /* モバイルでのパディングを少し減らす */
  }
  .list-container.transaction-list-area {
    max-height: none; /* スクロール制限を解除 */
  }
}
</style>