// carousel-images.js - 轮播图片配置文件

window.carouselData = {
    // 轮播图片数组
    // 每张图片包含以下信息：
    // - src: 图片路径（本地或在线）
    // - title: 图片标题（可选）
    // - description: 图片描述（可选）
    images: [
        {
            src: "photos/1.png",
            title: "物理实验课堂",
            description: "学生在实验室进行物理实验"
        },
        {
            src: "photos/momo.gif",
            title: "物理公式讲解",
            description: "老师正在讲解物理公式"
        },
        {
            src: "photos/quhua.gif",
            title: "物理实验室",
            description: "现代化的物理实验室"
        },
        {
            src: "photos/tietie.gif",
            title: "科学讨论",
            description: "学生进行科学问题讨论"
        },
        {
            src: "photos/yaobai.gif",
            title: "实验操作",
            description: "学生进行实验操作演示"
        }
    ],
    
    // 配置信息
    config: {
        version: "1.0",
        lastUpdated: "2025-01-20",
        author: "物含妙理",
        description: "班级精彩瞬间轮播图片"
    }
};

// 使用说明：
// 1. 修改 images 数组，添加或删除轮播图片
// 2. 每张图片可以包含 src（必须）、title（可选）和 description（可选）
// 3. src 可以是本地路径（如"./images/photo1.jpg"）或在线URL
// 4. 建议图片尺寸比例接近 2:1（宽:高），以获得最佳显示效果