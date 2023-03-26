import { Button } from '@mui/material';
import useModal from 'hooks/useModal';
import { AiCoach } from './AiCoach';

export function AiButton() {
  const [opened, open, close] = useModal();
  return (
    <>
      <Button onClick={open} variant="contained" color="secondary">
        AI Coach
      </Button>
      {opened ? <AiCoach onClose={close} /> : null}
    </>
  );
}
