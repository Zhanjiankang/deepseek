/**
 * script.js - 物含妙理网站JavaScript功能文件
 * 
 * 文件说明：
 * 1. 此文件包含网站的所有JavaScript功能逻辑
 * 2. 从原index.html文件中提取而来，实现逻辑与结构的分离
 * 3. 包含数据加载、随机点名、格言显示、问题展示等功能
 * 4. 使用模块化设计，便于维护和扩展
 * 
 * 主要功能模块：
 * 1. 配置管理 (CONFIG)
 * 2. 数据存储和管理
 * 3. DOM元素引用管理
 * 4. 日期显示功能
 * 5. 外部数据加载功能
 * 6. 格言和问题展示功能
 * 7. 随机点名功能
 * 8. 更新数据管理功能
 * 9. 用户界面状态管理
 * 10. 应用初始化功能
 */

/* ==================== 应用配置 ==================== */
/**
 * 应用配置对象
 * 包含所有外部数据文件的URL路径和重要参数
 */
const CONFIG = {
    quotesUrl: 'quotes.js',        // 格言数据文件路径
    questionsUrl: 'questions.js',  // 问题数据文件路径
    studentsUrl: 'students.js',    // 学生名单数据文件路径（默认）
    updatesUrl: 'latest-data.js',  // 更新数据文件路径
    maxItems: 4,                   // 最大显示更新条目数
    usersUrl: 'users.js'           // 用户数据文件路径
};

/* ==================== 数据存储 ==================== */
/**
 * 数据存储变量
 * 用于缓存从外部文件加载的数据
 */
let quotesData = [];      // 存储格言数据
let questionsData = [];   // 存储问题数据
let studentsData = [];    // 存储学生名单数据
let updatesData = [];     // 存储更新数据
let usersData = null;     // 存储用户数据
let currentUser = null;   // 当前登录用户
let currentClass = null;  // 当前选择班级

/* ==================== DOM元素引用 ==================== */
/**
 * DOM元素引用对象
 * 集中管理所有需要操作的DOM元素，便于维护和避免重复查询
 */
const dom = {
    // 格言相关元素
    quoteText: document.getElementById('quoteText'),      // 格言文本显示区域
    quoteAuthor: document.getElementById('quoteAuthor'),  // 格言作者显示区域
    changeQuote: document.getElementById('changeQuote'),  // 更换格言按钮
    
    // 问题相关元素
    questionText: document.getElementById('questionText'),    // 问题文本显示区域
    changeQuestion: document.getElementById('changeQuestion'), // 更换问题按钮
    
    // 点名相关元素
    rollcallBtn: document.getElementById('rollcallBtn'),      // 点名按钮
    selectedStudent: document.getElementById('selectedStudent'), // 被选学生显示区域
    
    // 更新列表相关元素
    list: document.getElementById('latestUpdatesList'),   // 更新列表容器
    loading: document.getElementById('loadingIndicator'), // 加载指示器
    error: document.getElementById('errorMessage'),       // 错误消息容器
    errorText: document.getElementById('errorText'),      // 错误消息文本
    empty: document.getElementById('emptyMessage'),       // 空状态消息容器
    lastUpdated: document.getElementById('lastUpdated'),  // 最后更新时间显示
    refreshUpdates: document.getElementById('refreshUpdates'), // 刷新更新按钮
    
    // 登录相关元素
    loginModal: document.getElementById('loginModal'),    // 登录模态框
    loginBtn: document.getElementById('loginBtn'),        // 登录按钮
    loginTrigger: document.getElementById('loginTrigger'), // 登录触发按钮
    logoutBtn: document.getElementById('logoutBtn'),      // 退出按钮
    usernameInput: document.getElementById('username'),   // 用户名输入框
    passwordInput: document.getElementById('password'),   // 密码输入框
    loginError: document.getElementById('loginError'),    // 登录错误提示
    loginErrorText: document.getElementById('loginErrorText'), // 登录错误文本
    userDisplay: document.getElementById('userDisplay'),  // 用户信息显示区域
    usernameDisplay: document.getElementById('usernameDisplay'), // 用户名显示
    classSelection: document.getElementById('classSelection'), // 班级选择区域
    classSelect: document.getElementById('classSelect')   // 班级选择下拉框
};

/* ==================== 日期显示功能 ==================== */
/**
 * 更新日期显示
 * 在页面顶部显示当前日期和星期几
 */
