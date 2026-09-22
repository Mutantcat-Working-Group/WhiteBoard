<div align=center>
<img src="https://raw.githubusercontent.com/Mutantcat-Working-Group/WhiteBoard/main/logo.png" style="width:100px;" width="100"/>
<h2>在线白板</h2>
</div>

### 一、产品概述

- 一款基于 Vue 2 + AntV G6 的在线白板应用，打开浏览器就能画。
- 自由画布上可以绘图、书写、连节点、贴便签、嵌素材，随手搭出思维导图、流程图和草图笔记。
- 支持多画板切换、本地持久化与中英双语，可装为 PWA 应用离线使用。
- 单页静态站点，构建产物可托管到任意静态服务器或 Pages 服务。

核心价值：一个不依赖账号和后端的轻量白板，内容存在本地，打开即写、写完即走。

### 二、界面一览

- 画布区：占据主要视野，支持滚轮缩放与空白处拖拽平移，图形与便签自由摆放。
- 左侧素材栏：可复用图形与图标素材，拖拽即可上画布。
- 顶部/上下文工具栏：切换绘制模式（矩形、圆形、直线、虚线、曲线），管理便签与签名板。
- 右侧导航器：大画布中快速定位当前视口。
- 多画板页签：新建、切换多个独立画板，各自保存。

### 三、功能说明

#### 画布与绘图

- 基于 G6 图形引擎，画布缩放、平移、节点拖拽一应俱全。
- 矩形、圆形、直线、虚线、曲线等基础图形的绘制与编辑。
- 可扩展的图元系统，`src/global/lib/g6/node`、`edge` 提供统一注册接口。

#### 内容与素材

- 富文本便签（基于 Quill），随手记录想法。
- 手写签名板（基于 signature_pad）。
- 内置素材库与 iconfont 图标体系，开箱即用。

#### 数据与多端

- 多画板：创建与切换多个独立画板，状态本地保存。
- 本地持久化：Vuex + localStorage，刷新不丢内容。
- 导入导出：画布内容与图片导出。
- 国际化：简体中文 / English 一键切换。
- PWA：`manifest.json` + Service Worker，可安装到桌面并离线缓存。

### 四、安装与下载

最新版本：`1.0.20260920`

从 [Releases](https://github.com/Mutantcat-Working-Group/WhiteBoard/releases) 下载 `whiteboard-1.0.20260920.tar.gz`，解压即得一整套静态站点，用任意静态服务器托管 `docs` 目录即可使用，另附 `checksums.txt` 供校验。版本号使用纯日期递增（如 `1.0.20260920`），推送同族标签（`v` 前缀可选）后，GitHub Actions 会自动构建并发布 Release。

### 五、快速上手

1. 下载并解压 tar 包，把其中的静态文件放到 Web 服务器，或直接用任意静态文件服务器 serve 该目录。
2. 浏览器打开站点，从素材栏拖一个图形到画布试试。
3. 双击画布添加便签，用工具栏切换图形类型继续绘制。
4. 新建多个画板分别记录不同主题，刷新页面内容不丢。
5. 通过浏览器「安装」入口把站点装为 PWA 应用。

### 六、从源码构建

```bash
git clone https://github.com/Mutantcat-Working-Group/WhiteBoard.git
cd WhiteBoard
yarn install
yarn serve   # 本地开发预览
yarn build   # 产出 docs/ 静态站点
```

### 七、开源协议与致谢

本项目基于 MIT 协议开源。Fork 自 [OXOYO/WhiteBoard](https://github.com/OXOYO/WhiteBoard)，感谢原仓库及其作者的优秀开源工作，本仓库在其基础上继续维护与改进。
