import { useState, useEffect, useCallback, useMemo } from 'react';
import { AllSessionSettings, SessionOptions, User } from 'common';
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
  owner: User;
  settings: AllSessionSettings;
  onChange: (settings: AllSessionSettings, makeDefault: boolean) => void;
  onClose: () => void;
}

function SessionEditor({
  open,
  owner,
  settings: originalSettings,
  onChange,
  onClose,
}: SessionEditorProps) {
  const { t } = useTranslation();
  const fullScreen = useMediaQuery('(max-width:600px)');
  const [isDefaultTemplate, toggleIsDefaultTemplate] = useToggle(false);
  const [settings, setSettings] = useState(originalSettings);
  const [currentTab, setCurrentTab] = useState('template');

  const extrapolatedColumns = useMemo(() => {
    const extrapolatedColumns = settings.columns.map((c) => extrapolate(c, t));
    return extrapolatedColumns;
  }, [settings.columns, t]);

  useEffect(() => {
    setSettings(originalSettings);
  }, [originalSettings]);

  const handleCreate = useCallback(() => {
    onChange(settings, isDefaultTemplate);
  }, [onChange, isDefaultTemplate, settings]);

  const handleTab = useCallback((_: React.ChangeEvent<{}>, value: string) => {
    setCurrentTab(value);
  }, []);

  const handleOptionsChange = useCallback((options: SessionOptions) => {
    setSettings((prev) => ({ ...prev, options }));
  }, []);

  const handleSettingsChange = useCallback((options: AllSessionSettings) => {
    setSettings(options);
  }, []);

  const handleColumnsChanged = useCallback((columns: ColumnSettings[]) => {
    setSettings((prev) => ({ ...prev, columns: toColumnDefinitions(columns) }));
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
            owner={owner}
            options={settings}
            onChange={handleSettingsChange}
          />
        ) : null}
        {currentTab === 'posts' ? (
          <PostsSection
            options={settings.options}
            onChange={handleOptionsChange}
          />
        ) : null}
        {currentTab === 'voting' ? (
          <VotingSection
            options={settings.options}
            onChange={handleOptionsChange}
          />
        ) : null}
        {currentTab === 'timer' ? (
          <TimerSection
            options={settings.options}
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