function updateDateDisplay() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
    const weekDay = weekDays[now.getDay()];
    
    // 更新日期显示区域内容
    document.getElementById('currentDate').textContent = 
        `${year}年${month}月${day}日 星期${weekDay}`;
}

/* ==================== 外部数据加载功能 ==================== */
/**
 * 加载外部数据文件
 * 通过动态创建script标签加载外部JavaScript数据文件
 * @param {string} url - 要加载的数据文件URL
 * @returns {Promise} 返回Promise对象，表示加载状态
 */
function loadExternalData(url) {
    return new Promise((resolve, reject) => {
        // 创建script标签
        const script = document.createElement('script');
        // 添加时间戳防止缓存
        script.src = url + '?v=' + new Date().getTime();
        
        // 加载成功回调
        script.onload = () => resolve();
        // 加载失败回调
        script.onerror = () => reject(`无法加载: ${url}`);
        
        // 将script标签添加到head中开始加载
        document.head.appendChild(script);
    });
}

/* ==================== 格言功能模块 ==================== */
/**
 * 加载格言数据
 * 异步加载格言数据文件并显示随机格言
 */
async function loadQuotes() {
    try {
        // 加载格言数据文件
        await loadExternalData(CONFIG.quotesUrl);
        
        // 检查数据是否成功加载到全局变量
        if (window.quotesData && window.quotesData.length > 0) {
            quotesData = window.quotesData;
            // 显示随机格言
            showRandomQuote();
        } else {
            // 数据加载失败，显示错误信息
            dom.quoteText.textContent = "格言数据加载失败";
        }
    } catch (error) {
        // 捕获加载错误
        console.error(error);
        dom.quoteText.textContent = "格言数据加载失败";
    }
}

/**
 * 显示随机格言
 * 从已加载的格言数据中随机选择一条显示
 */
function showRandomQuote() {
    // 检查是否有格言数据
    if (quotesData.length === 0) return;
    
    // 随机选择格言索引
    const randomIndex = Math.floor(Math.random() * quotesData.length);
    const quote = quotesData[randomIndex];
    
    // 更新DOM显示格言和作者
    dom.quoteText.textContent = `"${quote.text}"`;
    dom.quoteAuthor.textContent = `—— ${quote.author}`;
}

/* ==================== 问题功能模块 ==================== */
/**
 * 加载问题数据
 * 异步加载问题数据文件并显示随机问题
 */
async function loadQuestions() {
    try {
        // 加载问题数据文件
        await loadExternalData(CONFIG.questionsUrl);
        
        // 检查数据是否成功加载
        if (window.questionsData && window.questionsData.length > 0) {
            questionsData = window.questionsData;
            // 显示随机问题
            showRandomQuestion();
        } else {
            // 数据加载失败，显示错误信息
            dom.questionText.textContent = "问题数据加载失败";
        }
    } catch (error) {
        // 捕获加载错误
        console.error(error);
        dom.questionText.textContent = "问题数据加载失败";
    }
}

/**
 * 显示随机问题
 * 从已加载的问题数据中随机选择一条显示
 */
function showRandomQuestion() {
    // 检查是否有问题数据
    if (questionsData.length === 0) return;
    
    // 随机选择问题索引
    const randomIndex = Math.floor(Math.random() * questionsData.length);
    const question = questionsData[randomIndex];
    
    // 更新DOM显示问题
    dom.questionText.textContent = question.question;
}

/* ==================== 用户数据功能模块 ==================== */
/**
 * 加载用户数据
 * 异步加载用户账号和班级映射数据文件
 */
async function loadUsers() {
    try {
        // 加载用户数据文件
        await loadExternalData(CONFIG.usersUrl);
        
        // 检查数据是否成功加载
        if (window.usersData && window.usersData.users) {
            usersData = window.usersData;
            console.log("用户数据加载成功");
        } else {
            console.error("用户数据加载失败");
        }
    } catch (error) {
        console.error("用户数据加载错误:", error);
    }
}

/* ==================== 学生数据功能模块 ==================== */
/**
 * 加载学生数据
 * 异步加载学生名单数据文件
 */
