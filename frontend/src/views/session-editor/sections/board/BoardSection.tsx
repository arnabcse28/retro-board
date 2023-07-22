import { useCallback } from 'react';
import SettingCategory from '../SettingCategory';
import { useTranslation } from 'react-i18next';
import { SessionOptions } from 'common';
import { OptionItem } from '../OptionItem';
import BooleanOption from '../BooleanOption';

interface BoardSectionProps {
  options: SessionOptions;
  onChange: (options: SessionOptions) => void;
}

function BoardSection({ options, onChange }: BoardSectionProps) {
  const { t } = useTranslation();

  const setRestrictTitleEditToOwner = useCallback(
    (value: boolean) => {
      onChange({
        ...options,
        restrictTitleEditToOwner: value,
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
          value={options.restrictTitleEditToOwner}
          onChange={setRestrictTitleEditToOwner}
        />
      </OptionItem>
    </SettingCategory>
  );
}

export default BoardSection;
