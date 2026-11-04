# 无审查开源权重模型 — 本地 AI 红队实验室指南

**语言:** [English](../uncensored-models.md)（基准） · [한국어](uncensored-models.md) · [日本語](uncensored-models.md) · 中文（本文档）

> ## ⚠️ 警告 — 使用前必读
>
> 基于 Web 的 LLM 受到严格审查，本地 LLM（Gemma、Qwen 等）也带有默认安全对齐，
> 导致 AI 红队测试经常受限。本指南结合 **LM Studio** 与 Hugging Face 上的
> **无审查（uncensored）GGUF 量化模型**，在**本地环境**中不受限制地测试模型。
>
> - 无审查模型是**双刃剑**：对红队有用，但同样可能成为恶意攻击者的工具。
>   所有测试必须在**隔离的离线本地环境**中进行，并确保生成产物不泄露到外部。
> - **仅在授权范围内测试。** 所有测试必须处于预先授权的任务范围内，
>   并遵守相关法律和组织安全政策。
> - **极端量化以精度为代价**：Q2_K 速度快但损失大；精确的漏洞分析或代码生成
>   建议使用 Q4_K_M 及以上。

---

## 1. 安装 LM Studio

1. **下载与安装**
   - 从官网（<https://lmstudio.ai/>）获取对应操作系统的安装包。

2. **更改模型存储目录（重要）**
   - LM Studio 默认将模型保存在系统盘，可能造成空间不足。
     下载大型 GGUF **之前**务必更改存储目录。
   - **图形界面**：LM Studio → 左下角 **⚙️ Settings** → **Models Directory** →
     **Change / Browse** → 在空间充足的磁盘创建新文件夹并指定 → **重启**。
   - **注意**：如果已下载模型，请先将文件复制到新文件夹，再更改路径。

## 2. 下载无审查 GGUF 模型

1. **Hugging Face 模型页面**
   - 基于 Qwen 的**无审查（Heretic/Uncensored）**量化模型合集，针对 16GB 以下显存优化：
   - **URL**：`https://huggingface.co/mradermacher/Qwen3.8-9B-Distill-uncensored-heretic-GGUF/tree/main`

2. **按显存选择量化版本**（Files and versions 标签页）

   | 量化 | 大小 | 显存 | 说明 |
   |------|------|------|------|
   | **Q2_K**（2 位） | 约 3GB | 4–8GB（RTX 3050/4050 等） | 最快，质量约 80–85%，代码/数学易出错 |
   | **Q4_K_M**（4 位） | 约 5GB | 8GB | **最佳平衡**（约 95–97%），多数红队工作推荐 |
   | **Q8_0**（8 位） | 约 8GB | 12GB 以上 | 几乎无损（99%+） |

3. **放置模型文件**
   - 将下载的 `.gguf` 按 LM Studio 可识别的结构放入第 1 步的文件夹：
     `模型目录/发布者/模型名/文件.gguf`
   - **示例**：
     `aaa/mradermacher/Qwen3.8-9B-Distill-uncensored-heretic-GGUF/Qwen3.8-9B-Distill-uncensored-heretic.Q2_K.gguf`

## 3. 加载模型并测试

1. 重启 LM Studio → **Chat** 标签页 → 在输入框上方的下拉菜单中选择已下载模型。
2. 模型自动加载到显存，完成后即可对话（RTX 4090 上 Q2_K 约 300 token/秒）。
3. 应用红队提示词 — 无审查模型不会安全拒绝，可在**授权实验室范围内**进行
   政策/安全场景分析、漏洞分析与攻击场景生成。

## 4. 使用视觉（VLM）模型的附加设置

使用带图像输入的视觉语言模型需要 `mmproj` 文件：

1. 从模型页面下载 `Qwen3.8-9B-Distill-uncensored-heretic.mmproj-Q8_0.gguf`（约 624MB）。
2. 文件名前添加 `mmproj-` 前缀（如 `mmproj-Qwen3.8-…mmproj-Q8_0.gguf`）。
3. 放置在主模型文件（`.Q2_K.gguf`）所在的同一文件夹。

## 5. 对接 Open AI Red Team

LM Studio 在 `http://localhost:1234/v1` 暴露 **OpenAI 兼容 API** —
直接接入中间件的 `openweight` 提供商：

```bash
OPENWEIGHT_BASE_URL=http://localhost:1234/v1 \
OPENWEIGHT_MODEL=mradermacher/Qwen3.8-9B-Distill-uncensored-heretic-GGUF \
OPENWEIGHT_API_KEY=lm-studio \
node dist/src/cli.js chat --provider openweight
```

`.env` 形式：

```dotenv
ORT_PROVIDER=openweight
OPENWEIGHT_BASE_URL=http://localhost:1234/v1
OPENWEIGHT_MODEL=mradermacher/Qwen3.8-9B-Distill-uncensored-heretic-GGUF
OPENWEIGHT_API_KEY=lm-studio
# 小型模型 → 收紧预算
ORT_MAX_CONTEXT=32768
ORT_SKILL_BUDGET=6000
```

> 注意：量化模型复现详细载荷的能力较差 — 14B 以下模型建议
> `ORT_MAX_SKILLS=1`、`ORT_INCLUDE_INDEX=off`（见[模型矩阵](../model-matrix.md)）。

## 6. 注意事项 — 再次强调 ⚠️

- **隔离**：所有测试在隔离的离线本地环境进行，确保产物不外泄。
- **量化权衡**：Q2_K 优先速度/显存，精度损失大。精确分析与代码生成在显存允许时
  使用 Q4_K_M 及以上。
- **法律与伦理责任**：使用无审查模型的所有测试必须处于**预先授权范围**内，
  并遵守相关法律与组织安全政策。

## 总结

| 步骤 | 任务 | 说明 |
|:-----|:-----|:-----|
| **1. 安装** | 安装 LM Studio，将模型目录移至大容量磁盘 | `Settings → Models Directory` |
| **2. 下载** | 按显存从 Hugging Face 下载无审查 GGUF（Q2_K / Q4_K_M 等） | Q2_K：4–8GB 显存，Q4_K_M：8GB 推荐 |
| **3. 放置** | `模型目录/发布者/模型名/文件.gguf` 结构 | LM Studio 识别要求 |
| **4. 运行** | 在 Chat 标签页选择模型，运行红队提示词 | 视觉模型需添加 `mmproj` 文件 |
| **5. 对接** | 将 `openweight` 提供商指向 `http://localhost:1234/v1` | OpenAI 兼容，无需适配器 |
