import { useCallback, useEffect, useState } from 'react';
import SettingCategory from '../SettingCategory';
import { useTranslation } from 'react-i18next';
import { AllSessionSettings, User } from 'common';
import { OptionItem } from '../OptionItem';
import BooleanOption from '../BooleanOption';
import { fetchUsers } from './api';
import { UserSelector } from './UserSelector';

interface BoardSectionProps {
  options: AllSessionSettings;
  onChange: (options: AllSessionSettings) => void;
}

function BoardSection({ options, onChange }: BoardSectionProps) {
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
          restrictTitleEditToOwner: value,
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
        label={t('Customize.restrictTitleEditToOwner')!}
        help={t('Customize.restrictTitleEditToOwnerHelp')!}
      >
        <BooleanOption
          value={options.options.restrictTitleEditToOwner}
          onChange={setRestrictTitleEditToOwner}
        />
      </OptionItem>
      <OptionItem
        label={t('Customize.changeModerator')!}
        help={t('Customize.changeModeratorHelp')!}
      >
        <UserSelector
          onSelect={setModerator}
          options={users}
          moderatorId={options.moderator.id}
        />
      </OptionItem>
    </SettingCategory>
  );
}

export default BoardSection;
