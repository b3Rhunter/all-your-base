import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { ethers } from 'ethers';
import Notification from './components/Notification';
import ABI from './ABI.json';
import Connect from './components/Connect';
import Confetti from './components/Confetti';
import Card from './components/Card';
import Gallery from './components/Gallery';

function App() {
  const [_provider, setProvider] = useState(null);
  const [connected, setConnected] = useState(false);
  const [signer, setSigner] = useState(null);
  const [name, setName] = useState(null);
  const [contract, setContract] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [balance, setBalance] = useState(0);
  const [nftBalance, setNFTBalance] = useState(0);
  const [supply, setSupply] = useState(0);
  const [notification, setNotification] = useState({ message: '', show: false });

  const connect = async () => {
    setName("connecting")
    try {

      let provider;

      provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const network = await provider.getNetwork();
      const desiredChainId = '0x14A33';
      if (network.chainId !== parseInt(desiredChainId)) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: desiredChainId }],
          });
        } catch (switchError) {
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                  chainId: desiredChainId,
                  chainName: 'Base Goerli',
                  nativeCurrency: {
                    name: 'ETH',
                    symbol: 'ETH',
                    decimals: 18
                  },
                  rpcUrls: ['https://goerli.base.org'],
                  blockExplorerUrls: ['https://goerli.basescan.org'],
                }],
              });
            } catch (addError) {
              throw addError;
            }
          } else {
            throw switchError;
          }
        }
      }

      provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider)
      const _signer = await provider.getSigner();
      setSigner(_signer)
      const address = "0xd492e6466F30523368B07375E5d6FD44b05B90aF";
      const _contract = new ethers.Contract(address, ABI, _signer);
      setContract(_contract);
      const _userAddress = await _signer.getAddress();
      setUserAddress(_userAddress);
      const _balance = await _provider.getBalance(_userAddress);
      setBalance(_balance);
      const _nftBalance = await _contract.balanceOf(_userAddress);
      setNFTBalance(_nftBalance)
      const _supply = await contract.getTotalSupply()
      setSupply(_supply)
      await _signer.signMessage("All Your Base!");
      const { ethereum } = window;
      if (ethereum) {
        const ensProvider = new ethers.providers.InfuraProvider('mainnet');
        const displayAddress = _userAddress?.substr(0, 6) + "...";
        const ens = await ensProvider.lookupAddress(_userAddress);
        if (ens !== null) {
          setName(ens)
          showNotification("Welcome " + ens);
        } else {
          setName(displayAddress)
          showNotification("Welcome " + displayAddress);
        }
      }
      setConnected(true);
    } catch (error) {
      console.log(error)
    }
  }

  const disconnect = async () => {
    setConnected(false);
    setName("")
    showNotification("Disconnected");
  }

  const showNotification = (message) => {
    setNotification({ message, show: true });
  };

  return (
    <div className="App">

      <Connect
        connect={connect}
        connected={connected}
        disconnect={disconnect}
        name={name}
      />

      {!connected && (
        <div>
          <img className='nft' src='https://media.giphy.com/media/spmJ2CMMcf1fSR7DRS/giphy.gif' alt='All Your Base!' />
          <p>please connect...</p>
        </div>
      )}

      {connected && (
       
        <Router>
        <div className='nav'>
        <Link to="/gallery">Gallery</Link>
        <Link to="/card">Mint</Link>
        </div>
        <Routes>
        <Route path="/" element={<Card supply={supply} setSupply={setSupply} _provider={_provider} nftBalance={nftBalance} setNFTBalance={setNFTBalance} balance={balance} setBalance={setBalance} contract={contract} userAddress={userAddress} showNotification={showNotification} name={name} />} />
        <Route path="/card" element={<Card supply={supply} setSupply={setSupply} _provider={_provider} nftBalance={nftBalance} setNFTBalance={setNFTBalance} balance={balance} setBalance={setBalance} contract={contract} userAddress={userAddress} showNotification={showNotification} name={name} />} />
        <Route path="/gallery" element={<Gallery contract={contract} />} />
        </Routes>
        </Router>
      
      )}

      <Notification
        message={notification.message}
        show={notification.show}
        setShow={(show) => setNotification({ ...notification, show })}
      />

    </div>
  );
}

export default App;
