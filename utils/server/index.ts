import { Message } from '@/types/chat';
import { OpenAIModel, OpenAIModelID } from '@/types/openai';
import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from 'eventsource-parser';
import { GPT4_API_HOST, OPENAI_API_HOST } from '../app/const';

export class OpenAIError extends Error {
  type: string;
  param: string;
  code: string;

  constructor(message: string, type: string, param: string, code: string) {
    super(message);
    this.name = 'OpenAIError';
    this.type = type;
    this.param = param;
    this.code = code;
  }
}

interface ApiFetchInfo {
  apiUrl: string
  organizationAuth?: {
    'OpenAI-Organization': string
  } | ''
  apiKey: string
  body: OpenAIChatBody | OpenAIImageBody
}

interface OpenAIMessage {
  role: string
  content: string
}

interface OpenAIChatBody {
  model: OpenAIModelID,
  messages: OpenAIMessage[]
  max_tokens: number
  temperature: number
  stream: boolean
}

interface OpenAIImageBody {
  prompt: string,
  n: 1,
  size: '1024x1024'
}

export const OpenAIStream = async (
  model: OpenAIModel,
  systemPrompt: string,
  key: string,
  messages: Message[],
) => {
  console.log('Starting fetch...')
  const chatBody: OpenAIChatBody = {
    model: model.id,
    messages: [
      {
        role: 'system',
        content: systemPrompt,
      },
      ...messages,
    ],
    max_tokens: 1000,
    temperature: 1,
    stream: true,
  }

  const imageBody: OpenAIImageBody = {
    prompt: messages[messages.length - 1].content,
    size: '1024x1024',
    n: 1,
  }

  const ApiFetchInfo: Record<OpenAIModelID, ApiFetchInfo> = {
    // 其中的key已经取消了，后续单独扣除
    [OpenAIModelID.GPT_3_5]: {
      apiUrl: `${OPENAI_API_HOST}/v1/chat/completions`,
      apiKey: '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',
      organizationAuth: process.env.OPENAI_ORGANIZATION && { 'OpenAI-Organization': process.env.OPENAI_ORGANIZATION },
      body: chatBody
    },
    [OpenAIModelID.GPT_4]: {
      apiUrl: `${GPT4_API_HOST}/v1/chat/completions`,
      apiKey: 'sb-4a3b5759b2048260f1087271e1e986f2',
      body: chatBody
    },
    [OpenAIModelID.IMAGE]: {
      apiUrl: `${OPENAI_API_HOST}/v1/images/generations`,
      apiKey: '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',
      organizationAuth: process.env.OPENAI_ORGANIZATION && { 'OpenAI-Organization': process.env.OPENAI_ORGANIZATION },
      body: imageBody
    }
  }

  const { apiUrl, apiKey, organizationAuth, body } = ApiFetchInfo[model.id]

  const res = await fetch(apiUrl, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      ...organizationAuth,
    },
    method: 'POST',
    body: JSON.stringify(body),
  });

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  if (res.status !== 200) {
    const result = await res.json();
    console.log({ error: result })
    if (result.error) {
      throw new OpenAIError(
        result.error.message,
        result.error.type,
        result.error.param,
        result.error.code,
      );
    } else {
      throw new Error(
        `OpenAI API returned an error: ${
          decoder.decode(result?.value) || result.statusText
        }`,
      );
    }
  }

  console.log({ apiRES: res.json() })

  const stream = new ReadableStream({
    async start(controller) {
      const onParse = (event: ParsedEvent | ReconnectInterval) => {
        if (event.type === 'event') {
          const data = event.data;

          console.log({ apiRes: data })

          if (data === '[DONE]') {
            controller.close();
            return;
          }

          try {
            const json = JSON.parse(data);
            const text = json.choices[0].delta.content;
            const queue = encoder.encode(text);
            controller.enqueue(queue);
          } catch (e) {
            controller.error(e);
          }
        }
      };

      const parser = createParser(onParse);

      for await (const chunk of res.body as any) {
        parser.feed(decoder.decode(chunk));
      }
    },
  });

  return stream;
};
