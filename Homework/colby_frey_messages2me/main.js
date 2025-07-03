const messageInput = document.getElementById('messageInput');
const messageList = document.getElementById('messageList');
const addBtn = document.getElementById('addBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const sendNowBtn = document.getElementById('sendNowBtn');

let messages = [];

function renderMessages() {
  messageList.innerHTML = '';
  messages.forEach((msg, idx) => {
    const li = document.createElement('li');

    // Delete button (trash icon)
    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '🗑️'; // trash emoji icon
    deleteBtn.className = 'delete-btn';
    deleteBtn.title = 'Delete message';
    deleteBtn.style.textShadow = 'red';
    deleteBtn.onclick = () => {
      messages.splice(idx, 1);
      renderMessages();
    };

    li.appendChild(deleteBtn);
    li.appendChild(document.createTextNode(msg));
    messageList.appendChild(li);
  });
}

addBtn.onclick = () => {
  const msg = messageInput.value.trim();
  if (!msg) {
    alert('Please enter a message to add.');
    return;
  }
  messages.push(msg);
  messageInput.value = '';
  renderMessages();
};

clearAllBtn.onclick = () => {
  if (confirm('Warning: All messages will be forever lost and are unrecoverable. Are you sure?')) {
    messages = [];
    renderMessages();
  }
};

sendNowBtn.onclick = () => {
  if (messages.length === 0) {
    alert('No messages to send.');
    return;
  }
  alert('Sending messages:\n\n' + messages.join('\n'));
};

renderMessages();
