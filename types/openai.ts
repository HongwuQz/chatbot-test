export enum OpenAIModelID {
  GPT_3_5 = 'gpt-3.5-turbo',
  GPT_4 = 'gpt-4',
  IMAGE = 'imageModel'
}

export interface OpenAIModel {
  id: OpenAIModelID;
  name: string;
  maxLength: number; // maximum length of a message
  tokenLimit: number;
}

// in case the `DEFAULT_MODEL` environment variable is not set or set to an unsupported model
export const fallbackModelID = OpenAIModelID.GPT_3_5;

export const OpenAIModels: Record<OpenAIModelID, OpenAIModel> = {
  [OpenAIModelID.GPT_3_5]: {
    id: OpenAIModelID.GPT_3_5,
    name: 'GPT-3.5',
    maxLength: 12000,
    tokenLimit: 4000,
  },
  [OpenAIModelID.GPT_4]: {
    id: OpenAIModelID.GPT_4,
    name: 'GPT-4',
    maxLength: 2400,
    tokenLimit: 8000,
  },
  [OpenAIModelID.IMAGE]: {
    id: OpenAIModelID.IMAGE,
    name: 'GTP-Image',
    maxLength: 2400,
    tokenLimit: 8000,
  },
};

export const OpenAIModelPrice: Record<OpenAIModel["name"], string> = {
  [OpenAIModels["gpt-3.5-turbo"].name]: '1 凤凰币/次',
  [OpenAIModels["gpt-4"].name]: '30 凤凰币/次',
  [OpenAIModels["imageModel"].name]: '10 凤凰币/次'
}