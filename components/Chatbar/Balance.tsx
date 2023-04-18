import { Dispatch, FC, SetStateAction, useCallback, useEffect, useMemo, useState } from "react";
import { IconRefresh } from "@tabler/icons-react";
import { getUserBalance, getChargeList } from "@/utils/apis/balance";
import { RechargeModal, RechargeOption } from "./RechargeModal";
import { BalanceResponse } from "@/types/balance";

interface Props {
  token: string
  balance: BalanceResponse
  setBalance: Dispatch<SetStateAction<BalanceResponse>>
}

export const Balance: FC<Props> = ({ token, balance, setBalance }) => {
  const isLogin = useMemo(() => !!token, [token])
  const authorization = useMemo(() => token && { Auth: token }, [token]);

  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState(false);
  const [money, setMoney] = useState("10"); // 默认选择第一个档位
  const [rechargeOptions, setRechargeOptions] = useState<RechargeOption[]>([])

  const handleRefreshBalance = useCallback(() => {
    getUserBalance(token).then(res => {
      if(res.Code === 200) {
        setBalance(res.Data)
      }
    })
  }, []);

  useEffect(() => {
    getChargeList(token).then(res => {
      if(res.Code === 200) {
        setRechargeOptions(res.Data.items)
      }
    })
  }, [token])

  const isMobile = () => {
    const userAgent =
      typeof window.navigator === 'undefined' ? '' : navigator.userAgent;
    const mobileRegex =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;
    return mobileRegex.test(userAgent);
  };

  const handleRecharge = async () => {
    setIsRechargeModalOpen(false);
    try {
      const response = await fetch(
        `http://39.107.45.104:7000/${isLogin ? "/" : ""}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...authorization,
          },
          body: JSON.stringify({ money }),
        }
      );
      const data = await response.json();
      setBalance(data.Data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleRefreshBalance();
  }, []);

  const total = useMemo(() => {
    const {totalCoin, totalCoinMore, totalCoinUse} = balance
    return totalCoin + totalCoinMore - totalCoinUse
  }, [balance]);

  return (
    <>
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
          onClick={() => setIsRechargeModalOpen(true)}
          disabled={!isLogin}
          className="mt-2 text-blue-500 text-sm font-medium"
        >
          <span {...(isLogin ? {} : {style: { textDecoration: 'line-through' }})}>{`充值${isLogin ? '' : '(登录后启用)'}`}</span>
        </button>
      </div>
      {/* 充值弹窗 */}
      <RechargeModal visible={isRechargeModalOpen} options={rechargeOptions} onClose={() => setIsRechargeModalOpen(!isRechargeModalOpen)} />
    </>
  );
};