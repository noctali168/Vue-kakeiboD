<template>
  <div class="component-container">
    <h3>日々の記録</h3>
    <form @submit.prevent="handleSubmit" class="vertical-form">
      <label>区分：
        <select v-model="form.type" required @change="form.category = ''">
          <option value="支出">支出</option>
          <option value="収入">収入</option>
        </select>
      </label>
      <label>カテゴリ：
        <select v-model="form.category" required>
          <option disabled value="">選択してください</option>
          <option v-for="cat in categories[form.type]" :key="cat.name" :value="cat.name">{{ cat.name }}</option>
        </select>
      </label>
      <label>名前：<input v-model="form.name" required /></label>
      <label>金額：<input type="number" v-model.number="form.amount" required /></label>
      <div class="form-actions">
        <button type="submit" class="add-button">{{ form.id ? '更新' : '追加' }}</button>
        <button v-if="form.id" @click="cancelEdit" type="button" class="cancel-button">ｷｬﾝｾﾙ</button>
      </div>
    </form>
    <div class="list-container">
      <h4>全記録リスト</h4>
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
</template>

<script setup>
import { reactive, watch } from 'vue';
const props = defineProps({ records: { type: Array, required: true }, recordToEdit: { type: Object, default: null }, categories: { type: Object, required: true } });
const emit = defineEmits(['submit', 'delete', 'edit', 'cancelEdit']);
const createEmptyForm = () => ({ id: null, type: '支出', category: '', name: '', amount: null });
const form = reactive(createEmptyForm());
watch(() => props.recordToEdit, (newVal) => { Object.assign(form, newVal || createEmptyForm()); }, { deep: true });
const handleSubmit = () => { emit('submit', { ...form }); if (!form.id) { Object.assign(form, createEmptyForm()); }};
const cancelEdit = () => emit('cancelEdit');
const getCategoryColor = (categoryName, type) => {
  const category = props.categories[type]?.find(c => c.name === categoryName);
  return category ? category.color : '#cccccc';
};
</script>

<style scoped>
.vertical-form { display: flex; flex-direction: column; gap: 1.2rem; }
.vertical-form label { display: flex; flex-direction: column; gap: 0.5rem; font-weight: bold; font-size: 0.9em; }
.vertical-form input, .vertical-form select { padding: 0.8rem; border: 1px solid #ddd; border-radius: 8px; font-size: 1rem; }
.form-actions { display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1rem; }
.add-button { background-color: #0d6efd; }
.cancel-button { background-color: #6c757d; }
.list-container { margin-top: 2rem; border-top: 1px solid #eee; padding-top: 1.5rem; }
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
</style>