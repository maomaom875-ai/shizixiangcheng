# 数学十字君 - 使用说明

## 📦 项目简介

数学十字君是一个基于十字相乘法的因式分解计算器，可以帮助学生和老师快速分解二次多项式。

支持的多项式形式：`Ax² + Dxy + By² + Gx + Hy + K`

## 🚀 快速开始

### 方法一：访问在线版本

#### React 开发版本
访问以下链接直接使用：
**开发服务器**: https://3001-ij6o9qxzc8gde9nuqr9ib-2e1b9533.sandbox.novita.ai

#### 独立 HTML 版本
直接在浏览器中打开 `standalone.html` 文件即可使用，无需任何安装或构建。

### 方法二：本地运行开发版

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm run dev

# 3. 在浏览器中访问
# 通常会自动打开 http://localhost:3000
```

### 方法三：构建并部署生产版本

```bash
# 1. 构建生产版本
npm run build

# 2. 预览构建结果
npm run preview

# 3. 部署 dist/ 文件夹
# 将 dist/ 文件夹中的内容上传到任何静态网站托管服务
# 例如：GitHub Pages, Netlify, Vercel, Cloudflare Pages 等
```

### 方法四：直接使用独立 HTML 文件

`standalone.html` 是一个完全独立的单文件应用：

1. 下载 `standalone.html` 文件
2. 双击文件或用浏览器打开
3. 无需任何服务器或构建工具
4. 完全离线可用

## 💡 使用方法

### 输入多项式系数

1. 在输入框中填入各项系数：
   - **x²**: x 的二次项系数
   - **xy**: xy 交叉项系数
   - **y²**: y 的二次项系数
   - **x**: x 的一次项系数
   - **y**: y 的一次项系数
   - **常数**: 常数项

2. 点击"开始分解"按钮

3. 查看分解结果和验证过程

### 示例多项式

程序内置了几个示例多项式供测试：

1. **x² + 5xy + y² + 2x + 3y + 6**
   - 结果: (x + 2y + 3)(x + 3y + 2)

2. **2x² + 7xy + 3y² + x + 4y - 1**
   - 结果: (2x + y + 1)(x + 3y - 1)

3. **x² + 5xy + 6y² + 5x + 6y**
   - 结果: (x + 2y)(x + 3y + 3)

## 📁 项目结构

```
.
├── standalone.html          # 独立的单文件版本
├── index.html              # Vite 入口 HTML
├── src/
│   ├── main.tsx           # React 应用入口
│   ├── App.tsx            # 主应用组件
│   └── App.css            # 应用样式
├── pages/
│   └── index/
│       ├── index.tsx      # Taro 页面组件
│       └── index.css      # Taro 页面样式
├── dist/                   # 构建输出目录
├── package.json           # 项目配置
└── vite.config.mjs        # Vite 配置文件
```

## 🔧 技术栈

- **前端框架**: React 18
- **构建工具**: Vite
- **样式方案**: CSS + Tailwind CDN
- **类型支持**: TypeScript
- **跨平台**: Taro (可选)

## 🌟 功能特性

1. **十字相乘法分解**: 自动寻找合适的因数组合
2. **实时公式预览**: 输入时实时显示当前多项式
3. **详细验证过程**: 展示完整的验证步骤
4. **响应式设计**: 支持手机、平板和桌面设备
5. **美观的 UI**: 渐变背景、动画效果、光影效果
6. **示例多项式**: 快速测试功能
7. **离线可用**: 独立 HTML 版本完全离线工作

## 📱 部署选项

### GitHub Pages

```bash
# 1. 构建项目
npm run build

# 2. 推送 dist 目录到 gh-pages 分支
git subtree push --prefix dist origin gh-pages
```

### Netlify / Vercel

直接连接 GitHub 仓库，配置：
- Build Command: `npm run build`
- Publish Directory: `dist`

### Cloudflare Pages

1. 连接 GitHub 仓库
2. 构建命令: `npm run build`
3. 构建输出目录: `dist`

### 静态文件托管

直接将 `dist/` 文件夹内容上传到任何静态文件托管服务。

### 简易方案

直接分享 `standalone.html` 文件，用户双击即可使用！

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🔗 相关链接

- GitHub 仓库: https://github.com/maomaom875-ai/shizixiangcheng
- 在线演示: https://3001-ij6o9qxzc8gde9nuqr9ib-2e1b9533.sandbox.novita.ai