async function loadStudents(classUrl) {
    try {
        // 加载指定班级的学生数据文件
        await loadExternalData(classUrl);
        
        // 检查数据是否成功加载
        if (window.studentsData && window.studentsData.length > 0) {
            studentsData = window.studentsData;
            console.log("学生数据加载成功");
        } else {
            console.error("学生数据加载失败");
            studentsData = [];
        }
    } catch (error) {
        console.error("学生数据加载错误:", error);
        studentsData = [];
    }
}

/* ==================== 登录验证功能模块 ==================== */
/**
 * 验证用户登录
 * @param {string} username - 用户名
 * @param {string} password - 密码
 * @returns {object|null} 验证成功的用户对象或null
 */
function authenticateUser(username, password) {
    if (!usersData || !usersData.users) {
        return null;
    }
    
    // 查找匹配的用户
    const user = usersData.users.find(u => 
        u.username === username && u.password === password
    );
    
    return user || null;
}

/**
 * 处理用户登录
 */
function handleLogin() {
    const username = dom.usernameInput.value.trim();
    const password = dom.passwordInput.value.trim();
    
    // 验证输入
    if (!username || !password) {
        showLoginError("请输入用户名和密码");
        return;
    }
    
    // 验证用户
    const user = authenticateUser(username, password);
    if (!user) {
        showLoginError("用户名或密码错误");
        return;
    }
    
    // 登录成功
    currentUser = user;
    hideLoginError();
    
    // 关闭模态框
    const modal = bootstrap.Modal.getInstance(dom.loginModal) || new bootstrap.Modal(dom.loginModal);
    modal.hide();
    
    // 更新界面状态
    updateUIAfterLogin();
    
    // 保存登录状态到本地存储
    saveLoginData();
    
    // 清空输入框
    dom.usernameInput.value = '';
    dom.passwordInput.value = '';
}

/**
 * 保存登录数据到本地存储
 */
function saveLoginData() {
    if (currentUser) {
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        localStorage.setItem('loginTimestamp', new Date().getTime().toString());
        
        // 如果当前有选中的班级，也保存
        if (currentClass) {
            localStorage.setItem('currentClass', currentClass);
        }
    }
}

/**
 * 显示登录错误信息
 * @param {string} message - 错误消息
 */
function showLoginError(message) {
    dom.loginErrorText.textContent = message;
    dom.loginError.classList.remove('d-none');
}

/**
 * 隐藏登录错误信息
 */
function hideLoginError() {
    dom.loginError.classList.add('d-none');
}

/**
 * 更新登录后的界面状态
 */
function updateUIAfterLogin() {
    // 显示用户信息
    dom.usernameDisplay.textContent = currentUser.username;
    dom.userDisplay.classList.remove('d-none');
    dom.loginTrigger.classList.add('d-none');
    
    // 显示班级选择
    dom.classSelection.classList.remove('d-none');
    
    // 填充班级选择下拉框
    populateClassSelect();
    
    // 更新点名按钮状态
    updateRollcallButtonState();
}

/**
 * 填充班级选择下拉框
 */
function populateClassSelect() {
    if (!currentUser || !currentUser.classes) return;
    
    dom.classSelect.innerHTML = '<option value="">请选择班级</option>';
    
    currentUser.classes.forEach(className => {
        const option = document.createElement('option');
        option.value = className;
        option.textContent = className;
        dom.classSelect.appendChild(option);
    });
}

/**
 * 处理班级选择变化
 */
function handleClassChange() {
    const selectedClass = dom.classSelect.value;
    
    if (!selectedClass) {
        currentClass = null;
        studentsData = [];
        updateRollcallButtonState();
        dom.selectedStudent.textContent = "请选择班级";
        
        // 清除保存的班级选择
        localStorage.removeItem('currentClass');
        return;
    }
    
    currentClass = selectedClass;
    
    // 保存当前选择的班级
    if (currentUser) {
        localStorage.setItem('currentClass', selectedClass);
    }
    
    // 加载对应班级的学生数据
    const classUrl = usersData.classStudents[selectedClass];
    if (classUrl) {
        loadStudents(classUrl).then(() => {
            updateRollcallButtonState();
            dom.selectedStudent.textContent = `已选择班级: ${selectedClass}`;
        });
    } else {
        console.error("班级数据文件路径未找到");
        studentsData = [];
        updateRollcallButtonState();
    }
}

/**
 * 更新点名按钮状态
 */
