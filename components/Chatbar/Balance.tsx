import { Dispatch, FC, SetStateAction, useCallback, useEffect, useMemo, useState } from "react";
import { IconRefresh } from "@tabler/icons-react";
import { RechargeModal, RechargeOption } from "./RechargeModal";
import { BalanceResponse } from "@/types/balance";
import { CHATBOT_BASE_URL } from "@/utils/app/const";
import { message } from "antd";

interface Props {
  token: string
  balance: BalanceResponse
  rechargeVisible: boolean
  setBalance: Dispatch<SetStateAction<BalanceResponse>>
  setRechargeVisible: Dispatch<SetStateAction<boolean>>
}

export const Balance: FC<Props> = ({ token, balance, rechargeVisible, setBalance, setRechargeVisible }) => {
  const isLogin = useMemo(() => !!token, [token])
  const [rechargeOptions, setRechargeOptions] = useState<RechargeOption[]>([])

  const handleRefreshBalance = async () => {
    const balanceRes = await fetch(`${CHATBOT_BASE_URL}/user/Balance`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        ...(token && {Auth: token}),
        },
      })
    const { Code, Data } = await balanceRes.json()
    if (Code === 200) {
      setBalance(Data)
    }
  }

  const hanldeChargeList = async () => {
    const chargeList = await fetch(`${CHATBOT_BASE_URL}/charge/items`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        Auth: token,
        },
    })
    const { Code, Data } = await chargeList.json()
    if (Code === 200) {
      setRechargeOptions(Data?.items)
    }
  }

  useEffect(() => {
    hanldeChargeList()
    handleRefreshBalance()
  }, [token])

  const total = useMemo(() => {
    const {totalCoin, totalCoinMore, totalCoinUse} = balance
    return totalCoin + totalCoinMore - totalCoinUse
  }, [balance]);

  return (
    <>
    {isLogin && (
      <div className="flex flex-col text-sm text-gray-500" style={{marginLeft:'-30%'}}>
        <div className="flex items-center">
          <span className="text-gray-200 text-sm font-medium">余额：</span>
          <span className="ml-1 text-sm text-lg font-bold text-gray-200">
            {total}
          </span>
          <IconRefresh
            className="w-5 h-5 text-gray-500 ml-2 cursor-pointer hover:text-gray-700"
            onClick={handleRefreshBalance}
          />
        </div>
        <div className="mt-1 text-sm text-gray-500">
          <div>累计充值：{balance.totalCoin}</div>
          <div>累计赠送：{balance.totalCoinMore}</div>
          <div>累计使用：{balance.totalCoinUse}</div>
        </div>
        <button
          onClick={() => setRechargeVisible(true)}
          disabled={!isLogin}
          className="mt-2 text-blue-500 text-sm font-medium"
        >
          <span {...(isLogin ? {} : {style: { textDecoration: 'line-through' }})}>{`充值${isLogin ? '' : '(登录后启用)'}`}</span>
        </button>
      </div>)}
      {/* 充值弹窗 */}
      <RechargeModal token={token} setBalance={setBalance} visible={rechargeVisible} options={rechargeOptions} onClose={() => setRechargeVisible(!rechargeVisible)} />
    </>
  );
};