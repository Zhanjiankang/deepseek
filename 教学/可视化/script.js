// script.js - 主JavaScript文件

// 全局变量
let coursesData = {};

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 更新日期显示
    updateDateDisplay();
    
    // 初始化页面
    initializePage();
});

// 更新日期显示
function updateDateDisplay() {
    const now = new Date();
    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
    document.getElementById('currentDate').textContent =
        `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 星期${weekDays[now.getDay()]}`;
}

// 初始化页面
function initializePage() {
    const gridContainer = document.getElementById('courseGrid');
    
    // 显示加载中
    showLoading(gridContainer);
    
    // 延迟加载，确保DOM完全加载
    setTimeout(() => {
        loadCourseList();
    }, 100);
}

// 显示加载动画
function showLoading(container) {
    container.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                <span class="visually-hidden">加载中...</span>
            </div>
            <p class="mt-3">正在加载课程目录...</p>
        </div>
    `;
}

// 加载课程列表
function loadCourseList() {
    const gridContainer = document.getElementById('courseGrid');
    
    // 检查CONFIG是否存在
    if (!CONFIG || !CONFIG.existingCourses) {
        showErrorMessage(gridContainer, "配置文件加载失败，请检查config.js文件");
        return;
    }
    
    // 检查是否有配置的课程
    if (CONFIG.existingCourses.length === 0) {
        gridContainer.innerHTML = `
            <div class="col-12">
                <div class="alert alert-warning text-center">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    未配置任何课程。请在config.js文件中添加must文件夹配置。
                </div>
            </div>
        `;
        return;
    }
    
    // 清空容器并创建课程项目
    gridContainer.innerHTML = '';
    createCourseItems(CONFIG.existingCourses);
}

// 创建课程项目
function createCourseItems(courses) {
    courses.forEach(course => {
        // 创建网格项
        const gridItem = document.createElement('div');
        gridItem.className = 'grid-item';
        gridItem.id = `${course.id}-grid`;
        
        // 添加网格头部
        gridItem.innerHTML = `
            <div class="grid-header">
                <h3 class="grid-title"><i class="fas ${course.icon} me-2"></i>${course.name}</h3>
            </div>
            <div class="list-container">
                <div class="loading-spinner">
                    <div class="spinner-border spinner-border-sm text-primary" role="status">
                        <span class="visually-hidden">加载中...</span>
                    </div>
                    <p class="mt-1 small">加载${course.name}内容...</p>
                </div>
            </div>
        `;
        
        // 添加到网格容器
        document.getElementById('courseGrid').appendChild(gridItem);
        
        // 异步加载课程内容
        loadCourseContent(course.id, course.name);
    });
}

// 加载单个课程内容
function loadCourseContent(courseId, courseName) {
    // 创建脚本元素
    const script = document.createElement('script');
    script.src = `./${courseId}/list.js?v=${Date.now()}`;
    
    script.onload = function() {
        try {
            // 尝试从全局变量中获取数据
            // 约定：每个list.js文件应该定义一个全局变量，格式为：window[courseId + 'List']
            const listData = window[`${courseId}List`];
            
            if (listData && Array.isArray(listData) && listData.length > 0) {
                // 存储数据
                coursesData[courseId] = listData;
                renderCourseList(courseId, listData);
            } else {
                // 如果数据格式不正确，使用配置中的默认列表
                const defaultList = getDefaultList(courseId);
                coursesData[courseId] = defaultList;
                renderCourseList(courseId, defaultList);
            }
        } catch (error) {
            console.error(`加载课程 ${courseName} 内容时出错:`, error);
            showCourseErrorMessage(courseId, `加载内容时出错: 数据格式不正确`);
        }
    };
    
    script.onerror = function() {
        // JS文件加载失败，使用配置中的默认列表
        const defaultList = getDefaultList(courseId);
        coursesData[courseId] = defaultList;
        renderCourseList(courseId, defaultList);
    };
    
    // 添加到文档头部
    document.head.appendChild(script);
}

// 从配置中获取默认列表
function getDefaultList(courseId) {
    if (CONFIG.defaultLists && CONFIG.defaultLists[courseId]) {
        return CONFIG.defaultLists[courseId];
    }
    
    // 如果配置中没有默认列表，返回空数组
    return [];
}

// 渲染课程列表
function renderCourseList(courseId, items) {
    const gridItem = document.getElementById(`${courseId}-grid`);
    if (!gridItem) return;
    
    const listContainer = gridItem.querySelector('.list-container');
    if (!listContainer) return;
    
    // 清空加载动画
    listContainer.innerHTML = '';
    
    if (!items || items.length === 0) {
        listContainer.innerHTML = '<p class="text-muted text-center">暂无内容</p>';
        return;
    }
    
    // 创建列表
    const list = document.createElement('ul');
    list.className = 'list';
    
    items.forEach(item => {
        const listItem = document.createElement('li');
        
        // 生成正确的链接
        let link = item.link || '#';
        let linkText = item.name || '未命名';
        
        // 如果链接不是以http开头，也不是以#开头，则认为是相对路径
        if (!link.startsWith('http') && !link.startsWith('/') && link !== '#') {
            link = `./${courseId}/${link}`;
        }
        
        listItem.innerHTML = `<a href="${link}" ${link === '#' ? 'onclick="return false;"' : ''}>${linkText}</a>`;
        list.appendChild(listItem);
    });
    
    listContainer.appendChild(list);
}

// 显示课程错误信息
function showCourseErrorMessage(courseId, message) {
    const gridItem = document.getElementById(`${courseId}-grid`);
    if (!gridItem) return;
    
    const listContainer = gridItem.querySelector('.list-container');
    if (!listContainer) return;
    
    listContainer.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-triangle me-2"></i>${message}
        </div>
        <div class="text-center mt-2">
            <button class="btn btn-sm btn-outline-primary" onclick="retryLoadCourse('${courseId}')">
                重试加载
            </button>
        </div>
    `;
}

// 显示全局错误信息
function showErrorMessage(container, message) {
    container.innerHTML = `
        <div class="col-12">
            <div class="alert alert-danger text-center">
                <i class="fas fa-exclamation-circle me-2"></i>${message}
            </div>
        </div>
    `;
}

// 重试加载课程（全局函数，供HTML按钮调用）
window.retryLoadCourse = function(courseId) {
    const gridItem = document.getElementById(`${courseId}-grid`);
    if (!gridItem) return;
    
    // 获取课程名称
    const titleElement = gridItem.querySelector('.grid-title');
    const courseName = titleElement ? titleElement.textContent.replace(/[^必修一二三四五六七八九十]/g, '') : '必修';
    
    // 重新显示加载动画
    const listContainer = gridItem.querySelector('.list-container');
    if (listContainer) {
        listContainer.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner-border spinner-border-sm text-primary" role="status">
                    <span class="visually-hidden">加载中...</span>
                </div>
                <p class="mt-1 small">重新加载内容...</p>
            </div>
        `;
    }
    
    // 重新加载课程内容
    loadCourseContent(courseId, courseName);
};

// 刷新整个页面
window.refreshPage = function() {
    window.location.reload();
};