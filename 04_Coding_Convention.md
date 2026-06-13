# 04_Coding_Convention.md

# 《小鸡过河》AI编码规范与生成约束 V2.0

---

# 一、目标

本文件用于约束 AI Agent 的代码生成行为。

适用于：

* GPT-5.5
* Claude Code
* Cursor Agent
* Gemini CLI
* Windsurf

AI 必须严格遵守本规范。

禁止自行扩展未定义架构。

---

# 二、总体原则

## MVP优先

优先保证：

```text
可运行
可测试
可扩展
```

禁止：

```text
过度设计
提前优化
复杂抽象
```

---

## 数据驱动优先

所有关卡数据必须来自：

```text
src/config/Levels.json
```

禁止：

```typescript
if(level==1)
if(level==2)
if(level==3)
```

硬编码关卡逻辑。

---

## 单一职责原则

每个类只负责一种功能。

例如：

```text
Boat
负责船只行为

Chicken
负责玩家行为

GameMain
负责游戏流程
```

禁止：

```text
Boat管理关卡
Chicken管理存档
```

---

# 三、TypeScript规范

## 开启严格模式

tsconfig：

```json
{
  "strict": true
}
```

---

## 禁止使用any

禁止：

```typescript
let data:any;
```

允许：

```typescript
let data:LevelConfig;
```

---

## 明确访问修饰符

所有成员必须声明：

```typescript
private
protected
public
```

示例：

```typescript
private speed:number;
public update():void;
```

---

## 常量必须大写

示例：

```typescript
const MAX_BOAT_COUNT = 20;
const GAME_WIDTH = 1000;
```

禁止：

```typescript
const maxBoatCount = 20;
```

---

## 枚举代替字符串

允许：

```typescript
enum GameState
{
    Menu,
    Playing,
    Pause,
    Win,
    Lose
}
```

禁止：

```typescript
state = "playing";
```

---

# 四、LayaAir规范

## 必须使用Laya API

允许：

```typescript
Laya.Sprite
Laya.Label
Laya.Button
Laya.Tween
Laya.LocalStorage
```

禁止：

```typescript
document.createElement()
window.localStorage
HTMLCanvasElement
```

---

## 游戏循环统一入口

允许：

```typescript
Laya.timer.frameLoop(
    1,
    this,
    this.onFrameUpdate
);
```

禁止：

```typescript
setInterval()
requestAnimationFrame()
```

---

## 输入统一监听

统一：

```typescript
Laya.stage.on(
    Laya.Event.KEY_DOWN,
    this,
    this.onKeyDown
);
```

禁止在多个对象中重复注册键盘事件。

---

# 五、项目结构规范

必须生成以下目录：

```text
src/

├─ config/
├─ game/
├─ ui/
├─ utils/
├─ managers/
├─ data/
```

---

# 六、文件命名规范

采用：

```text
PascalCase
```

示例：

```text
GameMain.ts
Boat.ts
Chicken.ts
LevelManager.ts
```

禁止：

```text
game.ts
boatClass.ts
main_game.ts
```

---

# 七、类职责规范

## GameMain

负责：

* 游戏状态
* 场景初始化
* 更新循环

禁止：

* 存档逻辑
* JSON解析

---

## Chicken

负责：

* 移动
* 跳跃
* 状态管理

禁止：

* UI管理
* 关卡加载

---

## Boat

负责：

* 位置更新
* 边界循环

禁止：

* 玩家控制

---

## LevelManager

负责：

* 读取Levels.json
* 创建关卡数据

禁止：

* UI逻辑

---

## DifficultyManager

负责：

* DDA计算
* 难度倍率

禁止：

* 直接控制Boat

---

## StorageHelper

负责：

* LocalStorage封装

禁止：

* 游戏逻辑

---

# 八、禁止事项

AI不得自行增加：

```text
Redux
Vue
React
PixiJS
Phaser
ThreeJS
```

---

AI不得自行增加：

```text
服务器
数据库
登录系统
联网功能
```

---

AI不得引入：

```text
npm第三方依赖
```

除非明确要求。

---

# 九、资源规范

如果图片不存在：

必须使用：

```typescript
graphics.drawRect()
graphics.drawCircle()
```

生成占位图。

不得因为资源缺失导致运行失败。

---

# 十、随机数规范

每日挑战：

必须使用：

```typescript
SeededRandom.ts
```

实现。

禁止：

```typescript
Math.random()
```

直接生成关卡。

---

# 十一、对象创建规范

禁止在每帧创建对象。

禁止：

```typescript
update()
{
    const temp = {};
}
```

---

允许：

初始化时创建。

循环中复用。

---

# 十二、错误处理规范

所有配置读取必须检查：

```typescript
null
undefined
```

示例：

```typescript
if(!config)
{
    throw new Error(
        "Level config not found"
    );
}
```

---

# 十三、日志规范

开发环境允许：

```typescript
console.log()
```

发布版本必须统一关闭。

提供：

```typescript
Debug.ts
```

管理日志开关。

---

# 十四、存档键名规范

统一前缀：

```text
CCR_
```

示例：

```text
CCR_HIGHEST_LEVEL
CCR_STAR_COUNT
CCR_ASSIST_MODE
CCR_DAILY_RECORD
```

禁止使用无前缀键名。

---

# 十五、输出顺序规范

AI生成代码时必须按照以下顺序输出：

1. 目录结构
2. 配置文件
3. 数据接口
4. 工具类
5. 管理器
6. 游戏实体
7. UI层
8. GameMain
9. main.ts
10. index.html

不得跳过文件。

---

# 十六、完成标准

当且仅当满足以下条件时视为完成：

□ 项目成功编译

□ TC001~TC015通过

□ 无TypeScript编译错误

□ 无运行时异常

□ LocalStorage正常工作

□ Web版本可运行

□ 微信小游戏可发布

否则不得声明“开发完成”。

---

# 十七、AI最终输出要求

生成项目时：

必须输出：

```text
完整目录树
全部源码文件
全部JSON配置
运行说明
测试说明
```

不得只输出核心代码片段。

不得省略文件。

不得使用“此处略”。

必须保证项目可直接复制运行。