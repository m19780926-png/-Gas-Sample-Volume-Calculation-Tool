# -Gas-Sample-Volume-Calculation-Tool

# 採取量計算ツール（PWA対応）

このツールは、ガス採取量・濃度換算を簡単に計算できる Web アプリです。  
Android / PC の Chrome で **PWA（インストール可能なアプリ）**として利用できます。

---

## 📱 PWA（インストール）について

このツールは以下の条件を満たしており、Chrome でホーム画面に追加できます。

- manifest.json 正常
- start_url 正常
- scope 正常
- 192×192 / 512×512 アイコン正常
- Service Worker 登録済み
- オフライン対応
- GitHub Pages で HTTPS 配信

---

## 🔄 更新時のチェックリスト（開発者向け）

PWA はキャッシュが強いため、更新時に以下を必ず確認してください。

### 1. Service Worker のキャッシュ名を更新する（最重要）

```javascript
const CACHE_NAME = "gas-tool-cache-v6";
