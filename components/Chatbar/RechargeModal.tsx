import React, { Dispatch, SetStateAction, useCallback, useMemo, useState } from "react";
import { Modal, Button, Badge, Radio } from "antd";
import { NumberInput } from "./NumberInput";
import { BalanceResponse } from "@/types/balance";
import { CHATBOT_BASE_URL } from "@/utils/app/const";
import { getUserBalance } from "@/utils/apis/balance";
import QRCode from 'qrcode.react';

export interface RechargeOption {
  money: number;
  coin: number;
  coinMore: number;
  avgText: string;
}

interface RechargeOptionsProps {
  visible: boolean;
  token: string
  options: RechargeOption[];
  onClose: () => void;
  setBalance: Dispatch<SetStateAction<BalanceResponse>>
}

export const RechargeModal: React.FC<RechargeOptionsProps> = ({
  visible,
  token,
  onClose,
  options,
  setBalance
}) => {
  const [customMoney, setCustomMoney] = useState<string>()

  const onCustomMoneyInput = useCallback((money: string) => {
    setCustomMoney(money)
  }, [])

  const isMobile = useCallback(() => {
    const userAgent =
      typeof window.navigator === 'undefined' ? '' : navigator.userAgent;
    const mobileRegex =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;
    return mobileRegex.test(userAgent);
  }, [window.navigator, navigator]);

  const mobileUser = useMemo(() => isMobile(), [isMobile])

  const handleRecharge = useCallback(async (money: string) => {
    const response = await fetch(token && `${CHATBOT_BASE_URL}/charge/Balance`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Auth: token }),
          },
          body: JSON.stringify({ money: Number(money), chargeDevice: mobileUser ? "1" : "2" })
        }
      );
    const { Code, Data } = await response.json();
    if (Code === 200) {
      const alipayRes = JSON.parse(Data);
      const payUrl = alipayRes.alipay_trade_precreate_response.qr_code;
      
      if (mobileUser) {
        // 移动设备直接唤醒支付宝进行付款
        window.location.href = payUrl;
      } else {
        Modal.confirm({
          content: (
            <div className="text-center">
              <QRCode value={payUrl} size={200} />
              <p>请使用支付宝扫描二维码完成付款</p>
            </div>
          ),
          icon: null,
          centered: true, // 将弹窗居中显示
          closable: true, // 显示关闭按钮
          okButtonProps: { style: { display: "none" } },
          cancelButtonProps: { style: { display: "none" } },
          width: 270,
        });
      }
      getUserBalance(token).then(balanceRes => {
        if (balanceRes.Code === 200) {
          setBalance(balanceRes.Data)
        }
      })
    }
  }, [token, isMobile]);
  
  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
    >
        <div className="flex mx-3 my-3 flex-wrap justify-between">
          {options.map(({ coinMore, coin, money, avgText }, index) => (
            <Badge.Ribbon key={index} placement="start" color="#ee7737" text={`${avgText}币/元`}>
              <div className="item flex flex-col items-center mb-[15px] bg-[#f6f6f6] pt-[25px] my-[5px] shadow-[0_0_10px_rgba(0,0,0,0.10)] w-[130px]">
                <span className="text-xl text-[#ee7737] flex justify-center">¥ {money}</span>
                <span className="text-gray-500 flex justify-center">{`${coin}凤凰币`}</span>
                <Button onClick={() => handleRecharge(String(money))} className="flex justify-center w-[110px] h-[30px]">{coinMore === 0 ? '充值' : `充值送${coinMore}`}</Button>
              </div>
            </Badge.Ribbon>
          ))}
          <Badge.Ribbon placement="start" color="#888" text="10币/元">
            <div className="item flex flex-col items-center bg-[#f6f6f6] pt-[25px] my-[5px] shadow-[0_0_10px_rgba(0,0,0,0.10)] w-[130px]">
              <div className="flex">
                <NumberInput prefix="¥" value={customMoney} onChange={onCustomMoneyInput} className="text-xl text-[#ee7737] flex justify-center h-[28px] w-[80px]" />
              </div>
              <span className="text-gray-500 flex flex-grow justify-center">自定义金额</span>
              <Button onClick={() => handleRecharge(String(customMoney))} className="flex justify-center w-[110px] h-[30px]">充值</Button>
            </div>
          </Badge.Ribbon>
        </div>
    </Modal>
  );
};