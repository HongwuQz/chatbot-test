import { Input, Tooltip } from 'antd';
import React, { useState } from 'react';

interface NumericInputProps {
  style: React.CSSProperties;
  value?: string;
  prefix: string;
  className: string;
  onChange: (value: string) => void;
}

const formatNumber = (value: number) => new Intl.NumberFormat().format(value);

export const NumberInput = (props: NumericInputProps) => {
  const { value, onChange, prefix, className } = props;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = e.target;
    const reg = /^\d*?$/;
    if (reg.test(inputValue) || inputValue === '') {
      onChange(inputValue);
    }
  };

  const title = value ? (
    <span className="numeric-input-title">{`充值金额：¥ ${formatNumber(Number(value))}`}</span>
  ) : (
    '请输入正整数'
  );

  return (
    <Tooltip trigger={['focus']} title={title} placement="topRight" overlayClassName="numeric-input">
      <Input
        {...props}
        onChange={handleChange}
        className={className}
        prefix={prefix}
        maxLength={16}
      />
    </Tooltip>
  );
};