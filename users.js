// users.js - 用户账号和班级映射配置文件

window.usersData = {
    // 用户账号配置
    // 格式: { username: '用户名', password: '密码', classes: ['班级1', '班级2'] }
    users: [
        {
            username: 'teacher1',
            password: '123456',
            classes: ['高一(1)班', '高一(2)班']
        },
        {
            username: 'teacher2', 
            password: '654321',
            classes: ['高二(1)班', '高二(3)班']
        },
        {
            username: 'admin',
            password: 'admin123',
            classes: ['高一(1)班', '高一(2)班', '高二(1)班', '高二(2)班', '高二(3)班']
        }
    ],
    
    // 班级学生名单文件映射
    // 格式: { '班级名称': '学生名单文件路径' }
    classStudents: {
        '高一(1)班': 'classes/class1-students.js',
        '高一(2)班': 'classes/class2-students.js', 
        '高二(1)班': 'classes/class3-students.js',
        '高二(2)班': 'classes/class4-students.js',
        '高二(3)班': 'classes/class5-students.js'
    },
    
    // 配置信息
    config: {
        version: '1.0',
        lastUpdated: '2025-01-20',
        description: '用户账号和班级映射配置'
    }
};
