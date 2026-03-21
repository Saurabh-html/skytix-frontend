const Alert = ({ alert }) => {
  if (!alert) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '60px', // adjust based on navbar height
      left: 0,
      width: '100%',
      zIndex: 9999
    }}>
      <div
        className={`alert alert-${alert.type} text-center m-0`}
        role="alert"
        style={{
          border: 'none',
          borderRadius: 0
        }}
      >
        {alert.message}
      </div>
    </div>
  );
};

export default Alert;