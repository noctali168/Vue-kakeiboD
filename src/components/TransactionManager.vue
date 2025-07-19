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
    </div>
</template>

<script setup>
// (script部分は変更なし)
import { reactive, watch } from 'vue';
const props = defineProps({ records: { type: Array, required: true }, recordToEdit: { type: Object, default: null }, categories: { type: Object, required: true } });
const emit = defineEmits(['submit', 'delete', 'edit', 'cancelEdit']);
const createEmptyForm = () => ({ id: null, type: '支出', category: '', name: '', amount: null });
const form = reactive(createEmptyForm());
watch(() => props.recordToEdit, (newVal) => { Object.assign(form, newVal || createEmptyForm()); }, { deep: true });
const handleSubmit = () => { emit('submit', { ...form }); if (!form.id) { Object.assign(form, createEmptyForm()); } };
const cancelEdit = () => emit('cancelEdit');
</script>

<style scoped>
/* ★★★ ここからが新しいスタイル ★★★ */
.vertical-form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
.vertical-form label {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-weight: bold;
  font-size: 0.9em;
}
.vertical-form input,
.vertical-form select {
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}
.vertical-form input:focus,
.vertical-form select:focus {
  outline: none;
  border-color: #0d6efd;
  box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.2);
}
.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
}
.add-button { background-color: #0d6efd; }
.cancel-button { background-color: #6c757d; }
/* (リストのスタイルは変更なし) */
</style>