<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  const records = JSON.parse(localStorage.getItem('kakeibo-records') || '[]')
  const fixed = JSON.parse(localStorage.getItem('kakeibo-fixed') || '[]')

  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const dateStr = `${year}-${month}-01`

  let updated = false

  fixed.forEach(fix => {
    const key = fix.frequency === 'yearly' ? `${year}` : `${year}-${month}`
    const alreadyExists = records.some(r => r.id === `${fix.id}-${key}`)

    if (!alreadyExists) {
      const newRecord = {
        id: `${fix.id}-${key}`,
        date: dateStr,
        type: fix.type || '支出',
        name: fix.name,
        category: '固定費',
        amount: fix.amount
      }
      records.push(newRecord)
      updated = true
    }
  })

  if (updated) {
    localStorage.setItem('kakeibo-records', JSON.stringify(records))
  }
})
</script>
