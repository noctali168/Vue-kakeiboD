<template>
  <div class="component-container">
    <h3>カテゴリの管理</h3>
    
    <div class="category-manager-grid">
      <div class="input-form-card component-container">
        <form @submit.prevent="addCategory" class="category-form-layout">
          <label class="form-label-item">カテゴリの種類：
            <select v-model="newCategoryType">
              <option value="支出">支出</option>
              <option value="収入">収入</option>
            </select>
          </label>
          <label class="form-label-item">新しいカテゴリ名：<input v-model="newCategoryName" required /></label>
          <label class="form-label-item">色：<input type="color" v-model="newCategoryColor" class="color-picker" /></label>
          <button type="submit" class="add-button category-add-button">カテゴリを追加</button>
        </form>
      </div>

      <div class="list-container category-list-area component-container">
        <h4>登録済みカテゴリ</h4>
        <div class="category-sections-grid">
          <div class="category-section">
            <h5>支出</h5>
            <ul class="category-list">
              <li v-for="(cat, index) in categories.支出" :key="cat.name" :style="{ backgroundColor: cat.color }"> <input type="color" :value="cat.color" @input="updateColor('支出', index, $event.target.value)" class="color-picker-small" />
                <span class="category-name-text">{{ cat.name }}</span> <button @click="deleteCategory('支出', cat.name)" class="delete-button-small">x</button>
              </li>
            </ul>
          </div>
          <div class="category-section">
            <h5>収入</h5>
            <ul class="category-list">
              <li v-for="(cat, index) in categories.収入" :key="cat.name" :style="{ backgroundColor: cat.color }"> <input type="color" :value="cat.color" @input="updateColor('収入', index, $event.target.value)" class="color-picker-small" />
                <span class="category-name-text">{{ cat.name }}</span> <button @click="deleteCategory('収入', cat.name)" class="delete-button-small">x</button>
              </li>
            </ul>
          </div>
        </div>
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
.color-picker { padding: 0; height: 40px; border: 1px solid #ccc; background-color: #f8f8f8; }
.color-picker-small { width: 24px; height: 24px; padding: 0; border: none; border-radius: 4px; cursor: pointer; margin-right: 8px; }
h3, h4, h5 { margin-top: 0; }

/* CategoryManager全体のGridコンテナ */
.category-manager-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 1.5rem;
}

/* 各フォーム/リストを囲むカード状のコンテナ */
.input-form-card,
.list-container.category-list-area {
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  box-sizing: border-box;
}

/* フォームの内部レイアウト調整 */
.category-form-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-bottom: 0;
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

.category-form-layout input:not([type="color"]),
.category-form-layout select {
  padding: 0.6rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
  background-color: #f8f8f8;
  color: #2c3e50;
}

.category-add-button {
  grid-column: 1 / -1;
  margin-top: 1rem;
  width: auto;
}

/* リストコンテナの調整 */
.list-container.category-list-area {
  margin-top: 0;
  border-top: none;
  padding-top: 0;
}

.category-sections-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 0;
  padding-top: 0;
}

.category-section {
  padding: 0;
}

.category-section h5 {
  margin-bottom: 0.8rem;
  text-align: left;
  padding-left: 0.5rem;
}

.category-list {
  list-style: none;
  padding: 0.5rem;
  margin: 0;
  max-height: 250px;
  overflow-y: auto;
  border: 1px solid #eee;
  border-radius: 6px;
  scrollbar-width: thin;
  scrollbar-color: #ccc transparent;
}

.category-list::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.category-list::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 4px;
}
.category-list::-webkit-scrollbar-track {
  background-color: transparent;
}

.category-list li {
  /* li自体の背景色をカテゴリの色に設定 */
  padding: 0.5rem 0.8rem;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  font-size: 0.95em;
}
.category-list li:last-child {
  margin-bottom: 0;
}

/* ★ここを追加・修正します★ */
.category-name-text { /* 新しいクラスのスタイル */
  color: #2c3e50; /* 文字色を濃いグレーに設定して見やすくする */
  font-weight: 600; /* 少し太くする */
  flex-grow: 1; /* スペースを埋める */
  text-shadow: 0 0 2px rgba(255,255,255,0.7); /* 薄いシャドウを追加して、背景が明るい場合も読みやすく */
}


li > button { margin-left: auto; }
.delete-button-small { background: #6c757d; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; padding: 0; flex-shrink: 0; }
.add-button { background-color: #0d6efd; margin-top: 1rem; }

/* 画面幅が小さい場合のレスポンシブ対応 */
@media (max-width: 768px) {
  .category-manager-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  .category-form-layout {
    grid-template-columns: 1fr;
  }
  .input-form-card,
  .list-container.category-list-area {
    padding: 1rem;
  }
  .category-list {
    max-height: none;
  }
}
</style>