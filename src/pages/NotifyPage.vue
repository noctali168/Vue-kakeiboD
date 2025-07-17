<template>
  <BackHome />

  <div class="notify-page">
    <h2>通知・設定</h2>

    <section class="accordion">
      <header @click="toggleSection('name')" class="accordion-header">
        あなたの名前
        <span>{{ isOpen.name ? '▲' : '▼' }}</span>
      </header>
      <div v-show="isOpen.name" class="accordion-content">
        <NameSetting/>
      </div>
    </section>

    <section class="accordion">
      <header @click="toggleSection('reset')" class="accordion-header">
        データリセット
        <span>{{ isOpen.reset ? '▲' : '▼' }}</span>
      </header>
      <div v-show="isOpen.reset" class="accordion-content">
        <Reset />
      </div>
    </section>

    <section class="accordion">
      <header @click="toggleSection('reminder')" class="accordion-header">
        リマインダー設定
        <span>{{ isOpen.name ? '▲' : '▼' }}</span>
      </header>
      <div v-show="isOpen.name" class="accordion-content">
        <ReminderSetting />
      </div>
    </section>

    <section class="accordion">
      <header @click="toggleSection('fixedCost')" class="accordion-header">
        固定費設定
        <span>{{ isOpen.fixedCost ? '▲' : '▼' }}</span>
      </header>
      <div v-show="isOpen.fixedCost" class="accordion-content">
        <FixedCost />
      </div>
    </section>
  </div>
</template>

<script setup>
import ReminderSetting from '../components/ReminderSetting.vue'
import NameSetting from '../components/NameSetting.vue'
import Reset from '../components/Reset.vue'
import FixedCost from '../components/FixedCost.vue'
import BackHome from '../components/BackHome.vue'
import { ref, onMounted } from 'vue'

const username = ref('')
const saved = ref(false)

const isOpen = ref({
  name: true,
  reset: false,
  fixedCost: false,
})

const toggleSection = (key) => {
  isOpen.value[key] = !isOpen.value[key]
}

onMounted(() => {
  username.value = localStorage.getItem('kakeibo-username') || ''
})

const saveName = () => {
  localStorage.setItem('kakeibo-username', username.value)
  saved.value = true
  setTimeout(() => (saved.value = false), 2000)
}
</script>

<style scoped>
.notify-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
}
.accordion {
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-top: 1rem;
}
.accordion-header {
  background-color: #4caf50;
  color: white;
  padding: 0.8rem 1rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  user-select: none;
}
.accordion-content {
  padding: 1rem;
  background: #f9f9f9;
}
form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
input {
  padding: 0.5rem;
  font-size: 1rem;
}
button {
  background-color: #4caf50;
  color: white;
  padding: 0.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background-color: #388e3c;
}
</style>
