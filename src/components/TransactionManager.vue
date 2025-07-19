<template>
  <div class="component-container">
    <h3>日々の記録</h3>
    <form @submit.prevent="handleSubmit">
       <div class="form-grid">
        <label>区分：
          <select v-model="form.type" required>
            <option value="支出">支出</option>
            <option value="収入">収入</option>
          </select>
        </label>
        <label>カテゴリ：<input v-model="form.category" required /></label>
        <label>名前：<input v-model="form.name" required /></label>
        <label>金額：<input type="number" v-model.number="form.amount" required /></label>
      </div>
      <button type="submit" class="add-button">{{ form.id ? '更新' : '追加' }}</button>
      <button v-if="form.id" @click="cancelEdit" type="button" class="cancel-button">キャンセル</button>
    </form>

    <div class="list-container">
      <h4>全記録リスト</h4>
      <ul>
        <li class="record" v-for="record in records" :key="record.id">
          <span class="date">{{ record.date }}</span>
          <span class="name">[{{ record.category }}] {{ record.name }}</span>
          <span class="amount" :class="record.type === '収入' ? 'income' : 'expense'">
            {{ record.amount.toLocaleString() }} 円
          </span>
          <div class="item-actions">
            <button @click="$emit('edit', record)" class="edit-button">✏️</button>
            <button @click="$emit('delete', record.id)" class="delete-button">🗑️</button>
          </div>
        </li>
      </ul>
      <p v-if="!records.length">まだ記録がありません。</p>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue';

const props = defineProps({
  records: { type: Array, required: true },
  recordToEdit: { type: Object, default: null }
});
const emit = defineEmits(['submit', 'delete', 'edit', 'cancelEdit']);
const form = reactive({ id: null, type: '支出', category: '', name: '', amount: null });

watch(() => props.recordToEdit, (newVal) => {
  Object.assign(form, newVal || { id: null, type: '支出', category: '', name: '', amount: null });
}, { deep: true });

const handleSubmit = () => emit('submit', { ...form });
const cancelEdit = () => emit('cancelEdit');
</script>

<style scoped>
h3, h4 { margin-top: 0; }
.form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 1rem; }
.list-container { margin-top: 1.5rem; border-top: 1px solid #eee; padding-top: 1.5rem; }
ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.8rem; }
.record { display: grid; grid-template-columns: 100px 1fr auto auto; align-items: center; gap: 1rem; background: #f9f9f9; padding: 0.8rem; border-radius: 5px; }
.date { font-size: 0.9em; color: #666; }
.amount.income { color: #198754; font-weight: bold; }
.amount.expense { color: #dc3545; font-weight: bold; }
.item-actions { display: flex; gap: 0.5rem; }
.add-button { background-color: #0d6efd; }
.cancel-button { background-color: #6c757d; }
.edit-button { background-color: #ffc107; }
.delete-button { background-color: #dc3545; }
</style>