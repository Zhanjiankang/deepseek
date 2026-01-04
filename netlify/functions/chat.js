// netlify/functions/chat.js

export const handler = async (event, context) => {
  // 1. 仅允许 POST 请求
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    // 2. 解析前端传来的数据
    const body = JSON.parse(event.body);
    //const userMessage = body.message || "你好";
// 优先尝试读取 messages 数组里的内容，如果没有再尝试 message 字段，最后才默认 "你好"
    const userMessage = (body.messages && body.messages[0] && body.messages[0].content) || body.message || "你好";
    // 3. 从环境变量获取 API Key
    const API_KEY = process.env.DEEPSEEK_API_KEY;

    if (!API_KEY) {
      return { statusCode: 500, body: JSON.stringify({ error: "API Key未配置" }) };
    }

      // 4. 发送请求给 DeepSeek (使用 OpenAI 兼容格式)
      const response = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat", // 或者 deepseek-coder
          messages: [
            { 
              role: "system", 
              content: `你是一位幽默严谨的物理老师。请遵循以下要求：
1. 物理知识必须准确严谨，不能有科学错误
2. 解释物理概念时要用幽默有趣的方式，比如使用生动的比喻、有趣的例子
3. 教学风格要亲切友好，鼓励学生提问和思考
4. 可以用一些物理相关的幽默梗，但不要过度
5. 对于复杂问题，先简化解释，再逐步深入
6. 始终保持积极鼓励的态度，即使学生问简单的问题

例如：
- 解释重力时可以说："想象一下，地球是个大磁铁，我们都是小铁屑，被它牢牢吸住！"
- 解释相对论时可以说："时间就像橡皮筋，速度越快它就越慢，所以跑得快的人老得慢一点哦！"

现在，请开始你的物理教学吧！`
            },
            { role: "user", content: userMessage },
          ],
          stream: false, // 简化示例，暂时不用流式传输
          temperature: 0.7, // 控制创造性：0.7既保持一定创造性又不会太离谱
          max_tokens: 1000, // 限制回答长度
        }),
      });

    const data = await response.json();

    // 5. 返回结果给前端
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "服务器内部错误" }),
    };
  }
};
