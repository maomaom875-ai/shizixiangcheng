#!/bin/bash

# 数学十字君 - GitHub Pages 部署脚本

echo "🚀 开始部署到 GitHub Pages..."

# 1. 构建项目
echo "📦 构建项目..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 构建失败"
    exit 1
fi

echo "✅ 构建成功"

# 2. 进入构建输出目录
cd dist

# 3. 初始化 git（如果还没有）
if [ ! -d .git ]; then
    git init
    git checkout -b gh-pages
fi

# 4. 添加所有文件
git add -A

# 5. 提交
git commit -m "deploy: 部署到 GitHub Pages $(date +'%Y-%m-%d %H:%M:%S')"

# 6. 推送到 gh-pages 分支
echo "🔄 推送到 GitHub Pages..."
git push -f origin gh-pages

if [ $? -ne 0 ]; then
    echo "❌ 推送失败"
    exit 1
fi

echo "✅ 部署成功！"
echo "🌐 访问: https://maomaom875-ai.github.io/shizixiangcheng/"

cd ..
