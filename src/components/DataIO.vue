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
      
      <button @click="triggerFileInput" class="import-button" :disabled="isImporting">
        {{ isImporting ? '処理中...' : 'ファイルを選択してインポート' }}
      </button>

      <input 
        type="file" 
        @change="handleFileUpload" 
        accept=".json" 
        ref="fileInput" 
        style="display: none;" 
      />

      <p v-if="importStatus" :class="importStatus.type" class="status-message">
        {{ importStatus.message }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// --- リアクティブな参照 ---
const fileInput = ref(null);
const importStatus = ref(null);
const isImporting = ref(false);

// ★保守性向上のため、バックアップ対象のキーを配列で一元管理
const STORAGE_KEYS = [
  'kakeibo-records',
  'kakeibo-categories',
  'kakeibo-recurring',
  'kakeibo-goal',
  'kakeibo-username',
  'kuji-last-date',
  'kuji-result-label',
  'kuji-result-image',
];

/**
 * データをJSONファイルとしてエクスポートします。
 */
const exportData = () => {
  try {
    // 全ての対象データをlocalStorageから収集
    const allData = STORAGE_KEYS.reduce((data, key) => {
      const item = localStorage.getItem(key);
      try {
        // JSON形式のデータはパースして格納
        data[key] = item ? JSON.parse(item) : null;
      } catch (e) {
        // パースできないデータ（文字列など）はそのまま格納
        data[key] = item;
      }
      return data;
    }, {});

    // ファイル名の設定
    const defaultFilename = `kakeibo-backup-${new Date().toISOString().slice(0, 10)}.json`;
    const userFilename = prompt("ファイル名を入力してください:", defaultFilename);
    
    // ユーザーがキャンセルした場合は処理を中断
    if (userFilename === null) return;

    const finalFilename = userFilename.trim() ? userFilename : defaultFilename;

    // ファイルのダウンロード処理
    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = finalFilename.toLowerCase().endsWith('.json') ? finalFilename : `${finalFilename}.json`;
    link.click();
    URL.revokeObjectURL(link.href);

  } catch (error) {
    console.error("エクスポート失敗:", error);
    alert("データのエクスポートに失敗しました。");
  }
};

/**
 * ファイル選択ダイアログを開きます。
 */
const triggerFileInput = () => {
  // 処理中でなければファイル選択ダイアログを開く
  if (!isImporting.value) {
    fileInput.value.click();
  }
};

/**
 * 選択されたファイルを処理し、データをインポートします。
 */
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  isImporting.value = true;
  importStatus.value = null;
  const reader = new FileReader();

  reader.onload = (e) => {
    try {
      const importedData = JSON.parse(e.target.result);

      // ★管理しているキーのみをループでインポート
      for (const key of STORAGE_KEYS) {
        // インポートファイルにキーが存在する場合のみ更新
        if (importedData[key] !== undefined && importedData[key] !== null) {
          const valueToStore = typeof importedData[key] === 'object' 
            ? JSON.stringify(importedData[key]) 
            : importedData[key];
          localStorage.setItem(key, valueToStore);
        }
      }

      importStatus.value = { 
        type: 'success', 
        message: 'インポートに成功しました！ページを自動で更新します。' 
      };
      
      // ★UX改善：メッセージを1.5秒表示した後に自動でページをリロード
      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (error) {
      console.error("インポート失敗:", error);
      importStatus.value = { type: 'error', message: `インポートに失敗しました: ${error.message}` };
    } finally {
      // 成功・失敗にかかわらず、ローディング状態を解除（エラー時もボタン操作を可能に）
      // ただし成功時はリロードするので、主にエラー時に意味がある
      isImporting.value = false;
      // ファイル選択をリセットして同じファイルを再度選択できるようにする
      fileInput.value.value = '';
    }
  };

  reader.onerror = () => {
    importStatus.value = { type: 'error', message: 'ファイルの読み込みに失敗しました。' };
    isImporting.value = false;
    fileInput.value.value = '';
  };
  
  reader.readAsText(file);
};
</script>

<style scoped>
.setting-section-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.io-section {
  display: flex;
  flex-direction: column;
  gap: 0.8rem; /* 少し間隔を調整 */
}
.io-section h4 {
  margin: 0;
  color: #343a40;
}
.io-section p {
  margin: 0;
  color: #6c757d;
  font-size: 0.9rem; /* 少しフォントサイズを調整 */
}
.export-button, .import-button {
  border: none;
  padding: 0.8rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  color: white;
  align-self: flex-start;
  transition: background-color 0.2s, opacity 0.2s;
}
.export-button { background-color: #0d6efd; }
.export-button:hover { background-color: #0b5ed7; }

.import-button { background-color: #198754; } /* 色を成功系の緑に変更 */
.import-button:hover { background-color: #157347; }
.import-button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
  opacity: 0.7;
}

hr {
  border: none;
  border-top: 1px solid #e0e0e0;
  margin: 1rem 0; /* 上下のマージンを調整 */
}
.status-message {
  font-weight: bold;
  margin-top: 0.5rem;
  padding: 0.8rem;
  border-radius: 8px;
  font-size: 0.95rem;
}
.status-message.success {
  color: #0f5132;
  background-color: #d1e7dd;
  border: 1px solid #badbcc;
}
.status-message.error {
  color: #842029;
  background-color: #f8d7da;
  border: 1px solid #f5c2c7;
}
</style>