import React, { useState } from 'react';
import { InputProps, ButtonProps, Input, Button, message } from 'antd';

interface SMSCaptchaProps extends InputProps {
  getCaptcha: (phoneNumber: string) => Promise<void>;
}

export const SMSCaptcha: React.FC<SMSCaptchaProps> = ({ getCaptcha, ...rest }) => {
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [second, setSecond] = useState(60);

  const onClickGetCaptcha = async () => {
    const phoneNumber = rest.value as string;
  
    // 判断手机号是否合法
    if (!/^1\d{10}$/.test(phoneNumber)) {
      message.error("请输入正确的手机号");
      return;
    }
    //调用获取验证码的接口
    getCaptcha(rest.value as string).then(_ => {
      message.success("获取验证码成功")
      setButtonDisabled(true);
      const timer = setInterval(() => {
        setSecond((value) => {
          if (value === 1) {
            clearInterval(timer);
            setButtonDisabled(false);
            return 60;
          }
          return value - 1;
        });
      }, 1000)
    }, rej => console.log(rej))
  };

  const buttonProps: ButtonProps = {
    disabled: buttonDisabled,
    onClick: onClickGetCaptcha,
    children: buttonDisabled ? `${second}s` : '获取验证码',
  };

  return (
    <Input.Search
      placeholder="请输入手机号"
      enterButton={<Button {...buttonProps}></Button>}
      {...rest}
    />
  );
};