import styled from '@emotion/styled';
import { Autocomplete, TextField, colors } from '@mui/material';
import { User } from 'common';
import CustomAvatar from 'components/Avatar';
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
    <SelectorContainer>
      <Autocomplete
        size="small"
        disablePortal
        options={options}
        value={selected}
        disableClearable={options.length > 0}
        onChange={(_, value) => onSelect(value as User)}
        fullWidth
        renderInput={(params) => (
          <TextField {...params} value={selected?.name} />
        )}
        renderOption={(props, option) => (
          <span {...props}>
            <UserItem user={option} />
          </span>
        )}
        getOptionLabel={(option) => option.name}
      />
    </SelectorContainer>
  );
}

type UserItemProps = {
  user: User;
};

export function UserItem({ user }: UserItemProps) {
  return (
    <Container>
      <Avatar>
        <CustomAvatar user={user} />
      </Avatar>
      <Name>{user.name}</Name>
      <Email>{user.email}</Email>
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-columns: 50px 1fr;
  grid-template-rows: auto auto;
  grid-template-areas:
    'avatar name'
    'avatar email';
  row-gap: 1px;
  font-size: 0.8rem;
  align-items: center;
`;

const Avatar = styled.div`
  grid-area: avatar;
`;
const Name = styled.div`
  grid-area: name;
`;
const Email = styled.div`
  grid-area: email;
  color: ${colors.grey[500]};
`;
const SelectorContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  > * {
    margin: 5px 0;
  }

  @media screen and (min-width: 600px) {
    > * {
      max-width: 300px;
    }
  }
`;
