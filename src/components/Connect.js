import './Connect.css';

function Connect({connect, connected, name, disconnect}) {

  return (
    <div>
    {!connected && (
      <button className="connect-button" onClick={connect}>
      connect
      </button>
    )}
    {connected && (
      <button className='connect-button' onClick={disconnect}>
        {name}
      </button>
    )}
    </div>

  );
}

export default Connect;
