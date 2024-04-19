import React from 'react';

const ErrorMessage = ({ message }: { message: string }) => {
  return (
    <div className="error-message">
      <p>{message}</p>
      <style jsx>{`
        .error-message {
          background-color: #ffcccc;
          color: #ff0000;
          padding: 10px;
          border-radius: 5px;
          margin-bottom: 10px;
        }
      `}</style>
    </div>
  );
};

export default ErrorMessage;
