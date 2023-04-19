import { IconKey } from '@tabler/icons-react';
import { Dispatch, FC, KeyboardEvent, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SidebarButton } from '../Sidebar/SidebarButton';
import Login from './Login';
import { login, register } from '@/utils/apis/user';
import { BalanceResponse } from '@/types/balance';
import { DEFAULT_BALANCE } from '@/pages';
import { message } from 'antd';

interface Props {
  token: string;
  setToken: Dispatch<SetStateAction<string>>;
  setBalance: Dispatch<SetStateAction<BalanceResponse>>;
  setShowSidebar: Dispatch<SetStateAction<boolean>>
}

export const LoginInport: FC<Props> = ({ token, setToken, setBalance, setShowSidebar }) => {

  const [isChanging, setIsChanging] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const isLogin = useMemo(() => !token, [token])

  const handleEnter = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      setIsChanging(false);
    }
  };

  const onLogout = useCallback(() => {
    sessionStorage.removeItem("TOKEN")
    setBalance(DEFAULT_BALANCE)
    setToken('')
    message.success("注销成功")
  }, [sessionStorage, DEFAULT_BALANCE])

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        window.addEventListener('mouseup', handleMouseUp);
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      window.removeEventListener('mouseup', handleMouseUp);
      setIsChanging(false);
    };

    window.addEventListener('mousedown', handleMouseDown);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  return (
    <>
      <SidebarButton
        text={isLogin ? '登录/注册' : '注销'}
        icon={<IconKey size={18} />}
        onClick={() => isLogin ? setIsChanging(true) : onLogout()}
      />

      {isChanging && (
        <div
          className="z-100 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onKeyDown={handleEnter}
        >
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div
                className="hidden sm:inline-block sm:h-screen sm:align-middle"
                aria-hidden="true"
              />

              <div
                ref={modalRef}
                className="dark:border-netural-400 inline-block max-h-[500px] transform overflow-hidden rounded-lg border border-gray-300 bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all dark:bg-[#202123] sm:my-8 sm:max-h-[600px] sm:w-full sm:max-w-lg sm:p-6 sm:align-middle"
                role="dialog"
              >
                <div className="mb-2 flex justify-center text-xl">登录</div>
                <Login setToken={setToken} onLogin={{login, register}} setIsChanging={setIsChanging} setBalance={setBalance} setShowSidebar={setShowSidebar} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
