import { ApiResult } from "@/types/data";
import { CHATBOT_BASE_URL } from "@/utils/app/const";
import { BalanceResponse } from "@/types/balance";

export const getUserBalance = (token: string): Promise<ApiResult<BalanceResponse>> => {
    return new Promise((resolve, reject) => {
        try {
        fetch(`${CHATBOT_BASE_URL}/user/Balance`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            Auth: token,
            },
        }).then(res => {
            res.status === 200 ? resolve(res.json()) : reject(res.json())
        }, rej => reject(rej));
        } catch (error) {
        reject(error)
        }
    })
}

export const chargeBalanceApi = (money: number, chargeDevice: "1" | "2" = "1", token: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        try {
        fetch(`${CHATBOT_BASE_URL}/charge/Balance`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            Auth: token,
            body: JSON.stringify({ money, chargeDevice })
            },
        }).then(res => {
            res.status === 200 ? resolve(res.json()) : reject(res.json())
        }, rej => reject(rej));
        } catch (error) {
        reject(error)
        }
    })
}

export const getChargeList = (token: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        try {
        fetch(`${CHATBOT_BASE_URL}/charge/items`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            Auth: token,
            },
        }).then(res => {
            res.status === 200 ? resolve(res.json()) : reject(res.json())
        }, rej => reject(rej));
        } catch (error) {
        reject(error)
        }
    })
}