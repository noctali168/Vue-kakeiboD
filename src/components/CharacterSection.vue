<template>
  <section class="character-section">
    <p v-if="username" class="welcome-message">{{ username }}さん、今日も一日頑張りましょう！</p>
    <p v-else class="welcome-message">今日も一日頑張りましょう！</p>

    <BirdCondition :username="username" />

    </section>
</template>

<script setup>
import BirdCondition from './BirdCondition.vue'
// SeasonDisplay のインポートを削除
// import SeasonDisplay from './SeasonDisplay.vue'
import { ref, onMounted } from 'vue'

const props = defineProps({
  username: {
    type: String,
    default: '',
  },
});
</script>

<style scoped>
.character-section {
  text-align: center;
  font-size: 1.5rem;
  position: relative;
  min-height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.welcome-message {
  font-size: 1em;
  font-weight: 700;
  color: #2c3e50;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  letter-spacing: 0.5px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);

  position: static;
  transform: none;
  width: auto;
  padding: 0;
  margin-bottom: 0.5rem; /* BirdCondition との間隔を調整 */
}

/* BirdConditionコンポーネント自体のマージンを調整 */
:deep(.monthly-rating) {
  text-align: center;
  margin-top: 0.5rem; /* welcome-message との間隔 */
  /* SeasonDisplay がなくなったため、このマージンを調整 */
  margin-bottom: 0; /* 下の要素がなくなるため、不要なマージンをリセット */
  padding: 0;
  border: none;
  box-shadow: none;
  background-color: transparent;
}

/* SeasonDisplay の :deep() スタイルは不要になるため削除 */
/*
:deep(.season-display) {
  margin-top: 0.5rem;
  font-size: 1.1rem;
  color: #555;
}
:deep(.season-display strong) {
  color: #1abc9c;
}
*/
</style>