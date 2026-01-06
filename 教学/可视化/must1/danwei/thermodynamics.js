// 热学单位库
const thermodynamicsData = [
    {
        id: 21,
        concept: "热力学温度",
        formula: "K"
    },
    {
        id: 22,
        concept: "热量",
        formula: "Q = J =  kg · m^2 · s^{-2}"
    },
    {
        id: 23,
        concept: "内能",
        formula: "U =  kg · m^2 · s^{-2}"
    },
    {
        id: 24,
        concept: "比热容",
        formula: "c = J · kg^{-1} · K^{-1} = m^{2} · s^{-2} · K^{-1}"
    }
];

// 导出单位库
if (typeof module !== 'undefined' && module.exports) {
    module.exports = thermodynamicsData;
}