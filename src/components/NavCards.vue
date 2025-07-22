<template>
  <section class="nav-cards component-container"> <div class="card" @click="goTo('form')">
      <h3>入力フォーム</h3> <p>支出や収入を入力</p>
    </div>
    <div class="card" @click="goTo('list')">
      <h3>一覧を見る</h3> <p>記録をすべて表示</p>
    </div>
    <div class="card" @click="goTo('notify')">
      <h3>設定</h3> <p>メール通知や制限</p>
    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goTo = (page) => {
  router.push(`/${page}`)
}
</script>

<style scoped>
.nav-cards {
  display: flex;
  gap: 2rem;
  justify-content: space-between;
  margin-top: 2rem;
  /* component-containerのスタイルを適用するため、既存の背景色は削除 */
  /* background: #e0f7fa; は削除 */
  padding: 1.5rem; /* component-containerと同じパディング */
  box-shadow: 0 2px 5px rgba(0,0,0,0.05); /* component-containerと同じシャドウ */
  border: 1px solid #e0e0e0; /* component-containerと同じボーダー */
  border-radius: 8px; /* component-containerと同じ角丸 */
}

.card {
  flex: 1;
  background: #f9f9f9; /* カード内の背景色を明るいグレーに */
  border-radius: 8px; /* 角丸を少し大きく */
  padding: 1.5rem 1rem; /* 内部パディングを調整 */
  text-align: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1); /* シャドウを控えめに */
  cursor: pointer;
  transition: transform 0.2s, background-color 0.2s; /* ホバー時のアニメーションを追加 */
  min-width: 180px; /* 最小幅を調整 */
}

.card:hover {
  transform: translateY(-5px); /* 少し上に浮き上がる */
  background-color: #eaf7ff; /* ホバー時にわずかに青みがかった背景色 */
  box-shadow: 0 4px 8px rgba(0,0,0,0.15); /* ホバー時のシャドウを強調 */
}

.card h3 {
  font-size: 1.2rem;
  font-weight: 700; /* 太字に */
  color: #2c3e50; /* 文字色を濃く */
  margin-top: 0;
  margin-bottom: 0.5rem;
}

.card p {
  font-size: 0.95rem;
  color: #666; /* サブテキストの色を調整 */
  margin-top: 0;
  margin-bottom: 0;
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .nav-cards {
    flex-direction: column; /* 縦並びにする */
    gap: 1rem; /* 縦並び時の間隔 */
    padding: 1rem; /* モバイル時のパディング */
  }
  .card {
    min-width: unset; /* 最小幅指定を解除 */
    width: 100%; /* 全幅に広げる */
    padding: 1.2rem; /* モバイル時のパディング */
  }
}
</style>