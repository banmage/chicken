# 文件2：02_Architecture_技术架构规范.md

# 《小鸡过河》技术架构规范 V2.0

# 一、坐标体系

画布：

```typescript
1000 x 600
```

---

Bottom Bank

```typescript
y = 520~600
```

---

Top Bank

```typescript
y = 0~80
```

---

河道：

```typescript
laneHeight = 40
laneGap = 70
```

---

# 二、河道生成规则

Lane按照垂直方向排列。

示例：

```typescript
Lane0 y=120
Lane1 y=190
Lane2 y=260
Lane3 y=330
```

---

# 三、跳跃规则

## 合法跳跃

目标河道必须存在船只。

并满足：

```typescript
chickenCenterX
落入船只范围
```

条件：

```typescript
boat.x <= centerX <= boat.right
```

---

## 多船命中规则

若同时命中多个船：

选择：

```typescript
中心距离最近
```

的一艘。

---

## 跳跃成功

落地后：

```typescript
currentBoat = targetBoat
```

---

## 跳跃失败

未找到目标船：

直接忽略输入。

不执行跳跃。

---

# 四、落水判定

必须同时满足：

```typescript
!isJumping
&& currentBoat == null
&& !isOnBank
```

才可判定失败。

禁止在跳跃动画期间失败。

---

# 五、安全检查点

定义：

```typescript
lastSafeBoat
```

更新时机：

成功停留船只超过：

```typescript
500ms
```

---

辅助模式复活：

```typescript
respawn(lastSafeBoat)
```

---

# 六、统计系统

```typescript
interface LevelStats
{
    elapsedTime:number;
    deathCount:number;
    jumpCount:number;
    successfulJumpCount:number;
}
```

---

成功率：

```typescript
successfulJumpCount
/
jumpCount
```

---

# 七、每日挑战

随机种子：

```typescript
new Date().toDateString()
```

必须转换为：

```typescript
SeededRandom
```

实现。

禁止使用：

```typescript
Math.random()
```

生成关卡。

---

# 八、状态机

```typescript
Menu
Loading
Playing
Paused
Win
Lose
```

禁止出现未定义状态。

---

# 九、性能约束

船只总数：

<=20

障碍物：

<=10

目标帧率：

60FPS

---

# 十、存档内容

LocalStorage：

```typescript
highestLevel
stars
achievements
assistMode
dailyBestTime
skins
```
