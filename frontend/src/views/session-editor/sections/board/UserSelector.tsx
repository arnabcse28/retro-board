import { MenuItem, Select } from '@mui/material';
import { User } from 'common';
import { useMemo } from 'react';

type UserSelectorProps = {
  moderatorId: string;
  options: User[];
  onSelect: (user: User) => void;
};

export function UserSelector({
  moderatorId,
  options,
  onSelect,
}: UserSelectorProps) {
  const selected: User | null = useMemo(() => {
    return options.find((u) => u.id === moderatorId) || null;
  }, [options, moderatorId]);
  return (
    <Select
      value={selected}
      label="Moderators"
      onChange={(e) => onSelect(e.target.value as User)}
    >
      {options.map((option) => (
        <MenuItem key={option.id} value={option.id}>
          {option.name}
        </MenuItem>
      ))}
    </Select>
  );
}
