// images.js - 图片配置文件
// 配置要在四象限布局中显示的图片

window.imagesData = {
    // 图片数组，最多4张图片（对应四个网格）
    // 每张图片包含以下信息：
    // - src: 图片路径（本地或在线）
    // - title: 图片标题
    // - description: 图片描述
    // - date: 图片日期（可选）
    // - icon: Font Awesome图标类名（可选）
    images: [
        {
            src: "f.gif",
            title: "物理实验动图",
            description: "这是一个本地GIF图片，展示了物理实验的动态过程。图片显示了物体在重力作用下的运动轨迹，适用于物理教学演示。",
            date: "2025-01-15",
            icon: "fa-atom"
        },
        {
            src: "https://gitee.com/jkzhang97/yiyibubu/raw/master/image/anmo.gif",
            title: "按摩原理演示",
            description: "这是一个来自Gitee的在线GIF动画，展示了按摩效果的动态图。该动画可用于物理教学中讲解压力分布和能量传递。",
            date: "2025-01-16",
            icon: "fa-hands"
        },
        {
            src: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            title: "科学实验室",
            description: "现代化科学实验室的内部场景，展示了各种实验设备和仪器。这个实验室配备了先进的物理实验设备，用于精确测量和数据分析。",
            date: "2025-01-18",
            icon: "fa-flask"
        },
        {
            src: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            title: "物理公式展示",
            description: "经典物理公式展示，包括牛顿定律和爱因斯坦相对论公式。这些公式是物理学的基础，描述了自然界的基本规律。",
            date: "2025-01-20",
            icon: "fa-square-root-alt"
        },
                {
            src: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            title: "物理公式展示",
            description: "经典物理公式展示，包括牛顿定律和爱因斯坦相对论公式。这些公式是物理学的基础，描述了自然界的基本规律。",
            date: "2025-01-20",
            icon: "fa-square-root-alt"
        },
                {
            src: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            title: "物理公式展示",
            description: "经典物理公式展示，包括牛顿定律和爱因斯坦相对论公式。这些公式是物理学的基础，描述了自然界的基本规律。",
            date: "2025-01-20",
            icon: "fa-square-root-alt"
        }
    ],
    
    // 配置信息
    config: {
        version: "1.0",
        lastUpdated: "2025-01-20",
        author: "物理资源中心",
        maxImages: 4, // 最大图片数量（四象限布局）
        gridLayout: "2x2" // 网格布局
    }
};

// 使用说明：
// 1. 修改images数组，添加或修改图片项
// 2. 每个图片项必须包含src、title和description属性
// 3. date和icon属性为可选
// 4. src可以是本地路径（如"images/photo1.jpg"）或在线URL
// 5. 最多支持4张图片（对应四个网格）