import styled from 'styled-components';

export const ChannelsPageContainer = styled.div`
  display: flex;
  height: 400px;
  overflow: hidden;
`;

export const ChannelsListContainer = styled.div`
  background-color: white;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  width: 360px;
  margin-right: 10px;
  overflow: auto;
`;

export const ChannelItemContainer = styled.div`
  background-color: white;
  border-bottom: 1px solid #e6e6e6;
  height: 40px;
  padding: 10px;
  ${({ selected }) => selected && 'border-left: 8px solid rgba(41, 203, 114, 0.74);'}
  cursor: pointer;
`;
