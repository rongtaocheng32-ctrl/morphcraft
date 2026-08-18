# MorphCraft（形变工坊）

MorphCraft 是一个浏览器端 SVG 路径形变实验工具。它解决设计师和开发者需要快速验证两个图标轮廓是否适合做 morph 动画的问题，无需安装专业动效软件即可粘贴路径、调整时长和缓动并导出当前形状。

## 主要功能

- 三组内置形变预设：方形→星形、圆形→水滴、菱形→心形。
- 接受自定义起始与目标 SVG `path` 的 `d` 数据。
- 检查路径是否以 `M/m` 开始且能在浏览器中计算长度。
- 调整填充颜色、动画时长与四种缓动曲线。
- 可选择动画完成后反向返回。
- 一键交换起始与目标路径，快速检查反向形变效果。
- 使用 KUTE.js 对两条路径进行插值。
- 将当前画面导出为静态 SVG 文件。

导出的是点击按钮时的静态形状，不包含 KUTE.js 动画脚本。

## 安装方法

```bash
git clone https://github.com/rongtaocheng32-ctrl/morphcraft.git
cd morphcraft
python3 -m http.server 8000
```

打开 <http://localhost:8000>。首次打开需联网从 jsDelivr 加载 KUTE.js。

## 使用方法

1. 选择一个预设，或粘贴两段 SVG path 的 `d` 数据。
2. 点击“应用路径”验证并显示起始形状。
3. 设置颜色、时长、缓动和是否反向返回。
4. 点击“播放形变”。
5. 需要反向测试时点击“交换路径”。
6. 在需要的画面点击“导出 SVG”。

## 输入输出示例

输入：

```text
Source path: M300,10L590,300L300,590L10,300z
Target path: M300,570C245,520 38,385 38,205...
Duration: 1200 ms
Easing: easingCubicInOut
Yoyo: true
```

输出：菱形在 1200ms 内变为心形，再反向回到菱形；导出文件名为：

```text
morphcraft-shape.svg
```

## 开源与致谢

本项目代码使用 MIT License。SVG 路径插值由 [KUTE.js](https://github.com/thednp/kute.js) 提供，KUTE.js 同样使用 MIT License，并通过 jsDelivr 在运行时加载。详见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。
