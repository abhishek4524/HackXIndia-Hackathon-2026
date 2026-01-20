import React from 'react'

interface NotificationProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  isVisible?: boolean;
}

const Notification: React.FC<NotificationProps> = ({ 
  message, 
  type = 'info', 
  isVisible = true 
}) => {
  if (!isVisible) return null;
  
  const typeStyles = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500'
  };

  return (
    <div className={`fixed top-4 right-4 text-white px-4 py-2 rounded-lg shadow-lg ${typeStyles[type]}`}>
      {message}
    </div>
  )
}

export default Notification