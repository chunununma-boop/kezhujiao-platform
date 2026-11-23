# 部署指南

## 一、Firebase 项目创建

1. 访问 [Firebase Console](https://console.firebase.google.com/)
2. 点击「添加项目」，项目名称如 `kezhujiao-platform`
3. 关闭 Google Analytics（可选）
4. 创建完成后，点击项目进入控制台

### 启用 Firestore 数据库

1. 左侧菜单 →「Firestore Database」→「创建数据库」
2. 选择「以测试模式启动」（方便开发，后续可改规则）
3. 选择位置：`asia-east1`（台湾）或 `us-central1`
4. 点击「启用」

### 获取配置信息

1. 项目概述页 → 点击「</>」Web 图标
2. 注册应用名称：`kezhujiao-web`
3. 复制配置对象（firebaseConfig），替换 `firebase-integration.js` 中的占位符

### 设置安全规则（测试阶段）

Firestore → 规则标签，粘贴：

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /students/{document} {
      allow read, write: if true;  // 测试阶段：允许所有读写
    }
  }
}
```

**注意**：正式上线前需改为身份验证规则。

---

## 二、GitHub Pages 部署

### 1. 创建 GitHub 仓库

1. 访问 [GitHub](https://github.com/) → 登录 →「New repository」
2. 仓库名：`kezhujiao-platform`（或你喜欢的名字）
3. 设为 **Public**（GitHub Pages 免费需要公开仓库）
4. 不要勾选 README（我们已有文件）
5. 点击「Create repository」

### 2. 推送代码

在终端执行：

```bash
cd "/Users/chun/Documents/paper-ing在写-博/27冬学期科教助教"
git add -A
git commit -m "初始提交：双班架构 + Firebase 集成"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/kezhujiao-platform.git
git push -u origin main
```

（将 `YOUR_USERNAME` 替换为你的 GitHub 用户名）

### 3. 启用 GitHub Pages

1. 仓库页面 → Settings → Pages
2. Source 选择「Deploy from a branch」
3. Branch 选择「main」，文件夹选「/ (root)」
4. 点击 Save
5. 等待 1-2 分钟，页面会显示你的网站 URL：
   `https://YOUR_USERNAME.github.io/kezhujiao-platform/`

---

## 三、集成 Firebase 到 HTML 文件

在每个 HTML 文件的 `<head>` 末尾添加：

```html
<script type="module" src="firebase-integration.js"></script>
```

然后修改 `save()` 函数，在 localStorage 保存后调用云端同步：

```javascript
// 在 save() 函数末尾添加
if (typeof saveStudentData === 'function' && ME && db.group) {
  saveStudentData(db.group.className, db.group.groupNo, ME, db);
}
```

---

## 四、访问链接

部署完成后，你将获得：

- **首页**：`https://YOUR_USERNAME.github.io/kezhujiao-platform/`
- **平台开发**：`https://YOUR_USERNAME.github.io/kezhujiao-platform/平台原型/v16-week3-workbench.html`
- **教学设计**：`https://YOUR_USERNAME.github.io/kezhujiao-platform/平台原型/v16-week6-lesson-design.html`
- **教师端**：`https://YOUR_USERNAME.github.io/kezhujiao-platform/平台原型/v17-teacher-research.html`

---

## 五、注意事项

1. **Firebase 免费额度**：Firestore 免费层 50,000 次读取/天，足够原型阶段使用
2. **数据隐私**：测试阶段规则设为公开，正式上线前需添加身份验证
3. **离线支持**：localStorage 仍作为本地缓存，云端同步失败时数据不丢失
4. **更新代码**：修改后重新 `git add && git commit && git push`，GitHub Pages 自动更新

---

## 六、后续优化建议

- [ ] 添加 Firebase Authentication（学生用互动码登录）
- [ ] 设置 Firestore 安全规则（按班级/组隔离数据）
- [ ] 添加数据导出功能（教师端一键导出 CSV/JSON）
- [ ] 监控 Firebase 用量（Console → Usage）
