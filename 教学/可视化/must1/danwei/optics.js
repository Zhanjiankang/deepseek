// 光学单位库
const opticsData = [
    {
        id: 11,
        concept: "光速",
        formula: "c = m · s^{-1}"
    },
    {
        id: 12,
        concept: "波长",
        formula: "\\lambda =  m"
    },
    {
        id: 13,
        concept: "发光强度",
        formula: "I_{v} = cd"
    },
    {
        id: 14,
        concept: "光强",
        formula: "I = W · m^{-2} = kg · s^{-3}"
    }
];

// 导出单位库
if (typeof module !== 'undefined' && module.exports) {
    module.exports = opticsData;
}