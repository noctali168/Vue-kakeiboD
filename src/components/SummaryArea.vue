<template>
  <div class="component-container">
    <div class="header">
      <h3>{{ currentMonthYear }}の収支グラフ</h3>
    </div>

    <div class="charts-container">
      <div class="chart-section">
        <h4>支出</h4>
        <div class="chart-wrapper">
          <Pie v-if="expenseChartData.labels.length > 0" :data="expenseChartData" :options="baseChartOptions" /> <p v-else>今月の支出データがありません。</p>
        </div>
      </div>

      <div class="chart-section">
        <h4>収入</h4>
        <div class="chart-wrapper">
          <Pie v-if="incomeChartData.labels.length > 0" :data="incomeChartData" :options="baseChartOptions" /> <p v-else>今月の収入データがありません。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const props = defineProps({
  expenseData: { type: Object, required: true },
  incomeData: { type: Object, required: true },
  categories: { type: Object, required: true }
});

const currentMonthYear = computed(() => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  return `${year}年${month}月`;
});

const expenseChartData = computed(() => {
  const labels = Object.keys(props.expenseData);
  const data = Object.values(props.expenseData);
  
  const backgroundColors = labels.map(label => {
    const category = props.categories.支出.find(c => c.name === label);
    return category ? category.color : '#cccccc';
  });

  return {
    labels: labels,
    datasets: [{ backgroundColor: backgroundColors, data: data }]
  };
});

const incomeChartData = computed(() => {
  const labels = Object.keys(props.incomeData);
  const data = Object.values(props.incomeData);
  
  const backgroundColors = labels.map(label => {
    const category = props.categories.収入.find(c => c.name === label);
    return category ? category.color : '#cccccc';
  });

  return {
    labels: labels,
    datasets: [{ backgroundColor: backgroundColors, data: data }]
  };
});

// ★ここを修正します★ Chart.jsのオプションを以前のシンプルな状態に戻す
const baseChartOptions = { // expenseChartOptions, incomeChartOptions は不要になる
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { // 凡例のデフォルト位置（上部）に戻す
      position: 'top',
      labels: {
        color: '#2c3e50', // 凡例の文字色を濃くする (これは維持)
        font: {
          size: 12 // 凡例の文字サイズ (これは維持)
        }
      }
    },
    tooltip: { // ツールチップのカスタマイズを削除し、デフォルトに戻す
      // callbacks: {} の設定を削除
    },
    title: { // グラフのサブタイトル表示を削除
      display: false
    }
  }
};
</script>

<style scoped>
.header {
  text-align: center;
  margin-bottom: 1.5rem;
}
h3 {
  margin: 0;
  font-size: 1.8rem;
  color: #2c3e50;
}

.charts-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
}

.chart-section {
  text-align: center;
  flex: 1;
  min-width: 280px;
  max-width: 400px;
}

.chart-section h4 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #333;
}

.chart-wrapper {
  position: relative;
  width: 100%;
  height: 300px;
  margin: auto;
}
p {
  text-align: center;
  margin-top: 1rem;
  color: #888;
  font-size: 0.9em;
}
.component-container {
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  margin-bottom: 2rem;
}
</style>