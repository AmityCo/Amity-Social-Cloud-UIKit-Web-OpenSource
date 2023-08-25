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
    if (currentChannelData?.channelId == newChannelData?.channelId) return;

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
  const [showSystemMessage, setShowSystemMessage] = useState(false);
  const [chatSystemMessage, setChatSystemMessage] = useState("");
  const [channelLoaded, setChannelLoaded] = useState(false);

  if (channelLoaded === true)
  {
    //return;
  }

  if (channelLoaded === false)
  {
    let liveUser = UserRepository.getUser(currentUserId)
    liveUser.once('dataUpdated', model => 
    {        
      setUserModel(model);

      // Check if user model was properly set and has the metadata we need
      if (null !== userModel && userModel.metadata.teamId)
      {
        console.log("Retrieved User '"+userModel.displayName+"' ("+userModel.userId+") teamId: " + userModel.metadata.teamId); // + ",  " + JSON.stringify(userModel));
      }
      else
      {
        console.log("Retrieved user, but without proper team metadata. Returning.");
        setShowSystemMessage(true);
        setChatSystemMessage("You do not have the required team meta data.");
        return;
      }

      // Get the user's teamId
      let customChannel = userModel.metadata.teamId;

      // Check if a team chat channel exists by that teamId
      let searchingChannel = ChannelRepository.getChannel(customChannel)
      setSelectedChannel(customChannel);
      
      // A channel with that channelId was successfully found
      searchingChannel.once('dataUpdated', data => 
      {
        if (data && data.channelId)
        {
          console.log("Channel '" + data.displayName + "' exists! Entering...");

          // Team chat channel was found, so enter it if you're a member
          //setSelectedChannel(customChannel);
          // If you're not a member, join the channel, and then enter it
        }
        else
        {
          console.log("Channel found, but doesn't have name or id?");
        }
      });   

      // A channel with that channelId does not exist
      searchingChannel.once('dataError', error =>
      {
        console.log("Error receiving channel: " + error);

        // Check if you're the leader of the team,
        if (userModel.userId === userModel.metadata.teamLeaderId)
        {
          // if you're the leader, create the channel
          const liveChannel = ChannelRepository.createChannel({
            channelId: customChannel,
            type: ChannelType.Live,
            displayName : userModel.metadata.teamName,
            userIds: [ userModel.userId, 'abhishek' ],
          })

          liveChannel.once('dataUpdated', model => 
          {
            console.log(`Channel created successfully! ${model.channelId}`);
            //setSelectedChannel(customChannel);
          });
          
          liveChannel.once('dataError', error => 
          { 
            console.log("Channel didn't get created: " + error); 
          });
        }
        
        // if you're not the team leader, display message "Please wait for leader to log-in and establish a team chat channel."
        else 
        {
          console.log("The user '"+userModel.displayName+"' ("+userModel.userId+") is not the team leader. Channel creation delayed. Returning.");

          // Display message that leader needs to log-in first to create chat channel
          setShowSystemMessage(true);
          setChatSystemMessage("The Team Leader is required to log-in to generate this team's chat channel!");
          return;
        }

      });   
      
    }) 
  }

  useEffect(() => 
  {  
    console.log("Hit application's useEffect for channel: " + selectedChannel);
    
    if (!selectedChannel || selectedChannel === "")
    {
      console.log("selectedChannel is not currently set.");
      return;
    } 

    console.log(`(Handling channel selection '${selectedChannel})'`);

    handleChannelSelect({ channelId: selectedChannel, channelType: ChannelType.Standard });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChannel]);

  return (
    <ApplicationContainer>
      {/* <RecentChat
        selectedChannelId={currentChannelData?.channelId}
        membershipFilter={membershipFilter}
        onChannelSelect={handleChannelSelect}
        onAddNewChannelClick={() => {
          openChatModal();
          onAddNewChannel();
        }}
      />
      */}
      {currentChannelData && (
        <Chat
          channelId={currentChannelData.channelId}
          shouldShowChatDetails={shouldShowChatDetails}
          onChatDetailsClick={showChatDetails}
          showLeaderRequiredMessage = {showSystemMessage}
          chatSystemMessage = {chatSystemMessage}
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
