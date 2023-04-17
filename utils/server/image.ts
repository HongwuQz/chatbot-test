import { Message } from '@/types/chat';
import { OpenAIModel, OpenAIModelID } from '@/types/openai';
import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from 'eventsource-parser';
import { GPT4_API_HOST, OPENAI_API_HOST } from '../app/const';
import { OpenAIError } from '.';

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

export const OpenAIImage = async (
  messages: Message[],
) => {
  console.log('Starting Image fetch...')

  const debugApiInfo = true ? {
    host: GPT4_API_HOST,
    key: 'sb-4a3b5759b2048260f1087271e1e986f2'
  } : {
    host: OPENAI_API_HOST,
    key: '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'
  }

  const res = await fetch(`${debugApiInfo.host}/v1/images/generations`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${debugApiInfo.key}`,
      ...(process.env.OPENAI_ORGANIZATION && {
        'OpenAI-Organization': process.env.OPENAI_ORGANIZATION,
      }),
    },
    method: 'POST',
    body: JSON.stringify({
        prompt: messages[messages.length - 1].content,
        size: '512x512',
        n: 1,
      }),
  });


  const result = await res.json();
  if (res.status !== 200) {
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
          result.statusText
        }`,
      );
    }
  }

  const resBody = res.body
  console.log({ resBody, result })

  return result;
};
