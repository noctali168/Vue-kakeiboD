<template>
  <div class="notify-page-wrapper">
    <BackHome />

    <div class="notify-page-container component-container">
      <h2>通知・設定</h2>

      <section class="accordion">
        <header @click="toggleSection('name')" class="accordion-header">
          あなたの名前
          <span>{{ isOpen.name ? '▲' : '▼' }}</span>
        </header>
        <div v-show="isOpen.name" class="accordion-content">
          <NameSetting/>
        </div>
      </section>

      <section class="accordion">
        <header @click="toggleSection('reset')" class="accordion-header">
          データリセット
          <span>{{ isOpen.reset ? '▲' : '▼' }}</span>
        </header>
        <div v-show="isOpen.reset" class="accordion-content">
          <Reset />
        </div>
      </section>

      <section class="accordion">
        <header @click="toggleSection('reminder')" class="accordion-header">
          リマインダー設定
          <span>{{ isOpen.reminder ? '▲' : '▼' }}</span>
        </header>
        <div v-show="isOpen.reminder" class="accordion-content">
          <ReminderSetting />
        </div>
      </section>

      <section class="accordion">
        <header @click="toggleSection('fixedCost')" class="accordion-header">
          固定費設定
          <span>{{ isOpen.fixedCost ? '▲' : '▼' }}</span>
        </header>
        <div v-show="isOpen.fixedCost" class="accordion-content">
          <FixedCost />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import ReminderSetting from '../components/ReminderSetting.vue'
import NameSetting from '../components/NameSetting.vue'
import Reset from '../components/Reset.vue'
import FixedCost from '../components/FixedCost.vue'
import BackHome from '../components/BackHome.vue'
import { ref, onMounted } from 'vue'

const username = ref('')
const saved = ref(false)

const isOpen = ref({
  name: true,
  reset: false,
  reminder: false,
  fixedCost: false,
})

const toggleSection = (key) => {
  isOpen.value[key] = !isOpen.value[key]
}

onMounted(() => {
  username.value = localStorage.getItem('kakeibo-username') || ''
})

const saveName = () => {
  localStorage.setItem('kakeibo-username', username.value)
  saved.value = true
  setTimeout(() => (saved.value = false), 2000)
}
</script>

<style scoped>
/* ★ここを追加・修正します★ */
/* ページ全体のコンテンツを囲むラッパー */
.notify-page-wrapper {
    /* Headerの高さ(約72px)と、上部のコンテンツとの余白(2rem)を確保 */
    padding-top: calc(72px + 2rem);
    /* 左右のパディングもここで設定し、コンテンツ全体に適用 */
    padding-left: 2rem;
    padding-right: 2rem;
    padding-bottom: 2rem; /* 下部パディング */
    box-sizing: border-box;
    max-width: 1400px; /* HomePageのコンテナ幅に合わせる */
    margin: 0 auto; /* 中央寄せ */
}

/* BackHomeLinkのデフォルトマージンをリセット */
:deep(.back-home) {
    margin-top: 0; /* 上マージンをリセット */
    margin-bottom: 1rem; /* リンクと次の要素の間隔 */
}


/* ページ全体のコンテナ（白枠） */
.notify-page-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem; /* 内部パディング */
  
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  box-sizing: border-box;

  /* padding-top は notify-page-wrapper が担当するため、ここから削除 */
  padding-top: 2rem; /* 内部パディングとして2remを維持 */
}

/* ページ全体のタイトル */
h2 {
  text-align: center;
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

/* アコーディオンの基本スタイル */
.accordion {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-top: 1rem;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}
.accordion:first-of-type {
    margin-top: 0;
}


/* アコーディオンヘッダー */
.accordion-header {
  background-color: #1abc9c;
  color: white;
  padding: 0.8rem 1rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  user-select: none;
  font-size: 1.1rem;
  transition: background-color 0.2s ease;
}
.accordion-header:hover {
    background-color: #16a085;
}

/* アコーディオンコンテンツ */
.accordion-content {
  padding: 1rem;
  background: #ffffff;
  border-top: 1px solid #e0e0e0;
}

/* ページ内のフォーム要素のスタイル統一（:deep()は前回変更済みなので省略） */
</style>