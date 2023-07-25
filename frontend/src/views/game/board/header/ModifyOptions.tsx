import { useState, useCallback } from 'react';
import Button from '@mui/material/Button';
import SessionEditor from '../../../session-editor/SessionEditor';
import { Session } from 'common';
import { trackEvent } from '../../../../track';
import { Settings } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { IconButton, useMediaQuery } from '@mui/material';

interface ModifyOptionsProps {
  session: Session;
  onChange: (session: Session, saveAsTemplate: boolean) => void;
}

function ModifyOptions({ session, onChange }: ModifyOptionsProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const small = useMediaQuery('(max-width: 500px)');

  const handleChange = useCallback(
    (modifiedSession: Session, saveAsTemplate: boolean) => {
      setOpen(false);
      if (!session) {
        return;
      }
      trackEvent('game/session/save-options');
      onChange(modifiedSession, saveAsTemplate);
      // const { options, columns } = session;
      // if (options !== modifiedSession.options) {
      //   onEditOptions(modifiedSession.options);
      //   trackEvent('game/session/edit-options');
      // }
      // if (columns !== modifiedSession.columns) {
      //   onEditColumns(toColumnDefinitions(modifiedSession.columns));
      //   trackEvent('game/session/edit-columns');
      // }
      // if (saveAsTemplate) {
      //   onSaveTemplate(modifiedSession.options, modifiedSession.columns);
      //   trackEvent('custom-modal/template/set-defaut');
      // }
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
