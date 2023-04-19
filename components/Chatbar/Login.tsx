import React, { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import { SMSCaptcha } from './SMSCaptcha';
import { getCode } from '@/utils/apis/user';
import { LoginData } from '@/types/user';
import { BalanceResponse } from '@/types/balance';
import { getUserBalance } from '@/utils/apis/balance';

interface LoginProps {
  setToken: Dispatch<SetStateAction<string>>
  onLogin: {
      login: (form: LoginData) => Promise<any>;
      register: (form: LoginData) => Promise<any>;
  }
  setIsChanging: Dispatch<SetStateAction<boolean>>;
  setBalance: Dispatch<SetStateAction<BalanceResponse>>;
  setShowSidebar: Dispatch<SetStateAction<boolean>>;
}

const Login: React.FC<LoginProps> = ({ setToken, onLogin, setIsChanging, setBalance, setShowSidebar }) => {
  const [phone, setPhone] = useState('');
  const [pass, setPass] = useState('');
  const [code, setCode] = useState('')
  const [register, setRegister] = useState(false)

  const TInput = useMemo(() => register ? SMSCaptcha : Input, [register]) 

  const onFinish = () => {
   onLogin[register ? 'register' : 'login']({ phone, pass, ...(register && { code }) }).then(res => {
       if (res.Code === 200) {
        sessionStorage.setItem('TOKEN', res?.Data?.token)
        setToken(res?.Data?.token)
        getUserBalance(res?.Data?.token).then(res => {
            if (res.Code === 200) {
              setBalance(res.Data)
            }
        })
        message.success(register ? '注册成功' : '登录成功')
        setShowSidebar(true)
       } else {
           message.error(res.Msg)
       }
       setIsChanging(false)
   })
  }

  return (
    <Form onFinish={onFinish} onKeyDown={(event) => event.key === 'Enter' && onFinish()}>
        <Form.Item
            name="phone"
        >
            <div className='text-sm font-bold text-black dark:text-neutral-200'>
                手机号
            </div>
            <TInput
                className='mt-2 w-full rounded-lg border border-neutral-500 text-neutral-900 shadow focus:outline-none dark:border-neutral-800 dark:border-opacity-50 dark:bg-[#40414F] dark:text-neutral-100'
                type="text"
                size='large'
                value={phone}
                getCaptcha={getCode}
                onChange={(event) => setPhone(event.target.value)}
            />
            
        </Form.Item>
        {register && <Form.Item
            name="code"
        >
            <div className='text-sm font-bold text-black dark:text-neutral-200'>
                验证码
            </div>
            <Input
                className='mt-2 w-full rounded-lg border border-neutral-500 px-4 py-2 text-neutral-900 shadow focus:outline-none dark:border-neutral-800 dark:border-opacity-50 dark:bg-[#40414F] dark:text-neutral-100'
                type="text"
                value={code}
                onChange={(event) => setCode(event.target.value)}
            />
        </Form.Item>}
        <Form.Item
            name="pass"
        >
            <div className='text-sm font-bold text-black dark:text-neutral-200'>
                密码
            </div>
            <Input
                className='mt-2 w-full rounded-lg border border-neutral-500 px-4 py-2 text-neutral-900 shadow focus:outline-none dark:border-neutral-800 dark:border-opacity-50 dark:bg-[#40414F] dark:text-neutral-100'
                type="password"
                value={pass}
                onChange={(event) => setPass(event.target.value)}
            />
        </Form.Item>
        <Form.Item>
            <Button
                htmlType='submit'
                className="flex justify-center items-center mt-6 w-full rounded-lg border border-neutral-500 px-4 py-2 text-neutral-900 shadow hover:bg-neutral-100 focus:outline-none dark:border-neutral-800 dark:border-opacity-50 dark:bg-white dark:text-black dark:hover:bg-neutral-300"
            >
                {register ? '注册' : '登录'}
            </Button>
        </Form.Item>
        <Button
            htmlType='button'
            type='primary'
            onClick={() => setRegister(!register)}
            className="flex justify-center items-center mt-6 w-full rounded-lg borderpx-4 py-2 shadow focus:outline-none dark:border-neutral-800 dark:border-opacity-50 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500"
        >
            {register ? '使用帐号密码登录' : '使用手机验证码注册'}
        </Button>
    </Form>
  );
};

export default Login;