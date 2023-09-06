import { useState, useCallback } from 'react';
import Button from '@mui/material/Button';
import SessionEditor from '../../../session-editor/SessionEditor';
import { AllSessionSettings, SessionSettings } from 'common';
import { trackEvent } from '../../../../track';
import { Settings } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { IconButton, useMediaQuery } from '@mui/material';

interface ModifyOptionsProps {
  session: AllSessionSettings;
  onChange: (session: SessionSettings, saveAsTemplate: boolean) => void;
}

function ModifyOptions({ session, onChange }: ModifyOptionsProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const small = useMediaQuery('(max-width: 500px)');

  const handleChange = useCallback(
    (modifiedSession: AllSessionSettings, saveAsTemplate: boolean) => {
      setOpen(false);
      if (!session) {
        return;
      }
      trackEvent('game/session/save-options');
      onChange(
        {
          columns: modifiedSession.columns,
          moderator: modifiedSession.moderator,
          timer: modifiedSession.timer,
          options: modifiedSession.options,
        },
        saveAsTemplate
      );
    },
    [onChange, session]
  );

  if (!session) {
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
          session={session}
          onClose={() => setOpen(false)}
          onChange={handleChange}
        />
      ) : null}
    </>
  );
}

export default ModifyOptions;