function updateRollcallButtonState() {
    const canRollcall = currentUser && currentClass && studentsData.length > 0;
    dom.rollcallBtn.disabled = !canRollcall;
    
    if (canRollcall) {
        dom.selectedStudent.textContent = `已选择班级: ${currentClass} (${studentsData.length}名学生)`;
    }
}

/**
 * 处理退出登录
 */
function handleLogout() {
    currentUser = null;
    currentClass = null;
    studentsData = [];
    
    // 重置界面状态
    dom.userDisplay.classList.add('d-none');
    dom.loginTrigger.classList.remove('d-none');
    dom.classSelection.classList.add('d-none');
    dom.rollcallBtn.disabled = true;
    dom.selectedStudent.textContent = "请先登录并选择班级";
    dom.classSelect.innerHTML = '<option value="">请选择班级</option>';
    
    // 清除本地存储
    clearLoginData();
    
    console.log('用户已退出登录');
}

/* ==================== 随机点名功能模块 ==================== */
/**
 * 随机点名功能
 * 从学生名单中随机选择学生，带有动画效果
 */
function randomRollcall() {
    // 检查是否已登录并选择班级
    if (!currentUser || !currentClass) {
        dom.selectedStudent.textContent = "请先登录并选择班级";
        dom.selectedStudent.style.color = 'var(--accent-color)';
        return;
    }
    
    // 检查是否已加载学生数据
    if (studentsData.length === 0) {
        dom.selectedStudent.textContent = "学生名单加载失败，请重新选择班级";
        dom.selectedStudent.style.color = 'var(--accent-color)';
        return;
    }
    
    // 点名动画参数
    let count = 0;
    const maxCount = 20;  // 动画循环次数
    const interval = 100; // 动画间隔(毫秒)
    
    // 禁用按钮并显示加载状态
    dom.rollcallBtn.disabled = true;
    dom.rollcallBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>点名中...';
    
    // 创建定时器实现点名动画效果
    const intervalId = setInterval(() => {
        // 随机选择学生
        const randomIndex = Math.floor(Math.random() * studentsData.length);
        dom.selectedStudent.textContent = studentsData[randomIndex];
        dom.selectedStudent.style.color = 'var(--accent-color)';
        
        // 计数并检查是否结束动画
        count++;
        if (count >= maxCount) {
            // 清除定时器，结束动画
            clearInterval(intervalId);
            // 设置最终选中状态颜色
            dom.selectedStudent.style.color = 'var(--success-color)';
            
            // 延迟恢复按钮状态
            setTimeout(() => {
                dom.rollcallBtn.disabled = false;
                dom.rollcallBtn.innerHTML = '<i class="fas fa-random me-2"></i>开始随机点名';
            }, 500);
        }
    }, interval);
}

/* ==================== 更新数据功能模块 ==================== */
/**
 * 加载更新数据
 * 异步加载更新数据文件并处理显示
 */
async function loadUpdates() {
    // 显示加载状态
    showLoading();
    
    try {
        // 加载更新数据文件
        await loadExternalData(CONFIG.updatesUrl);
        
        // 检查数据格式是否正确
        if (window.latestUpdatesData && Array.isArray(window.latestUpdatesData)) {
            updatesData = window.latestUpdatesData;
            // 处理和渲染数据
            processAndRenderData(updatesData);
        } else {
            // 数据格式不正确，显示错误
            showError('更新数据格式不正确');
        }
    } catch (error) {
        // 捕获加载错误
        showError('无法加载更新数据');
    }
}

/**
 * 处理和渲染数据
 * 对更新数据进行排序和渲染显示
 * @param {Array} data - 要处理的更新数据数组
 */
function processAndRenderData(data) {
    // 隐藏所有消息状态
    hideMessages();
    
    // 更新最后更新时间显示
    if (window.dataLastUpdated) {
        dom.lastUpdated.textContent = `最后更新: ${window.dataLastUpdated}`;
    }
    
    // 检查数据是否为空
    if (!data || data.length === 0) {
        dom.empty.classList.remove('d-none');
        return;
    }
    
    // 按日期降序排序数据
    const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));
    // 渲染前N条数据
    renderData(sortedData.slice(0, CONFIG.maxItems));
}

/**
 * 渲染数据到列表
 * 将更新数据渲染到HTML列表中
 * @param {Array} items - 要渲染的数据项数组
 */
