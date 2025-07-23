<template>
  <section class="character-section">
    <p v-if="username" class="welcome-message">{{ username }}さん、今日も一日頑張りましょう！</p>
    <p v-else class="welcome-message">今日も一日頑張りましょう！</p>
    <BirdCondition />
  </section>
</template>

<script setup>
import BirdCondition from './BirdCondition.vue'
// import SeasonDisplay from './SeasonDisplay.vue' // このimportは残しておいても問題ありません
import { ref, onMounted } from 'vue'

// ★追加★ username を props として定義
const props = defineProps({
  username: {
    type: String,
    default: '',
  },
});

// CharacterSection 内部で username を直接参照する必要がなくなったため削除
// const username = ref('')
// onMounted(() => {
//   username.value = localStorage.getItem('kakeibo-username') || ''
// })
</script>

<style scoped>
.character-section {
  text-align: center; /* CharacterSection自体は中央寄せを維持 */
  font-size: 1.5rem;
  margin-top: 1rem; /* 必要に応じて調整 */
}

/* ★追加★ ウェルカムメッセージのスタイル */
.welcome-message {
  font-size: 1.1em; /* メッセージのフォントサイズ */
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 1rem; /* インコとの間隔 */
}
</style>