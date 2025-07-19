<template>
  <div class="component-container">
    <h3>カテゴリの管理</h3>
    <form @submit.prevent="addCategory">
      <div class="form-grid">
        <label>カテゴリの種類：
          <select v-model="newCategoryType">
            <option value="支出">支出</option>
            <option value="収入">収入</option>
          </select>
        </label>
        <label>新しいカテゴリ名：<input v-model="newCategoryName" required /></label>
        <label>色：<input type="color" v-model="newCategoryColor" class="color-picker" /></label>
      </div>
      <button type="submit" class="add-button">カテゴリを追加</button>
    </form>
    <div class="list-container">
      <h4>登録済みカテゴリ</h4>
      <div class="category-section">
        <h5>支出</h5>
        <ul>
          <li v-for="(cat, index) in categories.支出" :key="cat.name">
            <input type="color" :value="cat.color" @input="updateColor('支出', index, $event.target.value)" class="color-picker-small" />
            <span>{{ cat.name }}</span>
            <button @click="deleteCategory('支出', cat.name)" class="delete-button-small">x</button>
          </li>
        </ul>
      </div>
      <div class="category-section">
        <h5>収入</h5>
        <ul>
          <li v-for="(cat, index) in categories.収入" :key="cat.name">
            <input type="color" :value="cat.color" @input="updateColor('収入', index, $event.target.value)" class="color-picker-small" />
            <span>{{ cat.name }}</span>
            <button @click="deleteCategory('収入', cat.name)" class="delete-button-small">x</button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const props = defineProps({ categories: { type: Object, required: true } });
const emit = defineEmits(['update']);
const newCategoryName = ref('');
const newCategoryType = ref('支出');
const newCategoryColor = ref('#ff6384');
const addCategory = () => {
  if (!newCategoryName.value.trim()) return;
  const newCategories = JSON.parse(JSON.stringify(props.categories));
  if (!newCategories[newCategoryType.value].some(c => c.name === newCategoryName.value)) {
    newCategories[newCategoryType.value].push({ name: newCategoryName.value, color: newCategoryColor.value });
    emit('update', newCategories);
  }
  newCategoryName.value = '';
};
const deleteCategory = (type, name) => {
  if (name === '固定費') { alert('「固定費」カテゴリは削除できません。'); return; }
  if (confirm(`カテゴリ「${name}」を削除しますか？`)) {
    const newCategories = JSON.parse(JSON.stringify(props.categories));
    newCategories[type] = newCategories[type].filter(cat => cat.name !== name);
    emit('update', newCategories);
  }
};
const updateColor = (type, index, newColor) => {
  const newCategories = JSON.parse(JSON.stringify(props.categories));
  newCategories[type][index].color = newColor;
  emit('update', newCategories);
};
</script>

<style scoped>
.color-picker { padding: 0; height: 40px; border: 1px solid #ccc; }
.color-picker-small { width: 24px; height: 24px; padding: 0; border: none; border-radius: 4px; cursor: pointer; margin-right: 8px; }
h3, h4, h5 { margin-top: 0; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr 0.5fr; gap: 1rem; margin-bottom: 1rem; align-items: flex-end; }
.list-container { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 1.5rem; border-top: 1px solid #eee; padding-top: 1.5rem; }
ul { list-style: none; padding: 0; margin: 0; }
li { background: #f4f4f4; padding: 0.5rem 0.8rem; border-radius: 4px; margin-bottom: 0.5rem; display: flex; align-items: center; }
li > button { margin-left: auto; }
.delete-button-small { background: #6c757d; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; padding: 0; }
.add-button { background-color: #0d6efd; }
</style>