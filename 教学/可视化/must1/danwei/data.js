// 物理单位制数据库
const physicsData = [
    {
        id: 1,
        concept: "长度",
        formula: "m"
    },
    {
        id: 2,
        concept: "时间",
        formula: "s"
    },
    {
        id: 3,
        concept: "质量",
        formula: "kg"
    },
    {
        id: 4,
        concept: "速度",
        formula: "m · s^{-1}"
    },
    {
        id: 5,
        concept: "加速度",
        formula: "m · s^{-2}"
    },
    {
        id: 6,
        concept: "体积",
        formula: "m^3"
    },
    {
        id: 7,
        concept: "力",
        formula: "N = kg · m · s^{-2}"
    }
];

// 难度配置
const difficultyConfig = {
    easy: {
        name: "简单模式",
        itemCount: 6,
        timeLimit: 0,  // 0表示无限时间
        description: "6个概念，无时间限制"
    },
    hard: {
        name: "困难模式",
        itemCount: 12,
        timeLimit: 60,
        description: "12个概念，60秒完成"
    }
};