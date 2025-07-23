<template>
  <div class="component-container">
    <div class="header">
      <h3>{{ displayChartType === 'pie' ? currentMonthYear + 'の収支内訳' : '直近6ヶ月の収支推移' }}</h3>

      <div class="toggle-buttons chart-type-selector">
        <button @click="displayChartType = 'pie'" :class="{ active: displayChartType === 'pie' }">円グラフ表示</button>
        <button @click="displayChartType = 'bar'" :class="{ active: displayChartType === 'bar' }">棒グラフ表示</button>
      </div>
    </div>

    <div v-if="displayChartType === 'pie'" class="charts-container">
      <div class="chart-section">
        <h4>支出の内訳</h4>
        <div class="chart-wrapper">
          <Pie v-if="expenseChartData.labels.length > 0" :data="expenseChartData" :options="baseChartOptions" />
          <p v-else>今月の支出データがありません。</p>
        </div>
      </div>

      <div class="chart-section">
        <h4>収入の内訳</h4>
        <div class="chart-wrapper">
          <Pie v-if="incomeChartData.labels.length > 0" :data="incomeChartData" :options="baseChartOptions" />
          <p v-else>今月の収入データがありません。</p>
        </div>
      </div>
    </div>

    <div v-else-if="displayChartType === 'bar'" class="bar-chart-container">
      <div class="chart-wrapper large-chart-wrapper">
        <Bar v-if="barChartData.labels.length > 0" :data="barChartData" :options="barChartOptions" />
        <p v-else>データがありません。</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Pie, Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement
} from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement
);

const props = defineProps({
  expenseData: { type: Object, required: true },
  incomeData: { type: Object, required: true },
  categories: { type: Object, required: true },
  records: { type: Array, required: true },
});

// 円グラフと棒グラフの表示タイプを管理
const displayChartType = ref('bar'); // 初期表示は棒グラフのまま

const currentMonthYear = computed(() => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  return `${year}年${month}月`;
});

// --------- 円グラフデータ (支出) ---------
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

// --------- 円グラフデータ (収入) ---------
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

// 円グラフの共通オプション
const baseChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        color: '#2c3e50',
        font: {
          size: 12
        }
      }
    },
    tooltip: {},
    title: { display: false }
  }
};

// --------- 棒グラフ用ロジック ---------
function getPastMonths(count = 6) {
  const result = [];
  const now = new Date();
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    result.push(`${y}-${m.toString().padStart(2, '0')}`);
  }
  return result;
}

const barChartData = computed(() => {
  const months = getPastMonths(6);
  const spendData = [];
  const incomeData = [];

  months.forEach(month => {
    const filtered = props.records.filter(r => r.date.startsWith(month));
    const monthExpense = filtered
      .filter(r => r.type === '支出')
      .reduce((sum, r) => sum + Number(r.amount || 0), 0);
    const monthIncome = filtered
      .filter(r => r.type === '収入')
      .reduce((sum, r) => sum + Number(r.amount || 0), 0);

    spendData.push(monthExpense);
    incomeData.push(monthIncome);
  });

  return {
    labels: months,
    datasets: [
      {
        label: '支出',
        backgroundColor: '#FF8A80',
        data: spendData,
      },
      {
        label: '収入',
        backgroundColor: '#80CBC4',
        data: incomeData,
      },
    ],
  };
});

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top' },
    title: { display: false },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value) => value.toLocaleString() + ' 円',
      },
    },
  },
};
</script>

<style scoped>
.component-container {
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  margin-bottom: 2rem;
}
.header {
  text-align: center;
  margin-bottom: 1.5rem;
}
h3 {
  margin: 0;
  font-size: 1.8rem;
  color: #2c3e50;
  margin-bottom: 1rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

/* グラフタイプ選択ボタン */
.toggle-buttons {
  display: flex;
  border: 1px solid #0d6efd;
  border-radius: 8px;
  overflow: hidden;
  width: fit-content;
  margin: 0 auto 1.5rem; /* 中央寄せと下マージン */
}
.toggle-buttons button {
  padding: 0.5rem 1rem;
  background-color: #fff;
  color: #0d6efd;
  border: none;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s;
  flex-grow: 1;
}
.toggle-buttons button.active {
  background-color: #0d6efd;
  color: white;
}
.toggle-buttons button:not(.active):hover {
  background-color: #e7f1ff;
}

/* 円グラフのコンテナ */
.charts-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem; /* グラフ間のスペース */
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
  font-size: 1.2rem;
  font-weight: 600;
}

/* 各グラフのラッパー */
.chart-wrapper {
  position: relative;
  width: 100%;
  height: 250px; /* 円グラフの高さ */
  margin: auto;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  border-radius: 8px;
  overflow: hidden;
}

/* 棒グラフ専用のコンテナ */
.bar-chart-container {
  width: 100%;
  padding-top: 1rem; /* グラフの上部にスペース */
}

.large-chart-wrapper {
  height: 350px; /* 棒グラフの高さ */
}

p {
  text-align: center;
  margin-top: 1rem;
  color: #888;
  font-size: 0.9em;
}
</style>

<style lang="css">
/* vue-chartjs の Canvas 要素に直接スタイルを適用 */
.chart-wrapper canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>