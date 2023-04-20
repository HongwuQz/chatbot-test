import { message } from "antd";
import { OpenAIError } from "../server";
import { OpenAIModel, OpenAIModelID } from "@/types/openai";
import { Dispatch, SetStateAction } from "react";
import { CHATBOT_BASE_URL } from "./const";

export async function msgIntercetor(
  isLogin: boolean,
  token: string,
  model: OpenAIModel,
  setRechargeVisible: Dispatch<SetStateAction<boolean>>,
  setLoginVisible: Dispatch<SetStateAction<boolean>>
) {
    // 游客状态
    if (!isLogin) {
        try {
            const visitorLimitResponse = await fetch(`${CHATBOT_BASE_URL}/sample/ChatSend`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: '游客发送了一条消息' }),
            })
            // 请求失败
            if (visitorLimitResponse.status !== 200) {
            const result = await visitorLimitResponse.json();
            if (result.error) {
                throw new OpenAIError(
                result.error.message,
                result.error.type,
                result.error.param,
                result.error.code,
                );
            } else {
                const decoder = new TextDecoder();
                throw new Error(
                `error: ${
                    decoder.decode(result?.value) || result.statusText
                }`,
                );
            }
            } else {
                const { Code, Msg } = await visitorLimitResponse.json()
                const Errormessage = Msg as string
                if (Code !== 200) {
                    message.error(Errormessage)
                    setLoginVisible(true)
                }
            }
            return true
        } catch (error) {
            message.error('服务器异常，请重试')
        }
    } else {
        try {
            const userBalanceResponse = await fetch(`${CHATBOT_BASE_URL}/user/Balance`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token && {Auth: token}),
            },
            })
    
            // 获取用户余额失败
            if (userBalanceResponse.status !== 200) {
            const result = await userBalanceResponse.json();
            if (result.error) {
                throw new OpenAIError(
                result.error.message,
                result.error.type,
                result.error.param,
                result.error.code,
                );
            } else {
                const decoder = new TextDecoder();
                throw new Error(
                `error: ${
                    decoder.decode(result?.value) || result.statusText
                }`,
                );
            }
            } else {
            // 获取余额正常
            const { Data } = await userBalanceResponse.json();
            const { totalCoin, totalCoinMore, totalCoinUse } = Data
            const moneyRest = Number(totalCoin) + Number(totalCoinMore) - Number(totalCoinUse)
            const questionCost = model.id === OpenAIModelID.GPT_3_5 ? 1 : 30
            if (moneyRest < questionCost) {
                message.error('余额不足请充值')
                setRechargeVisible(true)
                return;
            }
            }
        } catch (error) {
            message.error('服务器异常，请重试')
        }
        return true
    }
}