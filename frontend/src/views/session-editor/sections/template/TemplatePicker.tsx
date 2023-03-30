import { useCallback, useState } from 'react';
import { Template } from '../../../../state/types';
import { getAllTemplates } from '../../../../state/templates';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { TemplateItem } from './TemplateItem';

interface TemplatePickerProps {
  onSelect: (value: Template) => void;
}

export function TemplatePicker({ onSelect }: TemplatePickerProps) {
  const { t } = useTranslation();
  const [template, setTemplate] = useState<Template>('default');
  const templates = getAllTemplates(t);

  const handleSelect = useCallback(
    (selected: Template) => {
      setTemplate(selected);
      onSelect(selected);
    },
    [onSelect]
  );
  return (
    <Container>
      {templates.map((t) => (
        <TemplateItem
          key={t.type}
          definition={t}
          selected={t.type === template}
          onSelect={handleSelect}
        />
      ))}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 10px 0;
`;
