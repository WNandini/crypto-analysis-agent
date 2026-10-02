const Groq = require("groq-sdk");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});
const { getCryptoData } = require("./tools/cryptoTool");

const askAI = async (message) => {
    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
      tools: [
        {
            type: 'function',
            function: {
                name: 'getCryptoData',
                description: 'Get current cryptocurrency price, 24 hour change, and 24 hour volume.',
                parameters: {
                    type: 'object',
                    properties: {
                    coin: {
                        type: 'string',
                        description: 'The CoinGecko ID of the cryptocurrency, for example bitcoin or ethereum',
                    }
                },
                required: ['coin'],
                },
            }
        }
      ],
      tool_choice: 'auto'
    });
    
    const messageResponse = response.choices[0].message;

    if (messageResponse.tool_calls?.length) {
        const toolCall = messageResponse.tool_calls[0];
      
        const coin = JSON.parse(toolCall.function.arguments).coin;
      
        const toolResult = await getCryptoData(coin);
        
        const finalResponse = await groq.chat.completions.create({
            model: "openai/gpt-oss-20b",

            messages: [
                {
                    role: 'user',
                    content: message,
                },
                messageResponse,
                {
                    role: 'tool',
                    tool_call_id: toolCall.id,
                    content:  JSON.stringify(toolResult),
                }
            ]

        })

        return finalResponse.choices[0].message.content;
    }

    return {
        content: messageResponse.content,
        toolCalls: messageResponse.tool_calls || [],
    };  
};

module.exports = {askAI};