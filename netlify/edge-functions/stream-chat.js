export default async (request, context) => {
  // 从 Netlify 环境获取 Key
  const API_KEY = Netlify.env.get("DEEPSEEK_API_KEY");
  
  const body = await request.json();
  
  const deepseekResp = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [{ role: "user", content: body.message }],
      stream: true, // 开启流
    }),
  });

  // 直接透传 DeepSeek 的流给前端
  return new Response(deepseekResp.body, {
    headers: { "Content-Type": "text/event-stream" },
  });
};
