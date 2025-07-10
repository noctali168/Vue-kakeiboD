<script setup>
import { onMounted } from 'vue'

function requestNotificationPermission() {
  if (Notification.permission !== 'granted') {
    Notification.requestPermission()
  }
}

function showReminderNotification() {
  if (Notification.permission === 'granted') {
    new Notification('家計簿リマインダー', {
      body: '3日間入力がありません。忘れずに記録しましょう'
    })
  }
}

function getLastEntryDate(records) {
  if (records.length === 0) return null
  const dates = records.map(r => new Date(r.date))
  return new Date(Math.max(...dates))
}

function checkAndNotify() {
  const records = JSON.parse(localStorage.getItem('kakeibo-records') || '[]')
  const lastDate = getLastEntryDate(records)
  if (!lastDate) return

  const now = new Date()
  const diffDays = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24))

  if (diffDays >= 3) {
    const today = now.toISOString().slice(0,10)
    const lastNotified = localStorage.getItem('lastNotified') || ''
    if (lastNotified !== today) {
      showReminderNotification()
      localStorage.setItem('lastNotified', today)
    }
  }
}

onMounted(() => {
  requestNotificationPermission()
  checkAndNotify()
  setInterval(checkAndNotify, 60 * 60 * 1000) // 1時間ごとにチェック
})
</script>

<template>
  <!-- UIは特になし、通知専用 -->
  <div></div>
</template>
