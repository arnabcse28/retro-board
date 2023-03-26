import { Psychology } from '@mui/icons-material';
import { Button } from '@mui/material';
import useModal from 'hooks/useModal';
import { AiCoach } from './AiCoach';

export function AiButton() {
  const [opened, open, close] = useModal();
  return (
    <>
      <Button
        onClick={open}
        variant="contained"
        color="secondary"
        startIcon={<Psychology />}
        style={{ marginRight: 20 }}
      >
        AI Coach
      </Button>
      <AiCoach onClose={close} open={opened} />
    </>
  );
}
