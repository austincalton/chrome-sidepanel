export function alertSidepanel(message) {
  const messagesTextarea = document.getElementById('messages');
  messagesTextarea.value = messagesTextarea.value.concat(`${message}\n\n`);
  messagesTextarea.scrollTop = messagesTextarea.scrollHeight;
}
