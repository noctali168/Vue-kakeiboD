<template>
  <footer class="app-footer">
    <p>&copy; 2025 INKO Bank. All rights reserved.</p>
  </footer>
</template>

<script setup>
// 特にロジックは必要ありません
</script>

<style scoped>
.app-footer {
  background-color: #333; /* 暗めの背景色 */
  color: white; /* 白い文字色 */
  text-align: center;
  padding: 1rem;
  margin-top: 3rem; /* 上のコンテンツとの余白 */
  font-size: 0.9rem;
  width: 100%;
  box-sizing: border-box; /* パディングを含めて幅を計算 */
}

.app-footer p {
  margin: 0; /* デフォルトのマージンをリセット */
}
</style>