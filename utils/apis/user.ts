import { LoginData } from "@/types/user";
import { CHATBOT_BASE_URL } from "@/utils/app/const";
import { message } from "antd";

export const login = async (loginData: LoginData): Promise<any> => {
  try {
    const response = await fetch(`${CHATBOT_BASE_URL}/auth/usepass`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData)
    });
    const data = await response.json();
    if(data.Code !== 200) {
      message.error(data.Msg)
    }
    return data
  } catch (error) {
    alert(`请求失败: ${error}`)
  }
};

export const register = async (loginData: LoginData): Promise<any> => {
  try {
    const response = await fetch(`${CHATBOT_BASE_URL}/auth/usecode`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData)
    });
    const data = await response.json();
    message[data.Code === 200 ? 'success' : 'error'](data.Msg)
    return data
  } catch (error) {
    alert(`请求失败: ${error}`)
  }
};

export const getCode = async (phone: string): Promise<any> => {
  try {
    const response = await fetch(`${CHATBOT_BASE_URL}/auth/getcode`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone })
    });
    const data = await response.json();
    return data;
  } catch (error) {
    alert(`请求失败: ${error}`)
  }
};