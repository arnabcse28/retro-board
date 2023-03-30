import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { getTemplateColumns } from 'state';
import { Template, TemplateDefinition } from 'state/types';
import Icon from 'components/Icon/Icon';

type TemplateItemProps = {
  definition: TemplateDefinition;
  selected: boolean;
  onSelect: (template: Template) => void;
};

export function TemplateItem({
  definition,
  selected,
  onSelect,
}: TemplateItemProps) {
  const { t } = useTranslation();
  const columns = getTemplateColumns(definition.type, t);
  return (
    <Item
      selected={selected}
      onClick={() => {
        onSelect(definition.type);
      }}
    >
      <ItemIcon>
        {columns.map((col) => (
          <Icon icon={col.icon} />
        ))}
      </ItemIcon>
      <ItemTitle>{definition.name}</ItemTitle>
    </Item>
  );
}

const Item = styled.div<{ selected: boolean }>`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
  background-color: ${(p) => (p.selected ? '#0D47A1' : '#e3f2fd')};
  color: ${(p) => (p.selected ? '#e3f2fd' : '#0d47a1')};
`;

const ItemIcon = styled.div`
  display: flex;
  gap: 4px;
`;

const ItemTitle = styled.div`
  margin-top: 10px;
  font-size: 0.8rem;
`;
