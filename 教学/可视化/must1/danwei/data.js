// 物理单位制数据库
const physicsData = [
    {
        id: 1,
        concept: "力",
        units: ["N", "牛顿"],  // 支持多个单位
        formula: "F = ma",
        description: "使物体产生加速度的原因"
    },
    {
        id: 2,
        concept: "功",
        units: ["J", "焦耳"],
        formula: "W = Fs",
        description: "力在位移方向上的累积效果"
    },
    {
        id: 3,
        concept: "功率",
        units: ["W", "瓦特"],
        formula: "P = W/t",
        description: "单位时间内做功的多少"
    },
    {
        id: 4,
        concept: "压强",
        units: ["Pa", "帕斯卡", "N/m²"],  // 三个单位都正确
        formula: "p = F/S",
        description: "单位面积上受到的压力"
    },
    {
        id: 5,
        concept: "动能",
        units: ["J", "焦耳"],
        formula: "Ek = ½mv²",
        description: "物体由于运动而具有的能量"
    },
    {
        id: 6,
        concept: "重力势能",
        units: ["J", "焦耳"],
        formula: "Ep = mgh",
        description: "物体由于被举高而具有的能量"
    },
    {
        id: 7,
        concept: "速度",
        units: ["m/s", "米/秒"],
        formula: "v = s/t",
        description: "单位时间内位移的大小"
    },
    {
        id: 8,
        concept: "加速度",
        units: ["m/s²", "米/秒²"],
        formula: "a = Δv/Δt",
        description: "单位时间内速度的变化量"
    },
    {
        id: 9,
        concept: "动量",
        units: ["kg·m/s", "千克米/秒"],
        formula: "p = mv",
        description: "物体质量与速度的乘积"
    },
    {
        id: 10,
        concept: "冲量",
        units: ["N·s", "牛秒"],
        formula: "I = FΔt",
        description: "力在时间上的累积效果"
    }
];

// 难度配置
const difficultyConfig = {
    easy: {
        name: "简单模式",
        itemCount: 4,
        timeLimit: 0,  // 0表示无限时间
        description: "4个概念，无时间限制"
    },
    medium: {
        name: "中等模式",
        itemCount: 6,
        timeLimit: 90,
        description: "6个概念，90秒完成"
    },
    hard: {
        name: "困难模式",
        itemCount: 8,
        timeLimit: 60,
        description: "8个概念，60秒完成"
    }
};