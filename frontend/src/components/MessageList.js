import React from 'react';

const MessageList = ({ messages }) => {
  const getMessageStyle = (role) => {
    switch (role) {
      case 'user':
        return 'message-user';
      case 'assistant':
        return 'message-assistant';
      case 'system':
        return 'message-system';
      default:
        return '';
    }
  };

  return (
    <div className="message-list">
      {messages.map((message, index) => (
        <div 
          key={index} 
          className={`message ${getMessageStyle(message.role)}`}
        >
          <div className="message-content">
            {message.role === 'user' && <div className="message-avatar">You</div>}
            {message.role === 'assistant' && <div className="message-avatar">AI</div>}
            <div className="message-text">{message.content}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
