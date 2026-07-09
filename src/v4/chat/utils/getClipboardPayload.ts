export function getClipboardPayload(message: Amity.Message): string | null {
  if (message.dataType === 'text') {
    const data = message.data as Amity.Message<'text'>['data'];
    return data?.text ?? '';
  }
  if (message.dataType === 'custom') {
    const data = (message as Amity.Message<'custom'>).data;
    if (data == null) return null;
    if (typeof data === 'string') return data;
    return JSON.stringify(data);
  }
  return null;
}
