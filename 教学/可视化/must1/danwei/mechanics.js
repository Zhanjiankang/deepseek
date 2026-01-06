// 力学单位库
const mechanicsData = [
    {
        id: 41,
        concept: "重力加速度",
        formula: "m · s^-2"
    },
    {
        id: 42,
        concept: "动量",
        formula: "kg · m · s^-1"
    },
    {
        id: 43,
        concept: "冲量",
        formula: "N · s"
    },
    {
        id: 44,
        concept: "功",
        formula: "J = N · m"
    },
    {
        id: 45,
        concept: "功率",
        formula: "W = J / s"
    },
    {
        id: 46,
        concept: "能量",
        formula: "J = kg · m^2 · s^-2"
    },
    {
        id: 47,
        concept: "频率",
        formula: "Hz = 1 / s"
    },
    {
        id: 48,
        concept: "密度",
        formula: "kg / m^3"
    },
    {
        id: 49,
        concept: "压强",
        formula: "Pa = N / m^2"
    }
];

// 导出单位库
if (typeof module !== 'undefined' && module.exports) {
    module.exports = mechanicsData;
}