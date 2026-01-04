// config.js - 手动配置存在的must文件夹

// =============================================
// 请根据实际存在的must文件夹修改以下配置
// =============================================

const CONFIG = {
    // 手动配置存在的must文件夹
    // 格式: { id: '文件夹名', name: '显示名称', icon: '图标类名' }
    existingCourses: [
        { id: 'must1', name: '必修一', icon: 'fa-weight-hanging' },
        { id: 'must2', name: '必修二', icon: 'fa-sun' },
        { id: 'must3', name: '必修三', icon: 'fa-bolt' },
        { id: 'must4', name: '选修一', icon: 'fa-wave-square' },
        { id: 'must5', name: '选修二', icon: 'fa-compass' },
        { id: 'must6', name: '选修三', icon: 'fa-fire' }
        // 根据实际情况添加或删除上面的行
    ],
    
    // 网站配置
    site: {
        name: '物含妙理',
        author: '边城',
        year: '2025'
    },
    
    // 默认配置（当list.js文件不存在时使用）
    
};

// 使用说明：
// 1. 根据实际存在的must文件夹修改 existingCourses 数组
// 2. 如果文件夹不存在，请注释掉或删除对应的配置行
// 3. 确保每个must文件夹中都有对应的list.js文件