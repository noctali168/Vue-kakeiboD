<template>
  <div class="component-container">
    <h3>アチーブメント</h3>
    <p class="achievement-summary">達成した項目: {{ unlockedCount }} / {{ totalCount }}</p>
    <div class="achievements-grid">
      <div
        v-for="achievement in allAchievements"
        :key="achievement.id"
        class="achievement-card"
        :class="{ unlocked: isUnlocked(achievement.id) }"
      >
        <div class="icon">{{ achievement.icon }}</div>
        <div class="details">
          <h4 class="name">{{ achievement.name }}</h4>
          <p class="description">{{ achievement.description }}</p>
        </div>
        <div v-if="isUnlocked(achievement.id)" class="unlocked-badge">✔️</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  allAchievements: {
    type: Array,
    required: true
  },
  unlockedIds: {
    type: Set,
    required: true
  }
});

const isUnlocked = (id) => props.unlockedIds.has(id);

const unlockedCount = computed(() => props.unlockedIds.size);
const totalCount = computed(() => props.allAchievements.length);
</script>

<style scoped>
.achievement-summary {
  text-align: center;
  font-size: 1.1em;
  font-weight: 500;
  color: #6c757d;
  margin-top: -0.5rem;
}
.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}
.achievement-card {
  display: flex;
  align-items: center;
  background-color: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  filter: grayscale(80%);
  opacity: 0.6;
  transition: all 0.3s ease;
  position: relative;
}
.achievement-card.unlocked {
  filter: grayscale(0%);
  opacity: 1;
  background-color: #fff;
  border-color: #ffc107;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.icon {
  font-size: 3rem;
  margin-right: 1.5rem;
}
.details {
  flex-grow: 1;
}
.name {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
}
.description {
  margin: 0;
  font-size: 0.9em;
  color: #6c757d;
}
.unlocked-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 1.5rem;
  color: #ff9800;
  text-shadow: 0 0 5px white;
}
</style>