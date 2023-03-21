import { useCallback, useState, useContext } from 'react';
import DialogContent from '@mui/material/DialogContent';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useTranslation } from 'react-i18next';
import UserContext from '../Context';
import SocialAuth from './SocialAuth';
import AnonAuth from './AnonAuth';
import AccountAuth from './AccountAuth';
import useOAuthAvailabilities from '../../global/useOAuthAvailabilities';
import useBackendCapabilities from '../../global/useBackendCapabilities';
import { Alert } from '@mui/material';
import styled from '@emotion/styled';

interface LoginContentProps {
  allowAnonymous?: boolean;
  onClose: () => void;
}

type TabType = 'account' | 'social' | 'anon' | null;

export default function LoginContent({
  onClose,
  allowAnonymous = true,
}: LoginContentProps) {
  const { any } = useOAuthAvailabilities();
  const { disableAnonymous, disablePasswords } = useBackendCapabilities();
  const hasNoSocialMediaAuth = !any;
  const hasNoWayOfLoggingIn =
    hasNoSocialMediaAuth && disableAnonymous && disablePasswords;
  const { t } = useTranslation();
  const { setUser } = useContext(UserContext);

  return (
    <>
      {hasNoWayOfLoggingIn ? (
        <Alert severity="error">
          Your administrator disabled all login possibilities (OAuth, password,
          anonymous). Ask your administrator to re-enable at least one.
        </Alert>
      ) : (
        <>
          <DialogContent>
            <Container>
              {!hasNoSocialMediaAuth ? (
                <SocialAuth onClose={onClose} onUser={setUser} />
              ) : null}
              <Separator />
              {!disablePasswords ? (
                <AccountAuth onClose={onClose} onUser={setUser} />
              ) : null}
            </Container>
          </DialogContent>
        </>
      )}
    </>
  );
}

const Separator = styled.div`
  height: 200px;
  margin: 0 20px;
  border-left: 1px solid #ccc;
  background-color: #ccc;
  flex: 0;
  align-self: center;

  @media screen and (max-width: 1000px) {
    width: 80%;
    height: 1px;
    margin: 10px 0;
    border-top: 1px solid #ccc;
  }
`;

const Container = styled.div`
  display: flex;
  gap: 20px;
  > * {
    flex: 1;
  }

  @media screen and (max-width: 1000px) {
    flex-direction: column;
  }
`;

function getDefaultMode(
  oauth: boolean,
  password: boolean,
  anon: boolean
): TabType {
  if (oauth) {
    return 'social';
  }

  if (password) {
    return 'account';
  }

  if (anon) {
    return 'anon';
  }

  return null;
}
