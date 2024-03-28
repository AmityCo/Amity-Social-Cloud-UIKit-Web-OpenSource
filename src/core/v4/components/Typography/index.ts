import styled from 'styled-components';

const TypographyBase = styled.p<{
  $type: 'headings' | 'titles' | 'subTitle' | 'body' | 'bodyBold' | 'caption' | 'captionBold';
}>`
  font-weight: ${({ theme, $type }) => theme.v4.typography[$type].fontWeight};
  font-size: ${({ theme, $type }) => theme.v4.typography[$type].fontSize};
  line-height: ${({ theme, $type }) => theme.v4.typography[$type].lineHeight};
`;

export const Typography = {
  Heading: styled(TypographyBase).attrs({ as: 'h1', $type: 'headings' })``,
  Title: styled(TypographyBase).attrs({ as: 'h2', $type: 'titles' })``,
  SubTitle: styled(TypographyBase).attrs({ as: 'h3', $type: 'subTitle' })``,
  Body: styled(TypographyBase).attrs({ $type: 'body' })`
    padding: 0;
    margin: 0;
  `,
  BodyBold: styled(TypographyBase).attrs({ $type: 'bodyBold' })`
    padding: 0;
    margin: 0;
  `,
  Caption: styled(TypographyBase).attrs({ $type: 'caption' })``,
  CaptionBold: styled(TypographyBase).attrs({ $type: 'captionBold' })``,
};
