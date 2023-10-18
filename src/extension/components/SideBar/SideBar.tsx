import {
  Button,
  Center,
  HStack,
  Skeleton,
  SkeletonCircle,
  Text,
  VStack,
} from '@chakra-ui/react';
import { generateAccount } from 'algosdk';
import React, {
  FC,
  ReactNode,
  TransitionEvent,
  useState,
  useEffect,
} from 'react';
import {
  IoAddCircleOutline,
  IoChevronBack,
  IoChevronForward,
  IoScanOutline,
  IoSettingsOutline,
} from 'react-icons/io5';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import {
  Location,
  NavigateFunction,
  useLocation,
  useNavigate,
} from 'react-router-dom';

// Components
import Divider from '@extension/components/Divider';
import IconButton from '@extension/components/IconButton';
import KibisisIcon from '@extension/components/KibisisIcon';
import SideBarAccountItem from './SideBarAccountItem';
import SideBarActionItem from './SideBarActionItem';

// Constants
import {
  ADD_ACCOUNT_ROUTE,
  ACCOUNTS_ROUTE,
  SETTINGS_ROUTE,
  SIDEBAR_BORDER_WIDTH,
  SIDEBAR_ITEM_HEIGHT,
  SIDEBAR_MAX_WIDTH,
  SIDEBAR_MIN_WIDTH,
} from '@extension/constants';

// Features
import { openWalletConnectModal } from '@extension/features/sessions';

// Hooks
import useBorderColor from '@extension/hooks/useBorderColor';
import useButtonHoverBackgroundColor from '@extension/hooks/useButtonHoverBackgroundColor';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColor from '@extension/hooks/usePrimaryColor';

// Selectors
import {
  useSelectAccounts,
  useSelectFetchingAccounts,
} from '@extension/selectors';

// Service
import { AccountService } from '@extension/services';

// Types
import { IAccount, IAppThunkDispatch } from '@extension/types';

// Utils
import { ellipseAddress } from '@extension/utils';

const SideBar: FC = () => {
  const { t } = useTranslation();
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  const location: Location = useLocation();
  const navigate: NavigateFunction = useNavigate();
  // hooks
  const borderColor: string = useBorderColor();
  const buttonHoverBackgroundColor: string = useButtonHoverBackgroundColor();
  const defaultTextColor: string = useDefaultTextColor();
  const primaryColor: string = usePrimaryColor();
  // selectors
  const accounts: IAccount[] = useSelectAccounts();
  const fetchingAccounts: boolean = useSelectFetchingAccounts();
  // state
  const [activeAccountAddress, setActiveAccountAddress] = useState<
    string | null
  >(null);
  const [width, setWidth] = useState<number>(SIDEBAR_MIN_WIDTH);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isHeaderShowing, setIsHeaderShowing] = useState<boolean>(false);
  // handlers
  const onCloseSideBar = () => {
    setIsHeaderShowing(false);
    setIsOpen(false);
  };
  const handleOpenToggleClick = () => {
    setIsHeaderShowing(false);
    setIsOpen(!isOpen);
  };
  const handleAccountClick = (address: string) => {
    onCloseSideBar();
    navigate(`${ACCOUNTS_ROUTE}/${address}`);
  };
  const handleAddAccountClick = () => {
    onCloseSideBar();
    navigate(ADD_ACCOUNT_ROUTE);
  };
  const handleConnectWalletClick = () => dispatch(openWalletConnectModal());
  const handleSettingsClick = () => {
    onCloseSideBar();
    navigate(SETTINGS_ROUTE);
  };
  const handleTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.propertyName === 'width' && width >= SIDEBAR_MAX_WIDTH) {
      setIsHeaderShowing(true);
    }
  };
  const renderAccounts: () => ReactNode = () => {
    if (fetchingAccounts) {
      return Array.from({ length: 3 }, (_, index) => (
        <Button
          _hover={{
            bg: buttonHoverBackgroundColor,
          }}
          borderRadius={0}
          fontSize="md"
          h={SIDEBAR_ITEM_HEIGHT}
          justifyContent="start"
          key={`sidebar-fetching-item-${index}`}
          p={0}
          variant="ghost"
          w="full"
        >
          <HStack m={0} p={0} spacing={0} w="full">
            <Center minW={`${SIDEBAR_MIN_WIDTH}px`}>
              <SkeletonCircle size="9" />
            </Center>
            <Skeleton>
              <Text color={defaultTextColor} flexGrow={1} fontSize="sm">
                {ellipseAddress(generateAccount().addr, {
                  end: 10,
                  start: 10,
                })}
              </Text>
            </Skeleton>
          </HStack>
        </Button>
      ));
    }

    return accounts.map((value, index) => (
      <SideBarAccountItem
        active={
          activeAccountAddress
            ? AccountService.convertPublicKeyToAlgorandAddress(
                value.publicKey
              ) === activeAccountAddress
            : false
        }
        account={value}
        key={`sidebar-item-${index}`}
        onClick={handleAccountClick}
      />
    ));
  };

  useEffect(() => {
    if (isOpen) {
      setWidth(SIDEBAR_MAX_WIDTH);

      return;
    }

    setWidth(SIDEBAR_MIN_WIDTH);
  }, [isOpen]);
  useEffect(() => {
    if (location.pathname.includes(ACCOUNTS_ROUTE)) {
      const pathnames: string[] = location.pathname
        .split('/')
        .filter((value) => value.length > 0);
      const addressIndex: number = pathnames.findIndex(
        (value) => value === 'accounts'
      );

      // if we have an address, get the address path, ie. /address/XXXX/...
      if (addressIndex >= 0) {
        setActiveAccountAddress(pathnames[addressIndex + 1] || null);

        return;
      }
    }

    setActiveAccountAddress(null);
  }, [location]);

  return (
    <VStack
      backgroundColor="var(--chakra-colors-chakra-body-bg)"
      borderRightColor={borderColor}
      borderRightStyle="solid"
      borderRightWidth={SIDEBAR_BORDER_WIDTH}
      h="100vh"
      left={0}
      onTransitionEnd={handleTransitionEnd}
      overflowX="hidden"
      position="absolute"
      spacing={0}
      top={0}
      transition="width 0.3s ease"
      w={`${width}px`}
      zIndex={10}
    >
      <HStack justifyContent="flex-end" w="full">
        {isHeaderShowing && (
          <HStack flexGrow={1} px={2} spacing={1} w="full">
            <KibisisIcon color={primaryColor} h={5} w={5} />
            <Text color={defaultTextColor} fontSize="sm">
              {__APP_TITLE__}
            </Text>
          </HStack>
        )}
        <IconButton
          aria-label="Open drawer"
          borderRadius={0}
          colorScheme="gray"
          icon={isOpen ? IoChevronBack : IoChevronForward}
          onClick={handleOpenToggleClick}
          variant="ghost"
        />
      </HStack>
      <Divider />
      <VStack flexGrow={1} overflowY="scroll" spacing={0} w="full">
        {renderAccounts()}
      </VStack>

      <Divider />
      {/*connect dapp*/}
      <SideBarActionItem
        icon={IoScanOutline}
        label={t<string>('labels.connectWallet')}
        onClick={handleConnectWalletClick}
      />

      {/*add account*/}
      <SideBarActionItem
        icon={IoAddCircleOutline}
        label={t<string>('labels.addAccount')}
        onClick={handleAddAccountClick}
      />

      {/*settings*/}
      <SideBarActionItem
        icon={IoSettingsOutline}
        label={t<string>('labels.settings')}
        onClick={handleSettingsClick}
      />
    </VStack>
  );
};

export default SideBar;
