<template>
  <div class="notify-page-wrapper">
    <BackHome />

    <div class="notify-page-container component-container">
      <h2>設定</h2>

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
import DataIO from '../components/DataIO.vue' // ★これをインポート
import { ref } from 'vue'

const isOpen = ref({
  name: true,
  dataIO: false, // ★これを追加
  reset: false,
  reminder: false,
})

const toggleSection = (key) => {
  isOpen.value[key] = !isOpen.value[key]
}

// NameSettingコンポーネントが自身のロジックを持つため、
// このページの<script>からは関連ロジックを削除してOKです。
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
}
.accordion:first-of-type {
  margin-top: 0;
}
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
.accordion-content {
  padding: 1rem;
  background: #ffffff;
  border-top: 1px solid #e0e0e0;
}
</style>