<template>
  <div class="reminder-settings">
    <h3>リマインダー設定</h3>

    <label class="row">
      <input type="checkbox" v-model="settings.enabled" />
      通知を有効にする
    </label>

    <label class="row">
      <input type="checkbox" v-model="settings.monthStart" />
      月はじめに通知する
    </label>

    <div class="row weekdays">
      <span>通知する曜日：</span>
      <label v-for="d in weekdayOptions" :key="d.value" class="weekday-item">
        <input type="checkbox" :value="d.value" v-model="settings.days" />
        {{ d.label }}
      </label>
    </div>

    <div class="row time-row">
      <label>
        通知時間：
        <input type="time" v-model="settings.time" />
      </label>
    </div>

    <div class="btn-row">
      <button @click="saveSettings">保存</button>
      <button @click="testNotify" type="button" class="test-btn">テスト通知</button>
    </div>

    <p v-if="saved" class="saved-msg">✅ 保存しました。</p>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'

// localStorage key
const SETTINGS_KEY = 'kakeibo-reminder-settings'

const defaultSettings = {
  enabled: true,
  monthStart: true,
  days: [],          // [1,4] = 月・木 など
  time: '09:00',     // HH:MM
}

const settings = reactive(structuredClone(defaultSettings))
const saved = ref(false)

const weekdayOptions = [
  { value: 0, label: '日' },
  { value: 1, label: '月' },
  { value: 2, label: '火' },
  { value: 3, label: '水' },
  { value: 4, label: '木' },
  { value: 5, label: '金' },
  { value: 6, label: '土' },
]

onMounted(() => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      Object.assign(settings, defaultSettings, parsed) // defaults + saved
    }
  } catch (e) {
    console.warn('設定読み込み失敗', e)
  }
})

function saveSettings() {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  saved.value = true
  setTimeout(() => (saved.value = false), 2000)
}

// 簡易テスト通知
function testNotify() {
  requestPermission().then(() => {
    showNotification('テスト通知', 'これはリマインダーのテストです。')
  })
}

function requestPermission() {
  if (!('Notification' in window)) return Promise.resolve()
  if (Notification.permission === 'granted') return Promise.resolve()
  if (Notification.permission === 'denied') return Promise.resolve()
  return Notification.requestPermission()
}

function showNotification(title, body) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body })
  } else {
    alert(body)
  }
}
</script>

<style scoped>
.reminder-settings {
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: #f9f9f9;
  max-width: 500px;
}
.row {
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.weekdays {
  flex-wrap: wrap;
}
.weekday-item {
  margin-right: 0.5rem;
  user-select: none;
}
.time-row input[type="time"] {
  margin-left: 0.5rem;
}
.btn-row {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}
button {
  background-color: #4caf50;
  color: white;
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.test-btn {
  background-color: #2196f3;
}
button:hover {
  opacity: 0.9;
}
.saved-msg {
  margin-top: 0.5rem;
  color: green;
  font-weight: bold;
}
</style>
