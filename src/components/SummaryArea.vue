<template>
  <div class="component-container">
    <div class="header">
      <h3>今月のグラフ</h3>
      <div class="toggle-buttons">
        <button @click="chartMode = '支出'" :class="{ active: chartMode === '支出' }">支出</button>
        <button @click="chartMode = '収入'" :class="{ active: chartMode === '収入' }">収入</button>
      </div>
    </div>
    <div class="chart-wrapper">
      <Pie v-if="chartData.labels.length > 0" :data="chartData" :options="chartOptions" />
      <p v-else>今月の{{ chartMode }}データがありません。</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

// ★変更点: incomeData と categories 全体を受け取る
const props = defineProps({
  expenseData: { type: Object, required: true },
  incomeData: { type: Object, required: true },
  categories: { type: Object, required: true }
});

// ★変更点: 現在表示中のグラフモードを管理する変数
const chartMode = ref('支出'); // 初期表示は支出グラフ

// ★変更点: chartModeに応じてグラフデータを動的に生成する
const chartData = computed(() => {
  const isExpense = chartMode.value === '支出';
  const dataObject = isExpense ? props.expenseData : props.incomeData;
  const categoryList = isExpense ? props.categories.支出 : props.categories.収入;

  const labels = Object.keys(dataObject);
  const data = Object.values(dataObject);
  
  const backgroundColors = labels.map(label => {
    const category = categoryList.find(c => c.name === label);
    return category ? category.color : '#cccccc';
  });

  return {
    labels: labels,
    datasets: [{ backgroundColor: backgroundColors, data: data }]
  };
});

const chartOptions = { responsive: true, maintainAspectRatio: false };
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}
h3 {
  margin: 0;
}
.toggle-buttons {
  display: flex;
  border: 1px solid #0d6efd;
  border-radius: 8px;
  overflow: hidden;
}
.toggle-buttons button {
  padding: 0.5rem 1rem;
  background-color: #fff;
  color: #0d6efd;
  border: none;
  cursor: pointer;
  font-weight: bold;
}
.toggle-buttons button.active {
  background-color: #0d6efd;
  color: white;
}
.chart-wrapper {
  position: relative;
  width: 100%;
  max-width: 400px;
  height: 400px;
  margin: auto;
}
p {
  text-align: center;
  margin-top: 2rem;
  color: #888;
}
.component-container {
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}
</style>