<template>
  <div class="component-container">
    <h3>固定費の管理</h3>
    <p>毎月・毎年発生する項目をテンプレートとして登録します。</p>
    <form @submit.prevent="handleSubmit">
      <div class="form-grid">
        <label>頻度：
          <select v-model="form.frequency" required>
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
        <label>名前：<input v-model="form.name" required /></label>
        <label>金額：<input type="number" v-model.number="form.amount" required /></label>
        <label>カテゴリ：<input v-model="form.category" required /></label>
      </div>
      <button type="submit" class="add-button">{{ form.id ? '更新' : '追加' }}</button>
      <button v-if="form.id" @click="cancelEdit" type="button" class="cancel-button">ｷｬﾝｾﾙ</button>
    </form>

    <div class="list-container" v-if="fixedCosts.length > 0">
      <h4>登録済みリスト</h4>
      <div class="item" v-for="item in fixedCosts" :key="item.id">
        <div class="item-details">
          <span class="type">[{{ item.frequency === 'yearly' ? '年' : '月' }}] [{{ item.type }}]</span>
          <span class="name">{{ item.name }}</span>
        </div>
        <div class="item-amount">{{ item.amount.toLocaleString() }}円</div>
        <div class="item-actions">
          <button @click="handleEdit(item)" class="edit-button">✏️</button>
          <button @click="deleteItem(item.id)" class="delete-button">🗑️</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue';

const props = defineProps({ fixedCosts: { type: Array, required: true } });
const emit = defineEmits(['update']);
const form = reactive({ id: null, type: '支出', name: '', amount: null, category: '', frequency: 'monthly' });

watch(() => props.fixedCosts, { deep: true });

const resetForm = () => {
  Object.assign(form, { id: null, type: '支出', name: '', amount: null, category: '', frequency: 'monthly' });
};

const handleSubmit = () => {
  const updatedCosts = form.id
    ? props.fixedCosts.map(c => c.id === form.id ? { ...c, ...form } : c)
    : [...props.fixedCosts, { id: `fc_${Date.now()}`, ...form }];
  emit('update', updatedCosts);
  resetForm();
};

const handleEdit = (cost) => { Object.assign(form, cost); };
const cancelEdit = () => resetForm();
const deleteItem = (id) => {
  if (confirm('この項目を削除しますか？')) {
    emit('update', props.fixedCosts.filter(item => item.id !== id));
  }
};
</script>

<style scoped>
/* スタイルは前の回答のものを流用してください */
h3, h4 { margin-top: 0; color: #333; }
p { font-size: 0.9em; color: #666; margin-top: 0; }
.form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 1rem; }
label { display: flex; flex-direction: column; gap: 0.3rem; font-size: 0.9em; }
.list-container { margin-top: 1.5rem; border-top: 1px solid #eee; padding-top: 1.5rem; }
.item { display: grid; grid-template-columns: 1fr auto auto; align-items: center; gap: 1rem; background: #f9f9f9; padding: 0.8rem; border-radius: 5px; margin-bottom: 0.5rem;}
.item-details { display: flex; align-items: baseline; gap: 0.5rem; }
.item-actions { display: flex; gap: 0.5rem; }
.add-button { background-color: #0d6efd; }
.cancel-button { background-color: #6c757d; }
.edit-button { background-color: #ffc107; }
.delete-button { background-color: #dc3545; }
</style>