// class-records.js - 班级纪实配置文件

window.classRecordsData = {
    // 班级纪实数组
    // 每条记录包含以下信息：
    // - title: 记录标题
    // - link: 记录链接（本地或在线）
    // - date: 记录日期（格式：YYYY-MM-DD）
    // - type: 记录类型（activity, meeting, event, achievement, notice, homework, exam, photo, video, link）
    records: [
        {
            title: "物理实验课记录 - 力学实验",
            link: "pen.pdf",
            date: "2025-01-20",
            type: "activity"
        },
        {
            title: "班级物理竞赛成绩公布",
            link: "https://pan.baidu.com/s/13Jd8WdWPcqUdK1gS3JVPuQ?pwd=52kF",
            date: "2025-01-18",
            type: "achievement"
        },
        {
            title: "光学实验操作视频",
            link: "./videos/光学实验.mp4",
            date: "2025-01-15",
            type: "video"
        },
        {
            title: "物理学习小组讨论记录",
            link: "./records/学习小组讨论.docx",
            date: "2025-01-12",
            type: "meeting"
        },
        {
            title: "期中考试复习资料",
            link: "./docs/期中考试复习资料.pdf",
            date: "2025-01-10",
            type: "exam"
        },
        {
            title: "物理课外活动照片",
            link: "./photos/课外活动/活动照片1.jpg",
            date: "2025-01-08",
            type: "photo"
        },
        {
            title: "班级物理讲座通知",
            link: "./records/物理讲座通知.pdf",
            date: "2025-01-05",
            type: "notice"
        },
        {
            title: "热力学实验报告",
            link: "./docs/热力学实验报告.docx",
            date: "2025-01-03",
            type: "homework"
        },
        {
            title: "物理竞赛获奖名单",
            link: "./records/竞赛获奖名单.pdf",
            date: "2024-12-28",
            type: "achievement"
        },
        {
            title: "期末复习计划安排",
            link: "./records/期末复习计划.pdf",
            date: "2024-12-25",
            type: "event"
        }
    ],
    
    // 配置信息
    config: {
        version: "1.0",
        lastUpdated: "2025-01-20",
        author: "物含妙理",
        description: "班级活动与学习记录"
    }
};

// 使用说明：
// 1. 修改 records 数组，添加或删除班级记录
// 2. 每条记录必须包含 title, link, date 和 type 属性
// 3. link 可以是本地路径（如"./records/xxx.pdf"）或在线URL
// 4. type 可以是以下值：
//    - activity: 活动记录
//    - meeting: 会议/讨论
//    - event: 事件/活动
//    - achievement: 成就/成绩
//    - notice: 通知
//    - homework: 作业
//    - exam: 考试
//    - photo: 照片
//    - video: 视频
//    - link: 链接