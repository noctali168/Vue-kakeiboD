<template>
  <div class="fixed-form">
    <h3>固定費の登録</h3>
    <form @submit.prevent="handleAdd">
      <label>
        区分：
        <select v-model="form.type" required>
          <option value="支出">支出</option>
          <option value="収入">収入</option>
        </select>
      </label>

      <label>
        名前：
        <input v-model="form.name" required />
      </label>

      <label>
        金額：
        <input type="number" v-model.number="form.amount" required />
      </label>

      <label>
        繰り返し：
        <select v-model="form.frequency" required>
          <option value="monthly">月ごと</option>
          <option value="yearly">年ごと</option>
        </select>
      </label>

      <button type="submit">追加</button>
    </form>

    <p v-if="saved">✅ 登録しました！</p>

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
  padding: 1rem;
  border: 1px solid #ccc;
  margin-top: 1rem;
}
label {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}
button {
  background-color: #4caf50;
  color: white;
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 5px;
  margin-left: 0.5rem;
  cursor: pointer;
}
button:hover {
  background-color: #388e3c;
}
.fixed-list {
  margin-top: 1rem;
  padding-top: 0.5rem;
  border-top: 1px solid #ccc;
}
.item {
  margin: 0.5rem 0;
}
input[type="number"] {
  width: 80px;
}
</style>
