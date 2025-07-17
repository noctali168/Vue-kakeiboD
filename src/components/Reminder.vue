<template>
  <!-- 表示なし -->
  <div style="display:none;"></div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue'

const SETTINGS_KEY = 'kakeibo-reminder-settings'
const RECORDS_KEY = 'kakeibo-records'
const LAST_WEEKLY_KEY = 'kakeibo-reminder-last-weekly'
const LAST_MONTHLY_KEY = 'kakeibo-reminder-last-monthly'
const LAST_THREE_DAYS_KEY = 'kakeibo-reminder-last-3days'
const LAST_CHECK_KEY = 'kakeibo-reminder-last-check'

let timerId = null

onMounted(() => {
  requestPermission()
  checkMissedReminders()  // ページ開いたときに未通知分チェックして通知
  timerId = setInterval(checkReminders, 60 * 1000) // 以降は1分ごとに通常チェック
})

onBeforeUnmount(() => {
  if (timerId) clearInterval(timerId)
})

function requestPermission() {
  if (!('Notification' in window)) return
  if (Notification.permission !== 'granted') {
    Notification.requestPermission()
  }
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function loadRecords() {
  try {
    return JSON.parse(localStorage.getItem(RECORDS_KEY) || '[]')
  } catch {
    return []
  }
}

function getLastEntryDate(records) {
  if (records.length === 0) return null
  const dates = records.map(r => new Date(r.date))
  return new Date(Math.max(...dates))
}

function parseTimeStr(str) {
  const [hh='09', mm='00'] = (str || '').split(':')
  return { hh: Number(hh), mm: Number(mm) }
}

function isAfterTime(now, targetH, targetM) {
  const h = now.getHours()
  const m = now.getMinutes()
  if (h > targetH) return true
  if (h === targetH && m >= targetM) return true
  return false
}

// --- 通知を実際に出す ---
function showNotification(title, body) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body })
  } else {
    alert(`${title}\n${body}`)
  }
}

// 月の収支を集計し、メッセージを作成する
function buildMonthlyMessage() {
  const records = loadRecords()
  const now = new Date()
  const y = now.getFullYear()
  const m = now.getMonth() + 1

  const monthly = records.filter(r => {
    const [yy, mm] = r.date.split('-')
    return Number(yy) === y && Number(mm) === m
  })

  if (monthly.length === 0) {
    return '今月はまだ入力がありません。まず1件記録してみましょう！'
  }

  let income = 0
  let expense = 0
  for (const r of monthly) {
    const amt = Number(r.amount) || 0
    if (r.type === '収入') income += amt
    else if (r.type === '支出') expense += amt
  }
  const bal = income - expense
  const ratio = income > 0 ? expense / income : 1

  if (income === 0 && expense > 0) {
    return `収入が未入力ですが支出が ${expense.toLocaleString()}円 あります。収入も記録して全体を把握しましょう。`
  }
  if (expense > income) {
    return `支出が収入を超えています！（収入 ${income.toLocaleString()}円 / 支出 ${expense.toLocaleString()}円）節約・固定費の見直しを検討しよう。`
  }
  if (ratio >= 0.8) {
    return `支出が収入の80％超です。（残り ${bal.toLocaleString()}円）月末まで意識して節約しよう！`
  }
  if (ratio <= 0.5 && bal > 0) {
    return `いいペース！収入の半分以下の支出で貯金チャンス。（貯金見込み ${bal.toLocaleString()}円）この調子で！`
  }
  return `今月のバランスはまずまず。（収入 ${income.toLocaleString()}円 / 支出 ${expense.toLocaleString()}円）引き続き記録を続けよう！`
}

// 月初または曜日リマインダーの通知
function notifyWithStats(prefix) {
  const msg = buildMonthlyMessage()
  showNotification('家計簿リマインダー', `${prefix}：${msg}`)
}

// 3日間未入力リマインダー通知
function notifyThreeDaysReminder() {
  showNotification('家計簿リマインダー', '3日間入力がありません。忘れずに記録しましょう')
}

