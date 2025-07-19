<template>
  <section class="monthly-rating">
    <h3>今月の家計評価</h3>

    <div v-if="ratingData">
      <!-- 画像が指定されていれば表示 -->
      <img
        v-if="ratingData.image"
        :src="ratingData.image"
        alt="評価画像"
        class="rating-image"
      />

      <p class="rating-comment">{{ ratingData.comment }}</p>
    </div>
    <p v-else>今月のデータがまだありません。</p>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 5段階評価（コメントと画像パス）
const ratingLevels = [
  {
    label: '非常に良い',
    comment: '素晴らしい家計管理！貯金もバッチリですね！',
    image: '/seityou.png' // ←あとで画像パスを設定してもOK
  },
  {
    label: '良い',
    comment: '順調です！この調子で！',
    image: '/wakadori.png'
  },
  {
    label: '普通',
    comment: 'まずまず。無駄遣いには注意！',
    image: '/hinadori.png'
  },
  {
    label: '悪い',
    comment: 'ちょっと使いすぎ？見直してみよう！',
    image: '/hina.png'
  },
  {
    label: '非常に悪い',
    comment: '対策を考えよう！',
    image: '/tamago.png'
  },
  {
    label: '対策必須',
    comment: '深刻な状況です。すぐに対策を考えましょう！', // ← 元の「非常に悪い」を修正
    image: '/yakitori.png'
  }
]

const ratingData = ref(null)

function calculateMonthlyBalance(records) {
  const now = new Date()
  const thisMonth = now.toISOString().slice(0, 7)

  let income = 0
  let expense = 0

  for (const record of records) {
    if (record.date.slice(0, 7) === thisMonth) {
      if (record.type === '収入') {
        income += Number(record.amount)
      } else if (record.type === '支出') {
        expense += Number(record.amount)
      }
    }
  }

  return income - expense
}

function getRating(balance) {
  if (balance >= 200) return ratingLevels[0]
  if (balance >= 100) return ratingLevels[1]
  if (balance >= 50) return ratingLevels[2]
  if (balance >= 25) return ratingLevels[3]
  if (balance >= 0) return ratingLevels[4]
  return ratingLevels[5]
}

onMounted(() => {
  const records = JSON.parse(localStorage.getItem('kakeibo-records') || '[]')
  if (records.length === 0) return

  const balance = calculateMonthlyBalance(records)
  ratingData.value = getRating(balance)
})
</script>

<style scoped>
.monthly-rating {
  margin: 1.5rem;
  padding: 1rem;
  background: #fefefe;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  text-align: center;
}

.rating-image {
  width: 120px;
  height: auto;
  margin-bottom: 1rem;
}

.rating-comment {
  font-size: 1.2rem;
  font-weight: 500;
}
</style>
