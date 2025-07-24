<template>
  <div class="notify-page-wrapper">
    <BackHome />

    <div class="notify-page-container component-container">
      <h2>npm設定</h2>

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
        <header @click="toggleSection('dataIO')" class="accordion-header">
          データ入出力
          <span>{{ isOpen.dataIO ? '▲' : '▼' }}</span>
        </header>
        <div v-show="isOpen.dataIO" class="accordion-content">
          <DataIO />
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
    </div>
  </div>
</template>

<script setup>
import ReminderSetting from '../components/ReminderSetting.vue'
import NameSetting from '../components/NameSetting.vue'
import Reset from '../components/Reset.vue'
import BackHome from '../components/BackHome.vue'
import DataIO from '../components/DataIO.vue'
import { ref } from 'vue'

const isOpen = ref({
  name: true,
  dataIO: false,
  reset: false,
  reminder: false,
})

const toggleSection = (key) => {
  isOpen.value[key] = !isOpen.value[key]
}
</script>

<style scoped>
/* ページ全体のコンテンツを囲むラッパー */
.notify-page-wrapper {
  padding-top: calc(72px + 2rem);
  padding-left: 2rem;
  padding-right: 2rem;
  padding-bottom: 2rem;
  box-sizing: border-box;
  max-width: 1400px;
  margin: 0 auto;
}

:deep(.back-home) {
  margin-top: 0;
  margin-bottom: 1rem;
}

.notify-page-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

h2 {
  text-align: center;
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

.accordion {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-top: 1rem;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
}

.accordion:first-of-type {
  margin-top: 0;
}

.accordion-header {
  /* ★ボタンの視認性を高めるため色を変更 */
  background-color: #2c3e50;
  color: white;
  padding: 0.8rem 1.2rem; /* 少しパディングを調整 */
  font-weight: bold;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center; /* アイコンを中央揃え */
  user-select: none;
  font-size: 1.1rem;
  transition: background-color 0.2s ease;
}

.accordion-header:hover {
  /* ★ホバー時の色を変更 */
  background-color: #34495e;
}

.accordion-content {
  /* ★コンテンツエリアの背景色を少し変更 */
  padding: 1.5rem; /* パディングを調整 */
  background: #f9f9f9;
  border-top: 1px solid #e0e0e0;
}

/*
 * ★子コンポーネント内のボタンを見やすくするためのスタイル
 * :deep() を使うことで、このコンポーネントのスコープ付きCSSの影響を
 * 子コンポーネントまで届かせることができます。
 * 子コンポーネント側で button タグや .button クラスを使っていると仮定しています。
*/
:deep(.accordion-content button),
:deep(.accordion-content .button) {
  display: inline-block;
  font-weight: bold;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  user-select: none;
  border: 1px solid transparent;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  /* ★ボタンの配色を変更 */
  color: #fff;
  background-color: #1abc9c; /* 明るい緑がかった青 */
  border-color: #1abc9c;
}

:deep(.accordion-content button:hover),
:deep(.accordion-content .button:hover) {
  /* ★ホバー時の色 */
  background-color: #16a085; /* 少し濃い色 */
  border-color: #16a085;
}

/* 赤系のボタン（削除など）が必要な場合 */
:deep(.accordion-content .button-danger) {
    background-color: #e74c3c;
    border-color: #e74c3c;
}

:deep(.accordion-content .button-danger:hover) {
    background-color: #c0392b;
    border-color: #c0392b;
}
</style>