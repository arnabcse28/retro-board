import { useState, useCallback } from 'react';
import Button from '@mui/material/Button';
import SessionEditor from '../../../session-editor/SessionEditor';
import { AllSessionSettings, SessionSettings, User } from 'common';
import { trackEvent } from '../../../../track';
import { Settings } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { IconButton, useMediaQuery } from '@mui/material';

interface ModifyOptionsProps {
  settings: AllSessionSettings;
  owner: User;
  onChange: (settings: SessionSettings, saveAsTemplate: boolean) => void;
}

function ModifyOptions({ settings, owner, onChange }: ModifyOptionsProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const small = useMediaQuery('(max-width: 500px)');

  const handleChange = useCallback(
    (modifiedSettings: AllSessionSettings, saveAsTemplate: boolean) => {
      setOpen(false);
      if (!settings) {
        return;
      }
      trackEvent('game/session/save-options');
      onChange(
        {
          columns: modifiedSettings.columns,
          moderator: modifiedSettings.moderator,
          timer: modifiedSettings.timer,
          options: modifiedSettings.options,
        },
        saveAsTemplate
      );
    },
    [onChange, settings]
  );

  if (!settings) {
    return null;
  }

  return (
    <>
      {small ? (
        <IconButton onClick={() => setOpen(true)} color="primary">
          <Settings />
        </IconButton>
      ) : (
        <Button
          variant="outlined"
          color="primary"
          startIcon={<Settings />}
          onClick={() => setOpen(true)}
        >
          {t('Join.standardTab.customizeButton')}
        </Button>
      )}
      {open ? (
        <SessionEditor
          open={open}
          owner={owner}
          settings={settings}
          onClose={() => setOpen(false)}
          onChange={handleChange}
        />
      ) : null}
    </>
  );
}

export default ModifyOptions;
