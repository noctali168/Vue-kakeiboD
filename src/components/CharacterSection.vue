<template>
  <section class="character-section">
    </section>
  <BirdCondition />
</template>

<script setup>
import BirdCondition from './BirdCondition.vue'
import SeasonDisplay from './SeasonDisplay.vue' // このimportは残しておいても問題ありません
import { ref, onMounted } from 'vue'

const username = ref('')

onMounted(() => {
  username.value = localStorage.getItem('kakeibo-username') || ''
})
</script>

<style scoped>
.character-section {
  text-align: center; /* CharacterSection自体は中央寄せを維持 */
  font-size: 1.5rem;
  margin-top: 1rem; /* 必要に応じて調整 */
}
</style>