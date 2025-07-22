<template>
  <div class="username-setting">
    <p>こんにちは、<strong>{{ currentName || '名無し' }}</strong>さん！</p>

    <form @submit.prevent="updateName">
      <label class="name-input-label"> 名前を変更：
        <input v-model="newName" type="text" placeholder="新しい名前を入力" />
      </label>
      <button type="submit" :disabled="!newName.trim()">変更</button>
    </form>

    <p v-if="saved" class="saved-msg">✅ 名前を変更しました！</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const currentName = ref('')
const newName = ref('')
const saved = ref(false)

onMounted(() => {
  currentName.value = localStorage.getItem('kakeibo-username') || ''
})

const updateName = () => {
  const trimmedName = newName.value.trim()
  if (!trimmedName) return
  localStorage.setItem('kakeibo-username', trimmedName)
  currentName.value = trimmedName
  newName.value = ''
  saved.value = true
  setTimeout(() => (saved.value = false), 2000)
}
</script>

<style scoped>
.username-setting {
  /* 親のaccordion-contentがpaddingを持つため、ここでの余分なマージンは削除 */
  margin-top: 0;
  margin-bottom: 0;
}
.username-setting p {
  margin-bottom: 0.8rem; /* 説明文の下に少し余白 */
  color: #2c3e50;
  font-weight: 600;
}
form {
  display: flex;
  flex-direction: row; /* ★ここを修正します: ラベルとボタンを横並びに */
  gap: 0.5rem;
  align-items: center; /* 垂直方向中央揃え */
  flex-wrap: wrap; /* 画面が狭いときに折り返す */
}
.name-input-label { /* 新しいクラスのスタイル */
  flex-grow: 1; /* ラベルと入力欄が残りのスペースを埋める */
  display: flex; /* ラベルテキストと入力フィールドをFlexで並べる */
  align-items: center; /* 垂直方向中央揃え */
  gap: 0.5rem; /* ラベルテキストと入力フィールドの間隔 */
  font-weight: bold; /* ラベルを太字に */
  color: #2c3e50; /* ラベルの色を統一 */
}
input {
  flex: 1; /* 入力フィールドが残りのスペースを埋める */
  padding: 0.6rem; /* 縦パディングを調整 */
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px; /* 角丸を統一 */
  background-color: #f8f8f8; /* 背景色を統一 */
  color: #2c3e50; /* 文字色を統一 */
  box-sizing: border-box; /* パディングを含めて幅を計算 */
  min-width: 100px; /* 最小幅を設定 */
}
button {
  /* NotifyPageで定義した:deep()スタイルを継承 */
  padding: 0.6rem 1.2rem; /* パディングを統一 */
  font-size: 1rem;
  border-radius: 5px; /* 角丸を統一 */
  flex-shrink: 0; /* ボタンは縮まないように */
}
button:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}
.saved-msg {
  margin-top: 0.5rem;
  color: green;
  font-weight: bold;
}
</style>