// 毎分の通常チェック
function checkReminders() {
  const settings = loadSettings()
  if (!settings || !settings.enabled) return

  const now = new Date()
  const { hh, mm } = parseTimeStr(settings.time || '09:00')
  const afterTime = isAfterTime(now, hh, mm)

  // 月初チェック
  if (settings.monthStart) {
    const ym = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`
    const lastMonthDone = localStorage.getItem(LAST_MONTHLY_KEY)
    if (now.getDate() === 1 && afterTime && lastMonthDone !== ym) {
      notifyWithStats('月初リマインダー')
      localStorage.setItem(LAST_MONTHLY_KEY, ym)
    }
  }

  // 曜日チェック
  if (Array.isArray(settings.days) && settings.days.length > 0) {
    const todayD = now.getDay()
    if (settings.days.includes(todayD) && afterTime) {
      const todayStr = now.toISOString().slice(0,10)
      const lastWeeklyDone = localStorage.getItem(LAST_WEEKLY_KEY)
      if (lastWeeklyDone !== todayStr) {
        notifyWithStats('今週のリマインダー')
        localStorage.setItem(LAST_WEEKLY_KEY, todayStr)
      }
    }
  }

  // 3日間未入力チェック
  const records = loadRecords()
  const lastDate = getLastEntryDate(records)
  if (!lastDate) return
  const diffDays = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24))
  if (diffDays >= 3) {
    const todayStr = now.toISOString().slice(0,10)
    const lastNotified = localStorage.getItem(LAST_THREE_DAYS_KEY) || ''
    if (lastNotified !== todayStr) {
      notifyThreeDaysReminder()
      localStorage.setItem(LAST_THREE_DAYS_KEY, todayStr)
    }
  }

  // チェック日時を保存
  localStorage.setItem(LAST_CHECK_KEY, now.toISOString())
}

// ページを開いた時に開いてない間の未通知分を判定し通知する処理
function checkMissedReminders() {
  const now = new Date()
  const lastCheckStr = localStorage.getItem(LAST_CHECK_KEY)
  const lastCheck = lastCheckStr ? new Date(lastCheckStr) : null
  const settings = loadSettings()
  if (!settings || !settings.enabled) return

  // 3日未入力の通知判定
  const records = loadRecords()
  const lastEntry = getLastEntryDate(records)
  if (lastEntry) {
    const daysSinceLastEntry = Math.floor((now - lastEntry) / (1000 * 60 * 60 * 24))
    if (daysSinceLastEntry >= 3) {
      const lastNotifiedStr = localStorage.getItem(LAST_THREE_DAYS_KEY)
      const lastNotified = lastNotifiedStr ? new Date(lastNotifiedStr) : null
      // 最後の通知より後に3日未入力日があれば通知
      if (!lastNotified || lastNotified < lastEntry) {
        notifyThreeDaysReminder()
        localStorage.setItem(LAST_THREE_DAYS_KEY, now.toISOString().slice(0,10))
      }
    }
  }

  // 曜日・月初の通知判定
  if (lastCheck) {
    const dayMillis = 24 * 60 * 60 * 1000
    for (let d = new Date(lastCheck.getTime() + dayMillis); d <= now; d = new Date(d.getTime() + dayMillis)) {
      // 月初
      if (settings.monthStart && d.getDate() === 1) {
        const ym = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`
        const lastMonthDone = localStorage.getItem(LAST_MONTHLY_KEY)
        if (lastMonthDone !== ym) {
          notifyWithStats('月初リマインダー')
          localStorage.setItem(LAST_MONTHLY_KEY, ym)
        }
      }

      // 曜日
      if (Array.isArray(settings.days) && settings.days.length > 0) {
        if (settings.days.includes(d.getDay())) {
          const dayStr = d.toISOString().slice(0,10)
          const lastWeeklyDone = localStorage.getItem(LAST_WEEKLY_KEY)
          if (lastWeeklyDone !== dayStr) {
            notifyWithStats('今週のリマインダー')
            localStorage.setItem(LAST_WEEKLY_KEY, dayStr)
          }
        }
      }
    }
  }
  // 最後に今回チェック時刻を保存
  localStorage.setItem(LAST_CHECK_KEY, now.toISOString())
}
</script>
