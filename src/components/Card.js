import './Card.css';
import { useState, useEffect } from 'react';
import {ethers} from 'ethers'
import Confetti from './Confetti';

function Card({supply, setSupply, _provider, contract, userAddress, showNotification, name, balance, setBalance, nftBalance, setNFTBalance}) {

  const [isConfettiActive, setConfettiActive] = useState(false);
  const [confettiOrigin, setConfettiOrigin] = useState({ x: 0, y: 0 });
  const [nftImageData, setNftImageData] = useState(null); 
  const [minted, setMinted] = useState(false);

  const handleMintClick = async (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    const tx = await contract.mint(userAddress, name, { value: ethers.utils.parseEther("0.001") });
    await tx.wait()

    const tokenId = await contract.getTotalSupply();
    const tokenURI = await contract.tokenURI(tokenId);
    const metadata = JSON.parse(atob(tokenURI.split(",")[1]));

    const decodedImage = atob(metadata.image.split(",")[1]);
    setNftImageData(decodedImage);
    const _balance = await _provider.getBalance(userAddress);
    setBalance(_balance)
    const _nftBalance = await contract.balanceOf(userAddress);
    const _supply = await contract.getTotalSupply()
    setSupply(_supply)
    setNFTBalance(_nftBalance)
    setMinted(true);
    setConfettiOrigin({ x, y });
    setConfettiActive(true);
    showNotification("Minted!!!");
    setTimeout(() => setConfettiActive(false), 2000);
  };
  
  return (
    <div className='card'>
        <h1>All Your Base!!</h1>
        {minted && (
          <div>
           {nftImageData && <div className='minted-nft' dangerouslySetInnerHTML={{ __html: nftImageData }}></div>}
          </div>
        )}
        {!minted && (
        <div className='stats'>
        <p>Balance..............{Number(ethers.utils.formatEther(balance.toString())).toFixed(2)} ETH</p>
        <p>Cost................0.001 ETH</p>
        <p>Owned NFTs..................{nftBalance.toString()}</p>
        <p>Total Supply................{supply.toString()}</p>
        </div>
        )}

        <Confetti isActive={isConfettiActive} origin={confettiOrigin} />
        <button className='mint-button' onClick={handleMintClick}>MINT</button>
    </div>
  );
}

export default Card;
