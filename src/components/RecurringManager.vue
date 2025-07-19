<template>
  <div class="component-container">
    <h3>定期的な項目の管理</h3>
    <p>ここで登録した項目は、毎月・毎年自動で記録リストに追加されます。</p>
    <form @submit.prevent="handleSubmit" class="vertical-form">
      <label>頻度：
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
    </div>
</template>

<script setup>
// (script部分は変更なし)
import { reactive } from 'vue';
const props = defineProps({ recurringItems: { type: Array, required: true } });
const emit = defineEmits(['update']);
const form = reactive({ id: null, type: '支出', name: '', amount: null, frequency: 'monthly' });
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
</script>

<style scoped>
/* ★★★ TransactionManagerと同じスタイルを適用 ★★★ */
.vertical-form { display: flex; flex-direction: column; gap: 1.2rem; }
.vertical-form label { display: flex; flex-direction: column; gap: 0.5rem; font-weight: bold; font-size: 0.9em; }
.vertical-form input, .vertical-form select { padding: 0.8rem; border: 1px solid #ddd; border-radius: 8px; font-size: 1rem; }
.vertical-form input:focus, .vertical-form select:focus { outline: none; border-color: #0d6efd; box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.2); }
.form-actions { display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1rem; }
.add-button { background-color: #0d6efd; }
.cancel-button { background-color: #6c757d; }
/* (リストのスタイルは変更なし) */
</style>