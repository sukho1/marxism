# 苏霍壹马克思主义系列文集

静态站点：<https://sukho1.github.io/marxism/>（GitHub Pages，main 分支根目录）

- 文章源文件：`../马庄流/马克思/文集/*.md`
- 站点结构（系列顺序、文章顺序）的唯一来源：`../马庄流/马克思/文章目录.md`（手工维护）
- 布局与功能与 [马庄心理学站](https://sukho1.github.io/ma-zhuang/) 一致：侧边栏、全文搜索、亮/暗主题、留言板、giscus 评论（存放在 sukho1.github.io 的 Discussions）

## 重新构建

依赖：Python 3、pandoc、gh（拉取评论热度用，不可用自动降级为 0）。

```powershell
python scripts/build_site.py
git add -A
git commit -m "rebuild site"
git push
```

生成器会打印两类警告：

- 目录文档里匹配不到文章的条目（检查文章文件名是否一致）；
- 文集里存在但未列入目录文档的文章（会生成页面并可搜索，归入"未分类"，不进侧边栏）。
