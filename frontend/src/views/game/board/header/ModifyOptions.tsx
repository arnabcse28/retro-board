import { useState, useCallback } from 'react';
import Button from '@mui/material/Button';
import SessionEditor from '../../../session-editor/SessionEditor';
import { SessionOptions, ColumnDefinition, Session } from 'common';
import { toColumnDefinitions } from '../../../../state/columns';
import { trackEvent } from '../../../../track';
import { Settings } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import useSession from '../../useSession';
import { IconButton, useMediaQuery } from '@mui/material';

interface ModifyOptionsProps {
  onEditOptions: (options: SessionOptions) => void;
  onEditColumns: (columns: ColumnDefinition[]) => void;
  onSaveTemplate: (
    options: SessionOptions,
    columns: ColumnDefinition[]
  ) => void;
}

function ModifyOptions({
  onEditOptions,
  onEditColumns,
  onSaveTemplate,
}: ModifyOptionsProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { session } = useSession();
  const small = useMediaQuery('(max-width: 500px)');

  const handleChange = useCallback(
    (modifiedSession: Session, saveAsTemplate: boolean) => {
      setOpen(false);
      if (!session) {
        return;
      }
      const { options, columns } = session;
      if (options !== modifiedSession.options) {
        onEditOptions(modifiedSession.options);
        trackEvent('game/session/edit-options');
      }
      if (columns !== modifiedSession.columns) {
        onEditColumns(toColumnDefinitions(modifiedSession.columns));
        trackEvent('game/session/edit-columns');
      }
      if (saveAsTemplate) {
        onSaveTemplate(modifiedSession.options, modifiedSession.columns);
        trackEvent('custom-modal/template/set-defaut');
      }
    },
    [onEditOptions, onEditColumns, onSaveTemplate, session]
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
