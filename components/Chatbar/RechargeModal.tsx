import React from "react";
import { Modal, Card, Button } from "antd";

export interface RechargeOption {
  money: number;
  coin: number;
  coinMore: number;
  avgText: string;
}

interface RechargeOptionsProps {
  visible: boolean;
  onClose: () => void;
  options: RechargeOption[];
}

export const RechargeModal: React.FC<RechargeOptionsProps> = ({
  visible,
  onClose,
  options,
}) => {
  return (
    <Modal
      title="请选择充值金额"
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
    >
      <div className="flex space-x-3 space-y-3 flex-wrap">
        {options.map((option, index) => (
          <>
            <div key={index} className="">
              <div>
                <span className="text-2xl">{option.coin}
                  {option.coinMore !== 0 && <span className="text-gray-400 text-sm">+{option.coinMore}</span>}
                  凤凰币
                </span>
              </div>
              <span>{`售价：¥${option.money} 平均${option.avgText}凤凰币/元`}</span>
            </div>
          </>
        ))}
        <Button>确认支付</Button>
      </div>
    </Modal>
  );
};