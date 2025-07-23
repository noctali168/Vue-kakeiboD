<template>
  <section class="character-section">
    <p v-if="username" class="welcome-message">{{ username }}さん、今日も一日頑張りましょう！</p>
    <p v-else class="welcome-message">今日も一日頑張りましょう！</p>
    <BirdCondition />
  </section>
</template>

<script setup>
import BirdCondition from './BirdCondition.vue'
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
  text-align: center; /* CharacterSection自体は中央寄せを維持 */
  font-size: 1.5rem;
  position: relative; /* 相対配置の基準点とする */
}

.welcome-message {
  font-size: 1em; /* フォントサイズを小さく調整 */
  font-weight: 700; /* さらに太く強調 */
  color: #2c3e50;
  font-family: sans-serif;
  letter-spacing: 0.5px; /* 文字間隔を少し開ける */
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1); /* 軽い影を追加 */

  position: absolute;
  top: 10%; /* 上からの位置を調整 */
  left: 50%; /* 左右中央 */
  transform: translateX(-50%); /* 水平方向の中央揃え */
  margin-bottom: 0; /* インコとのデフォルトマージンを削除 */
  white-space: nowrap; /* 長い名前でも改行しない */
  width: 90%; /* 親要素の幅に対して90%に制限し、はみ出しにくくする */
  box-sizing: border-box; /* パディングとボーダーを幅に含める */
  padding: 0 5px; /* 左右に少しパディングを持たせる */
}

/* BirdConditionコンポーネントのスタイル調整（必要に応じて） */
:deep(.bird-condition-container) {
  /* 必要に応じてマージンなどを調整 */
  margin-top: 2rem; /* メッセージとの間隔を調整（微調整） */
}
</style>