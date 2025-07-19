<template>
  <div class="component-container goal-tracker">
    <h3>今月の目標達成率</h3>
    <div class="goal-setting">
      <span>目標金額：</span>
      <input type="number" min="0" v-model.number="localGoal" @change="updateGoal" />円
    </div>

    <div class="progress-bar-container">
      <div class="progress-bar" :style="{ width: progressBarWidth + '%' }" :class="{ 'over-100': achievementRate > 100 }"></div>
    </div>

    <div class="summary">
      <div class="summary-item">
        <span class="label">現在の収支</span>
        <span class="value" :class="balance >= 0 ? 'income' : 'expense'">
          {{ balance.toLocaleString() }} 円
        </span>
      </div>
      <div class="summary-item text-right">
        <span class="label">達成率</span>
        <span class="value achievement">{{ achievementRate.toFixed(1) }} %</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  goalAmount: { type: Number, required: true },
  totalIncome: { type: Number, required: true },
  totalExpense: { type: Number, required: true },
});
const emit = defineEmits(['update:goal', 'update:achievementRate']);

const localGoal = ref(props.goalAmount);

watch(() => props.goalAmount, (newVal) => { localGoal.value = newVal; });

const updateGoal = () => {
  if (localGoal.value < 0) { localGoal.value = 0; }
  emit('update:goal', localGoal.value);
};

const balance = computed(() => props.totalIncome - props.totalExpense);
const achievementRate = computed(() => {
  if (localGoal.value <= 0) return 0;
  return (balance.value / localGoal.value) * 100;
});
const progressBarWidth = computed(() => {
  const rate = achievementRate.value;
  if (rate <= 0) return 0;
  if (rate > 100) return 100;
  return rate;
});

watch(achievementRate, (newRate) => {
  emit('update:achievementRate', newRate);
});
</script>

<style scoped>
.goal-tracker { background: linear-gradient(45deg, #4e54c8, #8f94fb); color: white; border-radius: 12px; padding: 1.5rem 2rem; }
h3 { margin-top: 0; text-align: center; font-weight: 600; margin-bottom: 1.5rem; }
.goal-setting { display: flex; justify-content: center; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem; }
.goal-setting input { width: 120px; padding: 0.5rem; border: none; border-radius: 5px; text-align: right; font-size: 1.1em; font-weight: bold; }
.progress-bar-container { width: 100%; height: 20px; background-color: rgba(255, 255, 255, 0.3); border-radius: 10px; overflow: hidden; margin-bottom: 1rem; }
.progress-bar { height: 100%; background-color: #4caf50; border-radius: 10px; transition: width 0.5s ease-in-out, background-color 0.5s; }
.progress-bar.over-100 { background-color: #ffc107; }
.summary { display: flex; justify-content: space-between; }
.summary-item { display: flex; flex-direction: column; }
.summary-item.text-right { text-align: right; }
.label { font-size: 0.9em; opacity: 0.8; }
.value { font-size: 1.4em; font-weight: bold; }
.value.income { color: #c8e6c9; }
.value.expense { color: #ffcdd2; }
.value.achievement { color: #a5d6a7; }
</style>