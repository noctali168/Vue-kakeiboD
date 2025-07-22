<template>
  <div class="fixed-form">
    <form @submit.prevent="handleAdd">
      <label class="form-label-item"> 区分：
        <select v-model="form.type" required>
          <option value="支出">支出</option>
          <option value="収入">収入</option>
        </select>
      </label>

      <label class="form-label-item"> 名前：
        <input v-model="form.name" required />
      </label>

      <label class="form-label-item"> 金額：
        <input type="number" v-model.number="form.amount" required />
      </label>

      <label class="form-label-item"> 繰り返し：
        <select v-model="form.frequency" required>
          <option value="monthly">月ごと</option>
          <option value="yearly">年ごと</option>
        </select>
      </label>

      <button type="submit">追加</button>
    </form>

    <p v-if="saved" class="saved-msg">✅ 登録しました！</p>

    <div class="fixed-list" v-if="fixedCosts.length > 0">
      <h4>登録済みの固定費</h4>
      <div class="item" v-for="item in fixedCosts" :key="item.id">
        <span>{{ item.type }}｜{{ item.name }}｜</span>
        <input type="number" v-model.number="item.amount" @change="updateAmount(item)" />円｜
        <span>{{ item.frequency === 'monthly' ? '月ごと' : '年ごと' }}</span>
        <button @click="deleteItem(item.id)">削除</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'

const form = reactive({
  type: '支出',
  name: '',
  amount: null,
  frequency: 'monthly'
})

const saved = ref(false)
const fixedCosts = ref([])

onMounted(() => {
  fixedCosts.value = JSON.parse(localStorage.getItem('kakeibo-fixed') || '[]')
})

const saveToStorage = () => {
  localStorage.setItem('kakeibo-fixed', JSON.stringify(fixedCosts.value))
}

const handleAdd = () => {
  const newItem = {
    id: Date.now().toString(),
    type: form.type,
    name: form.name,
    amount: form.amount,
    frequency: form.frequency,
    category: '固定費'
  }
  fixedCosts.value.push(newItem)
  saveToStorage()

  saved.value = true
  form.type = '支出'
  form.name = ''
  form.amount = null
  form.frequency = 'monthly'

  setTimeout(() => saved.value = false, 2000)
}

const deleteItem = (id) => {
  fixedCosts.value = fixedCosts.value.filter(item => item.id !== id)
  saveToStorage()
}

const updateAmount = (item) => {
  const target = fixedCosts.value.find(f => f.id === item.id)
  if (target) {
    target.amount = item.amount
    saveToStorage()
  }
}
</script>

<style scoped>
.fixed-form {
  /* 親コンポーネントのパディングに任せるためリセット */
  padding: 0;
  border: none;
  margin-top: 0;
}
/* 各フォームラベルと入力フィールドのコンテナ */
.form-label-item { /* 新しいクラスのスタイル */
  display: flex;
  flex-direction: column; /* 縦並び */
  gap: 0.25rem; /* ラベルと入力要素の間隔 */
  margin-bottom: 0.8rem; /* 下の要素との間隔 */
  font-weight: bold;
  font-size: 0.9em;
  color: #2c3e50; /* ラベルの色を濃くして見やすく */
}

/* ★ここを修正します★ input, select のスタイル */
input:not([type="number"]), /* input type="number" 以外 */
select {
  padding: 0.6rem; /* 縦パディングを調整 */
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px; /* 角丸を統一 */
  background-color: #f8f8f8; /* 背景色を統一 */
  color: #2c3e50; /* 文字色を統一 */
  box-sizing: border-box; /* パディングを含めて幅を計算 */
  width: 100%; /* 親の幅に合わせる */
}
/* 金額入力欄のスタイル（固定費リスト内のものも含む） */
input[type="number"] {
  padding: 0.6rem; /* 縦パディングを調整 */
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px; /* 角丸を統一 */
  background-color: #f8f8f8; /* 背景色を統一 */
  color: #2c3e50; /* 文字色を統一 */
  box-sizing: border-box;
  width: 100%; /* 親の幅に合わせる */
}

button {
  /* NotifyPageで定義した:deep()スタイルを継承 */
  background-color: #0d6efd; /* プライマリボタンの色に統一 */
  color: white;
  padding: 0.6rem 1.2rem; /* パディングを統一 */
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: opacity 0.2s;
  font-weight: bold;
  font-size: 1rem;
  margin-top: 0.5rem; /* 上に少し余白 */
}
button:hover {
  opacity: 0.85;
}
.fixed-list {
  margin-top: 1rem;
  padding-top: 0.5rem;
  border-top: 1px solid #eee;
}
.item {
  margin: 0.5rem 0;
  /* NotifyPageの:deep()で設定したスタイルを維持 */
}
/* input[type="number"] の幅は :deep()でflex-grow:1されているので、ここではwidth:autoにする */
.item input[type="number"] {
  width: auto;
  text-align: right; /* 右寄せ */
}
</style>