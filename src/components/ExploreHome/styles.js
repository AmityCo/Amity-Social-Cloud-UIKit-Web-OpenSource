import styled from 'styled-components';
import { FontAwesomeIcon as FaIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faPlus,
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/pro-regular-svg-icons';
import Button, { SecondaryButton } from '../Button';
import UIAvatar from '../Avatar';
import Menu from '../Menu';

export const SearchIcon = styled(FaIcon).attrs({ icon: faSearch })`
  color: #898e9e;
  padding: 0 10px;
  position: absolute;
  top: 10px;
  left: 5px;
`;

export const PlusIcon = styled(FaIcon).attrs({ icon: faPlus })`
  margin: 0 9px 0 6px;
`;

export const BackIcon = styled(FaIcon).attrs({ icon: faChevronLeft })`
  margin-right: 5px;
`;

export const RightIcon = styled(FaIcon).attrs({ icon: faChevronRight })`
  margin-left: 10px;
`;

export const Avatar = styled(UIAvatar)`
  margin-right: 8px;
`;

export const ExploreHeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 35px 10px 30px;
  background: ${({ theme }) => theme.color.primary};
  color: #fff;
  ${({ theme }) => theme.typography.title}
`;

export const ExploreHomeContainer = styled.div`
  flex-grow: 1;
  overflow-x: hidden;
  overflow-y: auto;
`;

export const CategoryPageContainer = styled.div`
  flex-grow: 1;
  overflow-x: hidden;
  overflow-y: auto;
`;

export const CategoryPageHeader = styled.div`
  background: #ffffff;
  border: 1px solid #edeef2;
  border-radius: 4px 4px 0px 0px;
  padding: 16px;
  margin-top: 25px;
  display: flex;
  align-items: center;
`;

export const CommunitiesSearchContainer = styled.div`
  position: relative;
  width: 480px;
  margin: 8px 0 25px;
`;

export const CommunitiesSearchInput = styled.input`
  width: 100%;
  padding: 10px;
  padding-left: 40px;
  background: #ffffff;
  border: 1px solid #d5d7dd;
  border-radius: 4px;
  outline: none;
`;

export const CreateCommunityButton = styled(Button)`
  margin-top: 8px;
`;

export const CommunitiesSearchResults = styled(Menu)`
  width: 480px;
  overflow-y: auto;
  max-height: 200px;
`;

export const CategoryModalBody = styled(Menu)`
  width: 520px;
  overflow-y: auto;
  max-height: 300px;
`;

export const HighlightedText = styled.span`
  ${({ theme }) => theme.typography.bodyBold}
  white-space: break-spaces;
`;

export const Text = styled.span`
  ${({ theme }) => theme.typography.body}
  white-space: break-spaces;
`;

export const Blocks = styled.div`
  margin: 0 36px;
  padding-bottom: 20px;
`;

export const Block = styled.div`
  margin-top: 20px;
  background: #fff;
  border: 1px solid ${({ theme }) => theme.color.base4};
  border-radius: 4px;
`;

export const BlockHeader = styled.div`
  padding: 16px 16px 12px;
  border-bottom: 1px solid ${({ theme }) => theme.color.base4};
  ${({ theme }) => theme.typography.title}
`;

export const CommunityItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid ${({ theme }) => theme.color.base4};
  border-radius: 4px;
  padding: 16px;
  overflow: hidden;
  color: ${({ theme }) => theme.color.base};
  height: 180px;
  ${({ theme }) => theme.typography.caption}
`;

export const CommunityItems = styled.div`
  padding: 20px 16px 16px;
  display: grid;
  grid-gap: 12px;
  grid-template-columns: repeat(auto-fill, 170px);
  justify-content: space-between;
  cursor: pointer;
`;

export const Description = styled.div`
  margin-top: 5px;
`;

export const Count = styled.span`
  ${({ theme }) => theme.typography.captionBold}
`;

export const Categories = styled.div`
  padding: 20px 16px 20px;
  display: grid;
  grid-gap: 16px;
  grid-template-columns: auto auto auto;
`;

export const Category = styled.div`
  display: flex;
  cursor: pointer;
  ${({ theme }) => theme.typography.bodyBold}
`;

export const TrendingCommunities = styled.div`
  padding: 30px;
  display: grid;
  grid-gap: 30px;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto auto;
  grid-auto-flow: column;
`;

export const CommunityInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: space-between;
  padding-bottom: 12px;
  cursor: pointer;
  border-bottom: 1px solid ${({ theme }) => theme.color.base4};
`;

export const TrendingCommunityContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${({ theme }) => theme.typography.caption}

  &:last-child ${CommunityInfo},
  &:nth-child(3) ${CommunityInfo} {
    border: none;
  }
`;

export const TrendingFooter = styled.div`
  color: ${({ theme }) => theme.color.base1};
  margin-top: 5px;
`;

export const CategoryName = styled.div`
  ${({ theme }) => theme.typography.headline}
`;

export const BackButton = styled(SecondaryButton)`
  padding: 4px 12px 4px 5px;
`;

export const ViewAllButton = styled(SecondaryButton)`
  border-top: 1px solid ${({ theme }) => theme.color.base4};
  padding: 18px;
  width: 100%;
  border-radius: 0;
  align-items: center;
  justify-content: center;
`;
