<template>
  <footer class="app-footer">
    <p>&copy; 2025 INKO Bank. All rights reserved.</p>
  </footer>
</template>

<script setup>
// Header.vue をインポートする行は不要なので削除します。
// import Header from './components/Header.vue' <-- この行は削除
// import Footer from './components/Footer.vue' <-- この行も Footer.vue 自身では不要なので削除

// 特にロジックは必要ありません
</script>

<style scoped>
.app-footer {
  background-color: #333; /* 暗めの背景色 */
  color: white; /* 白い文字色 */
  text-align: center;
  padding: 3rem 1rem; /* 上下パディングを増やす (例: 3rem) */
  margin-top: 4rem; /* 上のコンテンツとの余白を増やす */
  font-size: 1rem; /* 文字サイズを調整 */
  width: 100%;
  box-sizing: border-box; /* パディングを含めて幅を計算 */
}

.app-footer p {
  margin: 0; /* デフォルトのマージンをリセット */
}
</style>