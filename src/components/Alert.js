const Alert = ({ alert }) => {
  if (!alert) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '60px',
        left: 0,
        width: '100%',
        zIndex: 9999
      }}
    >
      <div
        className={`alert alert-${alert.type} text-center m-0`}
        role="alert"
        style={{
          border: 'none',
          borderRadius: 0,
          animation: 'slideDown 0.4s ease'
        }}
      >
        {alert.message}
      </div>

      {/* ANIMATION */}
      <style>
        {`
          @keyframes slideDown {
            from {
              transform: translateY(-100%);
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