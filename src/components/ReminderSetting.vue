<template>
  <div class="reminder-settings">
    <label class="row reminder-checkbox-row">
      <span>通知を有効にする</span>
      <input type="checkbox" v-model="settings.enabled" />
    </label>

    <label class="row reminder-checkbox-row">
      <span>月はじめに通知する</span>
      <input type="checkbox" v-model="settings.monthStart" />
    </label>

    <div class="row weekdays">
      <span class="weekday-label">通知する曜日：</span>
      <div class="weekday-options-grid">
        <label v-for="d in weekdayOptions" :key="d.value" class="weekday-item">
          <span>{{ d.label }}</span>
          <input type="checkbox" :value="d.value" v-model="settings.days" />
        </label>
      </div>
    </div>

    <div class="row time-row">
      <label class="time-label">
        通知時間：
        <input type="time" v-model="settings.time" class="time-input" />
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

const SETTINGS_KEY = 'kakeibo-reminder-settings'

const defaultSettings = {
  enabled: false, // ★ここを変更します: デフォルトでチェックを外す
  monthStart: false, // ★ここを変更します: デフォルトでチェックを外す
  days: [],
  time: '09:00',
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
      // localStorageに保存された設定があればそれを使うが、
      // なければdefaultSettings（enabled: false, monthStart: false）が適用される
      Object.assign(settings, defaultSettings, parsed); 
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
  padding: 0;
  border: none;
  border-radius: 0;
  background: transparent;
  max-width: none;
}
.row {
  margin-bottom: 0.8rem;
  display: flex;
  align-items: center;
  /* justify-content: flex-end; /* 行全体を右寄せにしたい場合 */
  gap: 0.5rem;
}

/* チェックボックスとラベルの行 */
.reminder-checkbox-row {
  font-size: 1rem;
  color: #2c3e50;
  font-weight: 500;
  flex-direction: row-reverse;
  /* justify-content: flex-end; を削除し、テキストを中央に配置する調整 */
  justify-content: space-between; /* テキストを左、チェックボックスを右に配置し、間にスペースを入れる */
  gap: 0.8rem;
}
.reminder-checkbox-row input[type="checkbox"] {
  width: 18px;
  height: 18px;
  min-width: 18px;
  min-height: 18px;
  accent-color: #1abc9c;
}
.reminder-checkbox-row span {
  flex-grow: 1; /* テキストが利用可能なスペースを埋めるようにする */
  text-align: left; /* テキストは左寄せを維持 */
  margin-right: auto; /* テキストを左に、チェックボックスを右に */
}


/* 曜日の行 */
.weekdays {
  flex-wrap: wrap;
  align-items: flex-start;
  /* justify-content: flex-end; を削除 */
  gap: 1rem;
}
.weekday-label {
  color: #2c3e50;
  font-weight: 500;
  flex-shrink: 0;
  padding-top: 0.2rem;
  /* テキストを左寄せにしたい場合 */
  text-align: left;
}
.weekday-options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(40px, 1fr));
  gap: 0.5rem;
  flex-grow: 1;
}
.weekday-item {
  color: #2c3e50;
  font-weight: 500;
  display: flex;
  align-items: center;
  user-select: none;
  gap: 0.2rem;
  flex-direction: row-reverse;
  justify-content: flex-end; /* アイテム内のテキストとチェックボックスを右に寄せる */
  gap: 0.8rem;
}
.weekday-item input[type="checkbox"] {
  width: 18px;
  height: 18px;
  min-width: 18px;
  min-height: 18px;
  accent-color: #1abc9c;
}
.weekday-item span {
  flex-shrink: 0;
  /* text-align: right; /* 個々の曜日ラベルを右寄せにしたい場合 */
}


/* 時間設定の行 */
.time-row {
  margin-top: 1rem;
  font-size: 1rem;
  color: #2c3e50;
  font-weight: 500;
  /* justify-content: flex-end; を削除 */
  justify-content: space-between; /* ラベルと入力フィールドの間にスペース */
}
.time-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-grow: 1; /* ラベル全体がスペースを占める */
}
.time-input {
  /* flex: 1; を削除して、入力フィールドの幅を固定または自動調整 */
  width: 100px; /* 例: 幅を固定 */
  padding: 0.6rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f8f8f8;
  color: #2c3e50;
  box-sizing: border-box;
}

/* ボタンの行 */
.btn-row {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
  justify-content: flex-end;
}
button {
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
}
.test-btn {
  background-color: #2196f3;
}
button:hover {
  opacity: 0.9;
}
.saved-msg {
  margin-top: 0.8rem;
  color: #198754;
  font-weight: bold;
  text-align: left;
}
</style>