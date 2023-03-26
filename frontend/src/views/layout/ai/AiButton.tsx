import { Psychology } from '@mui/icons-material';
import { Button } from '@mui/material';
import useModal from 'hooks/useModal';
import { useTranslation } from 'react-i18next';
import { AiCoach } from './AiCoach';

export function AiButton() {
  const [opened, open, close] = useModal();
  const { t } = useTranslation();
  return (
    <>
      <Button
        onClick={open}
        variant="contained"
        color="secondary"
        startIcon={<Psychology />}
        style={{ marginRight: 20 }}
      >
        {t('Ai.title')}
      </Button>
      <AiCoach onClose={close} open={opened} />
    </>
  );
}
