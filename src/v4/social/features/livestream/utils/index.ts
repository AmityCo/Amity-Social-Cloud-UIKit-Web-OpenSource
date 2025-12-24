export const getRoomParticipant = (
  room: Amity.Room,
  type: Amity.RawRoomParticipant['type'],
): Amity.RoomParticipant | undefined => {
  return room.participants.find((participant) => participant.type === type);
};
