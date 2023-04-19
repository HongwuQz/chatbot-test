import { SupportedExportFormats } from '@/types/export';
import { PluginKey } from '@/types/plugin';
import { IconFileExport, IconKey, IconMoon, IconSun } from '@tabler/icons-react';
import { useTranslation } from 'next-i18next';
import { Dispatch, FC, SetStateAction, useMemo } from 'react';
import { Import } from '../Settings/Import';
import { SidebarButton } from '../Sidebar/SidebarButton';
import { ClearConversations } from './ClearConversations';
import { LoginInport } from './LoginInport';
import { Balance } from './Balance';
import { BalanceResponse } from '@/types/balance';

interface Props {
  token: string;
  setToken: Dispatch<SetStateAction<string>>;
  lightMode: 'light' | 'dark';
  apiKey: string;
  serverSideApiKeyIsSet: boolean;
  pluginKeys: PluginKey[];
  serverSidePluginKeysSet: boolean;
  conversationsCount: number;
  onToggleLightMode: (mode: 'light' | 'dark') => void;
  onApiKeyChange: (apiKey: string) => void;
  onClearConversations: () => void;
  onExportConversations: () => void;
  onImportConversations: (data: SupportedExportFormats) => void;
  onPluginKeyChange: (pluginKey: PluginKey) => void;
  onClearPluginKey: (pluginKey: PluginKey) => void;
  balance: BalanceResponse;
  setBalance: Dispatch<SetStateAction<BalanceResponse>>;
  rechargeVisible: boolean;
  setRechargeVisible: Dispatch<SetStateAction<boolean>>;
  setShowSidebar: Dispatch<SetStateAction<boolean>>;
}

export const ChatbarSettings: FC<Props> = ({
  token,
  setToken,
  lightMode,
  conversationsCount,
  onToggleLightMode,
  onClearConversations,
  onExportConversations,
  onImportConversations,
  balance,
  setBalance,
  rechargeVisible,
  setRechargeVisible,
  setShowSidebar,
}) => {
  const { t } = useTranslation('sidebar');
  const isLogin = useMemo(() => !!token, [token])

  return (
    <div className="flex flex-col items-center space-y-1 border-t border-white/20 pt-1 text-sm">
      {conversationsCount > 0 ? (
        <ClearConversations onClearConversations={onClearConversations} />
      ) : null}

      <Import onImport={onImportConversations} />

      <SidebarButton
        text={t('Export data')}
        icon={<IconFileExport size={18} />}
        onClick={() => onExportConversations()}
      />

      <SidebarButton
        text={lightMode === 'light' ? t('Dark mode') : t('Light mode')}
        icon={
          lightMode === 'light' ? <IconMoon size={18} /> : <IconSun size={18} />
        }
        onClick={() =>
          onToggleLightMode(lightMode === 'light' ? 'dark' : 'light')
        }
      />

      <SidebarButton text={isLogin ? '用户信息': '游客信息'} icon={<IconKey size={18} />} onClick={() => {}} />
      <Balance token={token} balance={balance} setBalance={setBalance} rechargeVisible={rechargeVisible} setRechargeVisible={setRechargeVisible} />
      <LoginInport token={token} setToken={setToken} setBalance={setBalance} setShowSidebar={setShowSidebar} /> 
    </div>
  );
};
