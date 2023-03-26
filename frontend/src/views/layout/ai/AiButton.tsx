import { Psychology } from '@mui/icons-material';
import { Button, IconButton, useMediaQuery } from '@mui/material';
import useModal from 'hooks/useModal';
import { useTranslation } from 'react-i18next';
import { AiCoach } from './AiCoach';

export function AiButton() {
  const [opened, open, close] = useModal();
  const { t } = useTranslation();
  const small = useMediaQuery('(max-width:600px)');
  return (
    <>
      {small ? (
        <IconButton onClick={open} color="secondary">
          <Psychology />
        </IconButton>
      ) : (
        <Button
          onClick={open}
          variant="contained"
          color="secondary"
          startIcon={<Psychology />}
          style={{ marginRight: 20 }}
        >
          {t('Ai.title')}
        </Button>
      )}
      <AiCoach onClose={close} open={opened} />
    </>
  );
}
