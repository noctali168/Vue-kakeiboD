<template>
  <div class="setting-section-container">
    <div class="io-section">
      <h4>データのエクスポート</h4>
      <p>現在の全てのデータをバックアップファイルとしてダウンロードします。</p>
      <button @click="exportData" class="export-button">エクスポート</button>
    </div>
    <hr>
    <div class="io-section">
      <h4>データのインポート</h4>
      <p>バックアップファイルからデータを復元します。現在のデータは上書きされますのでご注意ください。</p>
      <input type="file" @change="handleFileUpload" accept=".json" ref="fileInput" style="display: none;" />
      <button @click="triggerFileInput" class="import-button">ファイルを選択してインポート</button>
      <p v-if="importStatus" :class="importStatus.type" class="status-message">{{ importStatus.message }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const fileInput = ref(null);
const importStatus = ref(null);

const exportData = () => {
  try {
    const defaultFilename = `kakeibo-backup-${new Date().toISOString().slice(0, 10)}.json`;
    let userFilename = prompt("ファイル名を入力してください:", defaultFilename);
    if (userFilename === null) return;
    if (userFilename.trim() === '') userFilename = defaultFilename;
    if (!userFilename.toLowerCase().endsWith('.json')) userFilename += '.json';

    const allData = {
      // 既存のデータ
      'kakeibo-records': JSON.parse(localStorage.getItem('kakeibo-records') || '[]'),
      'kakeibo-categories': JSON.parse(localStorage.getItem('kakeibo-categories') || '{}'),
      'kakeibo-recurring': JSON.parse(localStorage.getItem('kakeibo-recurring') || '[]'),
      'kakeibo-goal': localStorage.getItem('kakeibo-goal') || '50000',
      'kakeibo-username': localStorage.getItem('kakeibo-username') || '',
      // ★ くじのデータを追加
      'kuji-last-date': localStorage.getItem('kuji-last-date') || '',
      'kuji-result-label': localStorage.getItem('kuji-result-label') || '',
      'kuji-result-image': localStorage.getItem('kuji-result-image') || '',
    };
    const jsonString = JSON.stringify(allData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = userFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    alert("データのエクスポートに失敗しました。");
  }
};

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      
      // 既存のデータのインポート
      localStorage.setItem('kakeibo-records', JSON.stringify(data['kakeibo-records'] || []));
      localStorage.setItem('kakeibo-categories', JSON.stringify(data['kakeibo-categories'] || {}));
      localStorage.setItem('kakeibo-recurring', JSON.stringify(data['kakeibo-recurring'] || []));
      localStorage.setItem('kakeibo-goal', data['kakeibo-goal'] || '50000');
      localStorage.setItem('kakeibo-username', data['kakeibo-username'] || '');

      // ★ くじのデータのインポート (ファイルにデータがあれば復元)
      if (data['kuji-last-date']) {
        localStorage.setItem('kuji-last-date', data['kuji-last-date']);
      }
      if (data['kuji-result-label']) {
        localStorage.setItem('kuji-result-label', data['kuji-result-label']);
      }
      if (data['kuji-result-image']) {
        localStorage.setItem('kuji-result-image', data['kuji-result-image']);
      }

      importStatus.value = { type: 'success', message: 'インポートに成功しました！ページをリロードしてデータを反映してください。' };
      alert('インポートに成功しました！ページをリロードしてください。');
    } catch (error) {
      importStatus.value = { type: 'error', message: `インポートに失敗しました: ${error.message}` };
    }
  };
  reader.readAsText(file);
};
</script>

<style scoped>
.setting-section-container, .io-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.export-button, .import-button {
  border: none;
  padding: 0.8rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  color: white;
  align-self: flex-start;
}
.export-button { background-color: #0d6efd; }
.import-button { background-color: #ffc107; color: #212529; }
.io-section p { margin: 0; color: #6c757d; }
hr { border: none; border-top: 1px solid #e0e0e0; margin: 0.5rem 0;}
.status-message { font-weight: bold; margin-top: 0.5rem; }
.status-message.success { color: #28a745; }
.status-message.error { color: #dc3545; }
</style>