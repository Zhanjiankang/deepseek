// netlify/functions/chat.js

export const handler = async (event, context) => {
  // 1. 仅允许 POST 请求
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    // 2. 解析前端传来的数据
    const body = JSON.parse(event.body);
    const userMessage = body.message || "你好";

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
          { role: "system", content: "你是 DeepSeek 的智能助手。" },
          { role: "user", content: userMessage },
        ],
        stream: false, // 简化示例，暂时不用流式传输
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
