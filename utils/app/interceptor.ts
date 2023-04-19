import { message } from "antd";
import { BASE_BACKEND_URL } from "../constant";
import { OpenAIError } from "../server";
import { OpenAIModel, OpenAIModelID } from "@/types/openai";
import { Dispatch, SetStateAction } from "react";

export async function msgIntercetor(isLogin: boolean, token: string, model: OpenAIModel, setVisible: Dispatch<SetStateAction<boolean>>) {
    // 游客状态
    if (!isLogin) {
        try {
            const visitorLimitResponse = await fetch(`${process.env.BASE_BACKEND_URL || BASE_BACKEND_URL}/sample/ChatSend`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
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
            }
        } catch (error) {
            message.error('服务器异常，请重试')
        }
        }
    
        // 用户状态
        if (isLogin) {
        // 改成await + fetch 获取用户账户
        try {
            const userBalanceResponse = await fetch(`${process.env.BASE_BACKEND_URL || BASE_BACKEND_URL}/user/Balance`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Auth: token
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
                setVisible(true)
                return;
            }
            }
        } catch (error) {
            message.error('服务器异常，请重试')
        }

        return true
    }
}