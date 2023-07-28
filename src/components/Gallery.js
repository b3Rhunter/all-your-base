import { useEffect, useState } from 'react';
import './Gallery.css';

function Gallery({ contract }) {
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    const fetchNFTs = async () => {
        try {
          const totalMinted = await contract.getTotalSupply();
          const tokenIndices = Array.from({ length: totalMinted }).map((_, i) => i);
          
          const tokenData = await Promise.all(
            tokenIndices.map(async index => {
              const tokenId = await contract.tokenByIndex(index);
              const tokenURI = await contract.tokenURI(tokenId);
              const metadata = JSON.parse(atob(tokenURI.split(",")[1]));
              const decodedImage = atob(metadata.image.split(",")[1]);
              
              return {
                name: metadata.name,
                walletAddress: metadata.walletAddress,
                image: decodedImage
              };
            })
          );
      
          setNfts(tokenData);
        } catch (error) {
          console.error("Failed to fetch NFTs: ", error);
        }
      }
      

    fetchNFTs();
  }, [contract]);

  return (
    <div className='gallery'>
      {nfts.map((nft, index) => (
        <div key={index}>
          <div className='nfts' dangerouslySetInnerHTML={{ __html: nft.image }}></div>
        </div>
      ))}
    </div>
  );
}

export default Gallery;