function renderData(items) {
    // 清空列表
    dom.list.innerHTML = '';
    
    // 遍历数据项并生成HTML
    items.forEach(item => {
        dom.list.innerHTML += `
            <li>
                <span>${item.date}</span>
                <a href="${item.link}">
                    ${item.title}
                </a>
            </li>`;
    });
    
    // 显示列表
    dom.list.classList.remove('d-none');
}

/* ==================== 用户界面状态管理 ==================== */
/**
 * 显示加载状态
 * 显示加载指示器，隐藏其他消息状态
 */
function showLoading() {
    hideMessages();
    dom.loading.classList.remove('d-none');
    dom.list.classList.add('d-none');
}

/**
 * 显示错误信息
 * 显示错误消息，隐藏其他消息状态
 * @param {string} message - 要显示的错误消息
 */
function showError(message) {
    hideMessages();
    dom.errorText.textContent = message;
    dom.error.classList.remove('d-none');
}

/**
 * 隐藏所有消息
 * 隐藏所有消息状态（加载、错误、空状态）
 */
function hideMessages() {
    dom.loading.classList.add('d-none');
    dom.error.classList.add('d-none');
    dom.empty.classList.add('d-none');
}

/* ==================== 应用初始化 ==================== */
/**
 * 初始化应用
 * 页面加载完成后执行的主要初始化逻辑
 */
async function init() {
    // 更新日期显示
    updateDateDisplay();
    
    // 并行加载所有数据（使用Promise.allSettled确保所有请求都完成）
    await Promise.allSettled([
        loadQuotes(),
        loadQuestions(),
        loadUsers(),
        loadUpdates()
    ]);
    
    // 检查本地存储中的登录状态
    checkLoginStatus();
    
    // 绑定事件监听器
    dom.changeQuote.addEventListener('click', showRandomQuote);
    dom.changeQuestion.addEventListener('click', showRandomQuestion);
    dom.rollcallBtn.addEventListener('click', randomRollcall);
    dom.refreshUpdates.addEventListener('click', loadUpdates);
    
    // 绑定登录相关事件监听器
    dom.loginTrigger.addEventListener('click', () => {
        const modal = new bootstrap.Modal(dom.loginModal);
        modal.show();
    });
    
    dom.loginBtn.addEventListener('click', handleLogin);
    dom.logoutBtn.addEventListener('click', handleLogout);
    dom.classSelect.addEventListener('change', handleClassChange);
    
    // 登录表单回车键支持
    dom.passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    });
}

/**
 * 检查登录状态
 * 从localStorage中恢复用户会话
 */
function checkLoginStatus() {
    const savedUser = localStorage.getItem('currentUser');
    const savedTimestamp = localStorage.getItem('loginTimestamp');
    
    if (savedUser && savedTimestamp) {
        // 检查会话是否过期（24小时）
        const currentTime = new Date().getTime();
        const loginTime = parseInt(savedTimestamp);
        const sessionDuration = 24 * 60 * 60 * 1000; // 24小时
        
        if (currentTime - loginTime < sessionDuration) {
            // 会话有效，自动登录
            const user = JSON.parse(savedUser);
            restoreUserSession(user);
        } else {
            // 会话过期，清除本地存储
            clearLoginData();
        }
    }
}

/**
 * 恢复用户会话
 * @param {object} user - 用户对象
 */
function restoreUserSession(user) {
    // 设置当前用户
    currentUser = user;
    
    // 显示用户信息
    dom.usernameDisplay.textContent = user.username;
    dom.userDisplay.classList.remove('d-none');
    dom.loginTrigger.classList.add('d-none');
    
    // 显示班级选择
    dom.classSelection.classList.remove('d-none');
    
    // 填充班级选择下拉框
    populateClassSelect();
    
    // 恢复之前选择的班级
    const savedClass = localStorage.getItem('currentClass');
    if (savedClass && user.classes.includes(savedClass)) {
        dom.classSelect.value = savedClass;
        handleClassChange();
    }
    
    console.log('自动登录成功:', user.username);
}

/**
 * 清除登录数据
 * 从localStorage中移除登录相关信息
 */
function clearLoginData() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('loginTimestamp');
    localStorage.removeItem('currentClass');
}

/* ==================== 页面加载完成事件 ==================== */
/**
 * 页面加载完成后初始化应用
 * DOMContentLoaded事件触发后执行初始化
 */
document.addEventListener('DOMContentLoaded', init);
