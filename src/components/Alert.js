const Alert = ({ alert }) => {
  if (!alert || !alert.message) return null;

  const getSafeMessage = () => {
    if (typeof alert.message !== 'string') return 'Something went wrong';

    // prevent raw backend errors leaking
    if (
      alert.message.toLowerCase().includes('json') ||
      alert.message.toLowerCase().includes('stack') ||
      alert.message.toLowerCase().includes('error:')
    ) {
      return 'Something went wrong. Please try again.';
    }

    return alert.message;
  };

  const typeStyles = {
    success: 'bg-green-500',
    danger: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500'
  };

  return (
    <div className="fixed top-[60px] left-0 w-full z-[9999] flex justify-center">
      <div
        className={`text-white px-4 py-2 rounded shadow-md ${typeStyles[alert.type] || 'bg-gray-700'}`}
        style={{
          animation: 'slideDown 0.3s ease'
        }}
      >
        {getSafeMessage()}
      </div>

      <style>
        {`
          @keyframes slideDown {
            from {
              transform: translateY(-20px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Alert;