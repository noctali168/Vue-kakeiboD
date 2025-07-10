<template>
     <BackHome />
  <div class="form-page">
    <h2>記録を追加</h2>
    <form @submit.prevent="handleSubmit">
      <label>
        区分：
        <select v-model="form.type">
          <option value="収入">収入</option>
          <option value="支出">支出</option>
        </select>
      </label>

      <label>
        品物名：
        <input v-model="form.name" type="text" required />
      </label>

      <label>
        カテゴリ：
        <select v-model="form.category" required>
          <option disabled value="">選択してください</option>
          <option>食費</option>
          <option>娯楽</option>
          <option>交通費</option>
          <option>固定費</option>
          <option>その他</option>
        </select>
      </label>

      <label>
        金額：
        <input v-model.number="form.amount" type="number" required />
      </label>

      <button type="submit">保存</button>
    </form>
    <p v-if="saved">✅ 保存しました！</p>
  </div>
</template>

<script setup>
import BackHome from '../components/BackHome.vue'
import { reactive, ref } from 'vue'

const form = reactive({
  type: '支出',
  name: '',
  category: '',
  amount: null,
})

const saved = ref(false)

const handleSubmit = () => {
  const newRecord = {
    id: Date.now().toString(),
    date: new Date().toISOString().slice(0, 10), // "YYYY-MM-DD"
    ...form
  }

  const existing = JSON.parse(localStorage.getItem('kakeibo-records') || '[]')
  existing.push(newRecord)
  localStorage.setItem('kakeibo-records', JSON.stringify(existing))

  saved.value = true

  // フォームをリセット
  form.name = ''
  form.category = ''
  form.amount = null

  setTimeout(() => saved.value = false, 2000)
}
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}
label {
  display: flex;
  flex-direction: column;
  font-weight: bold;
}
button {
  background-color: #4caf50;
  color: white;
  padding: 0.6rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background-color: #388e3c;
}
</style>
