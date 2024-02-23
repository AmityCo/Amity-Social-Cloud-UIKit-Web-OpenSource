import styled from 'styled-components';

export const StoryCommentComposerBarContainer = styled.div`
  padding: 0 1rem;
`;

export const StoryDisabledCommentComposerBarContainer = styled.div`
  ${({ theme }) => theme.typography.body};
  color: ${({ theme }) => theme.palette.base.shade2};
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border-top: 1px solid #e3e4e8;
`;
