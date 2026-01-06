// 电磁学单位库
const electromagnetismData = [
    {
        id: 31,
        concept: "电流",
        formula: "A "
    },
    {
        id: 32,
        concept: "电荷",
        formula: "C = A · s"
    },
    {
        id: 33,
        concept: "电压",
        formula: "V = kg · m^2 · s^{-3} · A^{-1}"
    },
    {
        id: 34,
        concept: "电阻",
        formula: "Ω = kg  · m^2 · s^{-3} · A^{-2}"
    },
    {
        id: 35,
        concept: "电容",
        formula: "F = kg^{-1} · m^{-2} · s^{4} · A^{2}"
    },
    {
        id: 36,
        concept: "磁感应强度",
        formula: "T = kg · s^{-2} · A^{-1}"
    },
    {
        id: 37,
        concept: "磁通量",
        formula: "Wb = kg · m^2 · s^{-2} · A^{-1}"
    },
    {
        id: 38,
        concept: "电场强度",
        formula: "E = kg · m · s^{-3} · A^{-1}"
    },
    {
        id: 39,
        concept: "电感",
        formula: "H = kg · m^2 · s^{-2} · A^{-2}"
    },
    {
        id: 40,
        concept: "电功",
        formula: "J = V · A · s =  C · V "
    },
    {
        id: 41,
        concept: "电功率",
        formula: "W = V · A =  J · s^{-1}"
    }
];

// 导出单位库
if (typeof module !== 'undefined' && module.exports) {
    module.exports = electromagnetismData;
}
