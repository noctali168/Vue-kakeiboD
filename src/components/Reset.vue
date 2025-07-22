<template>
  <div class="reset-area">
    <p class="reset-description">アプリのデータをリセットします。実行前に内容をよくご確認ください。</p>
    <div class="reset-buttons">
      <button @click="resetAll" class="btn-reset-all">
        全データをリセット
        <span class="button-subtext">（名前・固定費も含む）</span>
      </button>
      <button @click="resetThisMonth" class="btn-reset-month">
        今月の入力データだけリセット
        <span class="button-subtext">（固定費・名前は残す）</span>
      </button>
    </div>
    <p v-if="message" class="message">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const message = ref('')

const resetAll = () => {
  if (confirm('本当に全データ（名前・固定費含む）を消しますか？')) {
    localStorage.clear()
    message.value = 'すべてのデータをリセットしました。'
    setTimeout(() => (message.value = ''), 3000)
    location.reload() // ページをリロードして反映
  }
}

const resetThisMonth = () => {
  if (!confirm('今月の入力データだけをリセットしますか？ 固定費・名前は残ります。')) return

  const records = JSON.parse(localStorage.getItem('kakeibo-records') || '[]')
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1

  // 今月以外のデータだけ残すフィルター
  const filtered = records.filter(r => {
    const [y, m] = r.date.split('-').map(Number)
    return !(y === year && m === month)
  })

  localStorage.setItem('kakeibo-records', JSON.stringify(filtered))
  message.value = '今月の入力データをリセットしました。'
  setTimeout(() => (message.value = ''), 3000)
  location.reload() // ページをリロードして反映
}
</script>

<style scoped>
.reset-area {
  margin-top: 0; /* 親コンポーネントのパディングに任せるためリセット */
}
.reset-description {
  font-size: 0.95em;
  color: #666;
  margin-bottom: 1rem; /* 説明文の下に余白 */
  text-align: left; /* 左寄せ */
}

.reset-buttons {
  display: flex; /* ボタンを横並びにする */
  flex-direction: column; /* デフォルトは縦並びにして、広い画面で横並びにする */
  gap: 0.75rem; /* ボタン間の余白 */
  margin-bottom: 1rem; /* ボタン群の下に余白 */
}

button {
  display: flex; /* ボタン内のテキストとアイコンをFlexで中央寄せ */
  align-items: center;
  justify-content: center;
  text-align: center;
  white-space: normal; /* テキストが折り返すようにする */
  line-height: 1.3; /* 行間を調整 */

  /* buttonの共通スタイルをNotifyPageで定義した:deep()から継承 */
  padding: 0.8rem 1.2rem; /* パディングを少し大きくしてタップしやすく */
  font-size: 1rem;
  border-radius: 8px; /* 角丸を他の要素と統一 */
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1); /* 軽いシャドウを追加 */
  transition: all 0.2s ease;
}
button:hover {
  opacity: 0.9;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15); /* ホバー時のシャドウを強調 */
}
.button-subtext {
  font-size: 0.8em;
  opacity: 0.8;
  display: block; /* 改行させる */
  margin-left: 0.5em; /* アイコンとテキストの間に余白 */
}

.btn-reset-all {
  background-color: #e53935; /* 赤色 */
  color: white;
}
.btn-reset-month {
  background-color: #ff9800; /* オレンジ色 */
  color: white;
}

.message {
  color: #198754; /* 成功メッセージの色を統一 */
  font-weight: bold;
  margin-top: 0.5rem;
  text-align: left; /* 左寄せ */
}

/* レスポンシブ対応：広い画面ではボタンを横並びにする */
@media (min-width: 600px) {
  .reset-buttons {
    flex-direction: row; /* 横並び */
    flex-wrap: wrap; /* 必要に応じて折り返す */
    justify-content: center; /* 中央寄せ */
  }
  .reset-buttons button {
    flex: 1; /* 均等な幅を占める */
    max-width: 48%; /* 2つ並んだ時に隙間を作る */
  }
}
</style>