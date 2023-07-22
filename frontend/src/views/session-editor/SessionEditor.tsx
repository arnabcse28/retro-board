import { useState, useEffect, useCallback, useMemo } from 'react';
import { Session, SessionOptions } from 'common';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import useMediaQuery from '@mui/material/useMediaQuery';
import DialogActions from '@mui/material/DialogActions';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useTranslation } from 'react-i18next';
import useToggle from '../../hooks/useToggle';
import { ColumnSettings } from '../../state/types';
import TemplateSection from './sections/template/TemplateSection';
import PostsSection from './sections/posts/PostsSection';
import VotingSection from './sections/votes/VotingSection';
import { extrapolate, toColumnDefinitions } from '../../state/columns';
import TimerSection from './sections/timer/TimerSection';
import BoardSection from './sections/board/BoardSection';

interface SessionEditorProps {
  open: boolean;
  session: Session;
  onChange: (session: Session, makeDefault: boolean) => void;
  onClose: () => void;
}

function SessionEditor({
  open,
  session: originalSession,
  onChange,
  onClose,
}: SessionEditorProps) {
  const { t } = useTranslation();
  const fullScreen = useMediaQuery('(max-width:600px)');
  const [isDefaultTemplate, toggleIsDefaultTemplate] = useToggle(false);
  const [session, setSession] = useState(originalSession);
  // const [definitions, setDefinitions] = useState<ColumnSettings[]>(columns);
  // const [options, setOptions] = useState(incomingOptions);
  const [currentTab, setCurrentTab] = useState('template');

  // useEffect(() => {
  //   const extrapolatedColumns = session.columns.map((c) => extrapolate(c, t));
  //   setDefinitions(extrapolatedColumns);
  // }, [session.columns, t]);

  const extrapolatedColumns = useMemo(() => {
    const extrapolatedColumns = session.columns.map((c) => extrapolate(c, t));
    return extrapolatedColumns;
  }, [session.columns, t]);

  useEffect(() => {
    setSession(originalSession);
  }, [originalSession]);

  const handleCreate = useCallback(() => {
    onChange(session, isDefaultTemplate);
  }, [onChange, isDefaultTemplate, session]);

  const handleTab = useCallback((_: React.ChangeEvent<{}>, value: string) => {
    setCurrentTab(value);
  }, []);

  const handleOptionsChange = useCallback((options: SessionOptions) => {
    setSession((prev) => ({ ...prev, options }));
  }, []);

  const handleColumnsChanged = useCallback((columns: ColumnSettings[]) => {
    setSession((prev) => ({ ...prev, columns: toColumnDefinitions(columns) }));
  }, []);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      fullScreen={fullScreen}
      keepMounted={false}
      maxWidth="md"
    >
      <AppBar position="static" color="default">
        <Tabs
          value={currentTab}
          onChange={handleTab}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          aria-label="scrollable auto tabs example"
        >
          <Tab label={t('Customize.template')} value="template" />
          <Tab label={t('Customize.boardCategory')} value="board" />
          <Tab label={t('Customize.postCategory')} value="posts" />
          <Tab label={t('Customize.votingCategory')} value="voting" />
          <Tab label={t('Customize.timerCategory')} value="timer" />
        </Tabs>
      </AppBar>
      <DialogContent>
        {currentTab === 'template' ? (
          <TemplateSection
            columns={extrapolatedColumns}
            onChange={handleColumnsChanged}
          />
        ) : null}
        {currentTab === 'board' ? (
          <BoardSection
            options={session.options}
            onChange={handleOptionsChange}
          />
        ) : null}
        {currentTab === 'posts' ? (
          <PostsSection
            options={session.options}
            onChange={handleOptionsChange}
          />
        ) : null}
        {currentTab === 'voting' ? (
          <VotingSection
            options={session.options}
            onChange={handleOptionsChange}
          />
        ) : null}
        {currentTab === 'timer' ? (
          <TimerSection
            options={session.options}
            onChange={handleOptionsChange}
          />
        ) : null}
      </DialogContent>
      <DialogActions>
        <FormControlLabel
          control={
            <Checkbox
              checked={isDefaultTemplate}
              onChange={toggleIsDefaultTemplate}
            />
          }
          label={t('Customize.makeDefaultTemplate')!}
        />
        <Button onClick={onClose} variant="text">
          {t('Generic.cancel')}
        </Button>
        <Button onClick={handleCreate} color="primary" variant="contained">
          {t('Customize.editButton')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SessionEditor;
