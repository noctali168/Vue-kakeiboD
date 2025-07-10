<template>
  <section class="nav-cards">
    <div class="card" @click="goTo('form')">
      <h3>✍️ 入力フォーム</h3>
      <p>支出や収入を入力</p>
    </div>
    <div class="card" @click="goTo('list')">
      <h3>📄 一覧を見る</h3>
      <p>記録をすべて表示</p>
    </div>
    <div class="card" @click="goTo('notify')">
      <h3>🔔    設定</h3>
      <p>メール通知や制限</p>
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
  gap: 1rem;
  justify-content: space-around;
  margin-top: 1rem;
  padding: 1rem;
}
.card {
  background: #e0f7fa;
  border-radius: 10px;
  padding: 1rem;
  width: 30%;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  cursor: pointer;
  transition: transform 0.2s;
}
.card:hover {
  transform: scale(1.03);
}
</style>
