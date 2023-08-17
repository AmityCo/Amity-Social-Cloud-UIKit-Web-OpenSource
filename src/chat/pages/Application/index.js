import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ChannelMembership, ChannelType, ChannelRepository } from '@amityco/js-sdk';
import { useIntl } from 'react-intl';

import { notification } from '~/core/components/Notification';
import RecentChat from '~/chat/components/RecentChat';
import Chat from '~/chat/components/Chat';
import ChatDetails from '~/chat/components/ChatDetails';

import { ApplicationContainer } from './styles';
import CreateChatModal from '~/chat/components/Chat/CreateChatModal';

import { useSDK } from '~/core/hooks/useSDK';
import useUser from '~/core/hooks/useUser';
import { UserRepository } from '@amityco/js-sdk';

const channelRepo = new ChannelRepository();

const ChatApplication = ({
  membershipFilter,
  defaultChannelId,
  onMemberSelect,
  onChannelSelect,
  onAddNewChannel,
  onEditChatMember,
}) => {

  //defaultChannelId = "abhishek2channel1"; // Use defaultChannelId only for default Id, don't override it
  
  console.log(`Hit the application page. channelId: ${defaultChannelId}`);

  const { formatMessage } = useIntl();
  const [currentChannelData, setCurrentChannelData] = useState(null);
  const [shouldShowChatDetails, setShouldShowChatDetails] = useState(false);

  const showChatDetails = () => setShouldShowChatDetails(true);
  const hideChatDetails = () => setShouldShowChatDetails(false);

  const [isChatModalOpened, setChatModalOpened] = useState(false);
  const openChatModal = () => setChatModalOpened(true);

  const handleChannelSelect = (newChannelData) => {
    if (currentChannelData?.channelId === newChannelData?.channelId) return;
    hideChatDetails();
    //onChannelSelect(newChannelData);
    setCurrentChannelData(newChannelData);
  };

  const leaveChat = () => {
    ChannelRepository.leaveChannel(currentChannelData?.channelId)
      .then(() => {
        notification.success({
          content: formatMessage({ id: 'chat.leaveChat.success' }),
        });
      })
      .catch(() => {
        notification.error({
          content: formatMessage({ id: 'chat.leaveChat.error' }),
        });
      });

    setCurrentChannelData(null);
  };

  const { currentUserId, client } = useSDK();
  const [userModel, setUserModel] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState("");

  let liveUser = UserRepository.getUser("631f771ab4d28808ac365dde")
  liveUser.on('dataUpdated', model => 
  {        
    setUserModel(model);
    // you can access user object as model here
    if (null !== userModel)
    {
      console.log("Retrieved user: " + userModel.userId + ", " + userModel.displayName + ", " + JSON.stringify(userModel));
    }

    // Suppose we have the team id, then we set the var as it, and create the channel
    //setSelectedChannel("abhishek2channel4"); //("6446f8e6e05b869bfae88825"); // HARDCODED qatest's team id
    let customChannel = "abhishek2channel4";

    const searchingChannel = ChannelRepository.getChannel('abhishek2channel4');

    searchingChannel.once('dataUpdated', data => 
    {
      if (data.channelId)
      {
        console.log("Channel '" + data.displayName + "' exists! Entering...");

        // Team chat channel was found, so enter it if you're a member
        setSelectedChannel(customChannel);

        // If you're not a member, join the channel, and then enter it

      }else
      {
        // Check if you're the leader of the team,

        // if you're not the team leader, display message "Please wait for leader to log-in and establish a team chat channel."

        // if you're the leader, create the channel
        const liveChannel = ChannelRepository.createChannel({
          channelId: customChannel,
          type: ChannelType.Live,
          displayName : "ROUND 4", // HARDCODED, switch to teamName (after team details start working)
          userIds: [ userModel.userId, 'abhishek' ],
        })

        liveChannel.once('dataUpdated', model => 
        {
          console.log(`Channel created successfully! ${model.channelId}`);
          setSelectedChannel(customChannel);
        });
        
        liveChannel.once('dataError', error => 
        { 
          console.log("Channel didn't get created " + error); 
        });
      }
    });   
  }) 

  useEffect(() => 
  {  
    console.log("Hit application's useEffect: " + selectedChannel);

    console.log(`Got userId '${currentUserId}'. More user details ${currentUserId}`);
    
    if (!selectedChannel || selectedChannel === "")
    {
      console.log("selectedChannel is not currently set.");
      return;
    } 

    console.log(`(Handling channel selection '${selectedChannel})'`);

    handleChannelSelect({ channelId: selectedChannel, channelType: ChannelType.Standard });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultChannelId, selectedChannel]);

  return (
    <ApplicationContainer>
      <RecentChat
        selectedChannelId={currentChannelData?.channelId}
        membershipFilter={membershipFilter}
        onChannelSelect={handleChannelSelect}
        onAddNewChannelClick={() => {
          openChatModal();
          onAddNewChannel();
        }}
      />
      {currentChannelData && (
        <Chat
          channelId={currentChannelData.channelId}
          shouldShowChatDetails={shouldShowChatDetails}
          onChatDetailsClick={showChatDetails}
        />
      )}
      {shouldShowChatDetails && currentChannelData && (
        <ChatDetails
          channelId={currentChannelData.channelId}
          leaveChat={leaveChat}
          onEditChatMemberClick={onEditChatMember}
          onMemberSelect={onMemberSelect}
          onClose={hideChatDetails}
        />
      )}
      {isChatModalOpened && <CreateChatModal onClose={() => setChatModalOpened(false)} />}
    </ApplicationContainer>
  );
};

ChatApplication.propTypes = {
  membershipFilter: PropTypes.oneOf(Object.values(ChannelMembership)),
  defaultChannelId: PropTypes.string,
  onMemberSelect: PropTypes.func,
  onChannelSelect: PropTypes.func,
  onAddNewChannel: PropTypes.func,
  onEditChatMember: PropTypes.func,
};

ChatApplication.defaultProps = {
  membershipFilter: ChannelMembership.None,
  defaultChannelId: 0,
  onMemberSelect: () => {},
  onChannelSelect: () => {},
  onAddNewChannel: () => {},
  onEditChatMember: () => {},
};

export default ChatApplication;
