// references.js - 参考资料配置文件

window.referencesData = {
    // 参考资料数组
    // 每个参考资料包含以下信息：
    // - title: 资料标题
    // - link: 资料链接（本地或在线）
    // - date: 发布日期（格式：YYYY-MM-DD）
    // - type: 资料类型（pdf, doc, ppt, video, image, link, book, article, code, data）
    references: [
        {
            title: "物理实验操作手册",
            link: "pen.pdf",
            date: "2025-01-20",
            type: "pdf"
        },
        {
            title: "力学基础理论详解",
            link: "tree.pdf",
            date: "2025-01-18",
            type: "doc"
        },
        {
            title: "光学实验PPT讲解",
            link: "./ppt/光学实验.pptx",
            date: "2025-01-15",
            type: "ppt"
        },
        {
            title: "牛顿运动定律实验视频",
            link: "./videos/牛顿运动定律实验.mp4",
            date: "2025-01-12",
            type: "video"
        },
        {
            title: "物理公式速查表",
            link: "https://gitee.com/jkzhang97/yiyibubu/raw/master/image/physics-formulas.png",
            date: "2025-01-10",
            type: "image"
        },
        {
            title: "电磁学在线教程",
            link: "https://enjoyphysics.cn/Materials/Video",
            date: "2025-01-08",
            type: "link"
        },
        {
            title: "高中物理课程标准",
            link: "./docs/高中物理课程标准.pdf",
            date: "2025-01-05",
            type: "pdf"
        },
        {
            title: "热力学实验数据分析",
            link: "./docs/热力学实验数据.xlsx",
            date: "2025-01-03",
            type: "data"
        },
        {
            title: "物理竞赛历年真题",
            link: "./docs/物理竞赛真题集.zip",
            date: "2025-01-01",
            type: "book"
        },
        {
            title: "相对论入门文章",
            link: "https://www.example.com/relativity-intro",
            date: "2024-12-28",
            type: "article"
        }
    ],
    
    // 配置信息
    config: {
        version: "1.0",
        lastUpdated: "2025-01-20",
        author: "物含妙理",
        description: "物理学习参考资料"
    }
};

// 使用说明：
// 1. 修改 references 数组，添加或删除参考资料项
// 2. 每个参考资料项必须包含 title, link, date 和 type 属性
// 3. link 可以是本地路径（如"./docs/xxx.pdf"）或在线URL
// 4. type 可以是以下值：
//    - pdf: PDF文档
//    - doc: Word文档
//    - ppt: PowerPoint演示文稿
//    - video: 视频文件
//    - image: 图片文件
//    - link: 网页链接
//    - book: 书籍/电子书
//    - article: 文章
//    - code: 代码/程序
//    - data: 数据文件