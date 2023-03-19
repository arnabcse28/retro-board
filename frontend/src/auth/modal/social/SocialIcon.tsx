import styled from '@emotion/styled';

type SocialIconProps = {
  src: string;
};

export function SocialIcon({ src }: SocialIconProps) {
  return <Image src={src} alt="Social icon" />;
}

const Image = styled.img``;
