import styled from '@emotion/styled';

type SocialButtonProps = {
  onClick: () => void;
  icon?: React.ReactNode;
  label: string;
};

export function SocialButton({ icon, label, onClick }: SocialButtonProps) {
  return (
    <Container onClick={onClick}>
      <Icon>{icon}</Icon>
      <Label>{label}</Label>
    </Container>
  );
}

const Container = styled.div`
  width: 200px;
  height: 200px;
  border: 1px solid red;
`;

const Icon = styled.div`
  width: 100px;
  height: 100px;
  object-fit: contain;
  border: 1px solid blue;

  img {
    width: 100%;
    height: 100%;
  }
`;

const Label = styled.div``;
