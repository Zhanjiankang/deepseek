// 使用 jsDelivr 的 CDN 镜像，它允许跨域请求
//var ROOT_PATH = 'https://cdn.jsdelivr.net/gh/apache/echarts-examples/public';


// 窗口大小改变时自适应
window.addEventListener('resize', function() {
  myChart.resize();
});
// --- 第二部分：下载功能逻辑 ---

// 1. 下载 PNG 的功能
document.getElementById('download-png').addEventListener('click', function() {
    var imgData = myChart.getDataURL({
        type: 'png',
        pixelRatio: 2, 
        backgroundColor: '#fff' 
    });

    var link = document.createElement('a');
    link.download = 'ECharts-3D图表.png';
    link.href = imgData;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

// 2. 下载 PDF 的功能
document.getElementById('download-pdf').addEventListener('click', function() {
    // 从 window 对象中获取 jsPDF
    const { jsPDF } = window.jspdf;

    var imgData = myChart.getDataURL({
        type: 'png',
        pixelRatio: 2,
        backgroundColor: '#fff'
    });

    // A4 纸张, 纵向 portrait, 单位 mm
    var pdf = new jsPDF('p', 'mm', 'a4');
    
    var pageWidth = pdf.internal.pageSize.getWidth(); 
    var imgWidth = pageWidth - 20; // 左右留白各10mm
    var chartHeight = chartDom.clientHeight;
    var chartWidth = chartDom.clientWidth;
    var imgHeight = (imgWidth / chartWidth) * chartHeight;

    pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
    pdf.setFontSize(16);
    pdf.text("ECharts 3D Visualization Report", 10, imgHeight + 25);

    pdf.save('ECharts-3D报告.pdf');
});