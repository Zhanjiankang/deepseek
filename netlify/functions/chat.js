// netlify/functions/chat.js

// 内存缓存，存储最近5分钟的请求结果
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5分钟缓存时间

// 清理过期缓存的函数
const cleanupCache = () => {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      cache.delete(key);
    }
  }
};

// 精简的系统提示词
const SYSTEM_PROMPT = `你是一位幽默严谨的物理老师。要求：
1. 物理知识必须准确严谨
2. 教学风格亲切友好，鼓励思考
3. 适当使用物理幽默梗
4. 回答简洁不使用表情
现在，请开始物理教学！`;

// 带超时的fetch请求
const fetchWithTimeout = async (url, options, timeout = 10000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

export const handler = async (event, context) => {
  const startTime = Date.now();
  
  // 1. 仅允许 POST 请求
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    // 2. 解析前端传来的数据
    const body = JSON.parse(event.body);
    const userMessage = (body.messages && body.messages[0] && body.messages[0].content) || body.message || "你好";
    
    // 3. 检查缓存（包含模型信息作为缓存键的一部分）
    cleanupCache();
    const cacheKey = JSON.stringify({
      message: userMessage.trim().toLowerCase(),
      model: "deepseek-chat",
      temperature: 0.7
    });
    
    const cached = cache.get(cacheKey);
    
    if (cached) {
      const cacheTime = Date.now() - startTime;
      console.log(`缓存命中: ${userMessage.substring(0, 30)}..., 响应时间: ${cacheTime}ms`);
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=300",
          "X-Cache": "HIT",
          "X-Response-Time": `${cacheTime}ms`
        },
        body: JSON.stringify(cached.response),
      };
    }

    // 4. 从环境变量获取 API Key
    const API_KEY = process.env.DEEPSEEK_API_KEY;
    if (!API_KEY) {
      return { statusCode: 500, body: JSON.stringify({ error: "API Key未配置" }) };
    }

    // 5. 发送请求给 DeepSeek (使用 OpenAI 兼容格式)
    let retryCount = 0;
    const maxRetries = 2;
    let lastError;
    
    while (retryCount <= maxRetries) {
      try {
        const requestStartTime = Date.now();
        const response = await fetchWithTimeout("https://api.deepseek.com/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`,
          },
          body: JSON.stringify({
            model: "deepseek-chat",
            messages: [
              { 
                role: "system", 
                content: SYSTEM_PROMPT
              },
              { role: "user", content: userMessage },
            ],
            stream: false,
            temperature: 0.7,
            max_tokens: 800,
          }),
        }, 15000); // 15秒超时

        const requestTime = Date.now() - requestStartTime;
        
        if (!response.ok) {
          throw new Error(`API响应错误: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // 6. 缓存结果
        cache.set(cacheKey, {
          response: data,
          timestamp: Date.now()
        });

        // 7. 返回结果给前端
        const totalTime = Date.now() - startTime;
        console.log(`API请求成功: ${userMessage.substring(0, 30)}..., 请求时间: ${requestTime}ms, 总时间: ${totalTime}ms`);
        
        return {
          statusCode: 200,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=300",
            "X-Cache": "MISS",
            "X-Response-Time": `${totalTime}ms`,
            "X-API-Time": `${requestTime}ms`
          },
          body: JSON.stringify(data),
        };
      } catch (error) {
        lastError = error;
        retryCount++;
        if (retryCount <= maxRetries) {
          console.log(`请求失败，第${retryCount}次重试...`, error.message);
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount)); // 指数退避
        }
      }
    }

    // 所有重试都失败
    throw lastError;

  } catch (error) {
    const totalTime = Date.now() - startTime;
    console.error(`Error (${totalTime}ms):`, error);
    
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "X-Response-Time": `${totalTime}ms`
      },
      body: JSON.stringify({ 
        error: "服务器内部错误",
        message: error.message,
        timestamp: new Date().toISOString()
      }),
    };
  }
};
