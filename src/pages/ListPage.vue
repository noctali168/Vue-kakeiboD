<template>
    <div class="list-page-wrapper">
        <BackHomeLink />
        <div class="list-page-container component-container">
            <h2>{{ year }}年{{ month }}月の記録</h2>
            <table v-if="filtered.length > 0">
                <thead>
                    <tr>
                        <th>日付</th>
                        <th>区分</th>
                        <th>品物</th>
                        <th>カテゴリ</th>
                        <th>金額</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="r in filtered" :key="r.id">
                        <td>{{ r.date }}</td>
                        <td>{{ r.type }}</td>
                        <td>{{ r.name }}</td>
                        <td>{{ r.category }}</td>
                        <td>{{ r.amount }}円</td>
                    </tr>
                </tbody>
            </table>
            <p v-else class="no-record-message">この月のデータはありません。</p>
        </div>
    </div>
</template>


<script setup>
import BackHomeLink from '../components/BackHome.vue'
import { ref, onMounted, computed } from 'vue'

const records = ref([])
const year = new Date().getFullYear()
const month = new Date().getMonth() + 1

const filtered = computed(() => {
  return records.value.filter(r => {
    const [y, m] = r.date.split('-')
    return Number(y) === year && Number(m) === month
  })
})

onMounted(() => {
  const data = JSON.parse(localStorage.getItem('kakeibo-records') || '[]')
  records.value = data
})
</script>

<style scoped>
/* ★ここを追加・修正します★ */
/* ページ全体のコンテンツを囲むラッパー */
.list-page-wrapper {
    /* Headerの高さ(約72px)と、上部のコンテンツとの余白(2rem)を確保 */
    padding-top: calc(72px + 2rem);
    /* 左右のパディングもここで設定し、コンテンツ全体に適用 */
    padding-left: 2rem;
    padding-right: 2rem;
    padding-bottom: 2rem; /* 下部パディング */
    box-sizing: border-box;
    max-width: 1400px; /* HomePageのコンテナ幅に合わせる */
    margin: 0 auto; /* 中央寄せ */
}

/* BackHomeLinkのデフォルトマージンをリセット */
/* BackHome.vueの.back-home { margin: 1rem 0; } をリセット */
:deep(.back-home) {
    margin-top: 0;
    margin-bottom: 1rem; /* リンクと次の要素の間隔 */
}

/* ページ全体のコンテナ（白枠） */
.list-page-container {
    max-width: 900px; /* 白枠自体の最大幅 */
    margin: 0 auto; /* 白枠を中央寄せ */
    padding: 2rem; /* 白枠の内部パディング */
    /* ここからはpadding-topを削除しました */
    
    background-color: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
    box-sizing: border-box;
}


h2 {
    text-align: center;
    margin-top: 0;
    margin-bottom: 1.5rem;
    color: #2c3e50;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
    border-radius: 8px;
    overflow: hidden;
}
th, td {
    border: 1px solid #e0e0e0;
    padding: 0.8rem 0.5rem;
    text-align: center;
    font-size: 0.95rem;
    color: #2c3e50;
}
th {
    background-color: #f0f2f5;
    font-weight: 600;
    color: #213547;
}
tbody tr:nth-child(even) {
    background-color: #f9f9f9;
}
tbody tr:hover {
    background-color: #e6f7ff;
    cursor: default;
}
.no-record-message {
    text-align: center;
    color: #666;
    margin-top: 2rem;
    font-size: 1.1em;
}
</style>