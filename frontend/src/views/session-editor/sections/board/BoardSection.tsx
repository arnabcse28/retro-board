import { useCallback, useEffect, useState } from 'react';
import SettingCategory from '../SettingCategory';
import { useTranslation } from 'react-i18next';
import { AllSessionSettings, User } from 'common';
import { OptionItem } from '../OptionItem';
import BooleanOption from '../BooleanOption';
import { fetchUsers } from './api';
import { UserSelector } from './UserSelector';
import CustomAvatar from 'components/Avatar';
import styled from '@emotion/styled';

interface BoardSectionProps {
  owner: User;
  options: AllSessionSettings;
  onChange: (options: AllSessionSettings) => void;
}

function BoardSection({ options, owner, onChange }: BoardSectionProps) {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    async function load() {
      const users = await fetchUsers();
      setUsers(users);
    }
    load();
  }, []);

  const setRestrictTitleEditToOwner = useCallback(
    (value: boolean) => {
      onChange({
        ...options,
        options: {
          ...options.options,
          restrictTitleEditToModerator: value,
        },
      });
    },
    [onChange, options]
  );

  const setModerator = useCallback(
    (user: User) => {
      onChange({
        ...options,
        moderator: user,
      });
    },
    [onChange, options]
  );

  return (
    <SettingCategory
      title={t('Customize.boardCategory')!}
      subtitle={t('Customize.boardCategorySub')!}
    >
      <OptionItem
        label={t('Customize.owner')!}
        help={t('Customize.ownerHelp')!}
      >
        <Line>
          <span>{owner.name}</span>
          <CustomAvatar user={owner} style={{ height: 30, width: 30 }} />
        </Line>
      </OptionItem>
      <OptionItem
        label={t('Customize.changeModerator')!}
        help={t('Customize.changeModeratorHelp')!}
        wide
      >
        <UserSelector
          onSelect={setModerator}
          options={users}
          moderatorId={options.moderator.id}
        />
      </OptionItem>
      <OptionItem
        label={t('Customize.restrictTitleEditToOwner')!}
        help={t('Customize.restrictTitleEditToOwnerHelp')!}
      >
        <BooleanOption
          value={options.options.restrictTitleEditToModerator}
          onChange={setRestrictTitleEditToOwner}
        />
      </OptionItem>
    </SettingCategory>
  );
}

const Line = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export default BoardSection;
