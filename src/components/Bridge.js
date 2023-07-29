import './Bridge.css';
import { useState } from 'react';
import { ethers } from 'ethers';

function Bridge({ showNotification }) {

    const [amount, setAmount] = useState('');

    const switchNetwork = async (desiredChainId, chainName, rpcUrls, blockExplorerUrls, nativeCurrency) => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const network = await provider.getNetwork();
    
        if (network.chainId !== parseInt(desiredChainId)) {
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: desiredChainId }],
                });
            } catch (switchError) {
                if (switchError.code === 4902) {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: desiredChainId,
                            chainName,
                            nativeCurrency,
                            rpcUrls,
                            blockExplorerUrls
                        }],
                    });
                } else {
                    throw switchError;
                }
            }
        }
    };
    
    const bridge = async () => {
        try {
            await switchNetwork(
                '0x1',
                'Mainnet',
                ['https://mainnet.infura.io/v3/'],
                ['https://etherscan.io'],
                {
                    name: 'ETH',
                    symbol: 'ETH',
                    decimals: 18
                }
            );
    
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const _signer = await provider.getSigner();
            const contractAddress = "0x49048044D57e1C92A77f79988d21Fa8fAF74E97e";
            const weiAmount = ethers.utils.parseEther(amount);
            
            if (weiAmount.isZero()) {
                throw new Error("Amount should be greater than 0");
            }
    
            const tx = await _signer.sendTransaction({
                to: contractAddress,
                value: weiAmount,
            });
    
            await tx.wait();
            showNotification("Successfully Bridged!!")
    
            await switchNetwork(
                '0x2105',
                'Base Mainnet',
                ['https://developer-access-mainnet.base.org'],
                ['https://basescan.org'],
                {
                    name: 'ETH',
                    symbol: 'ETH',
                    decimals: 18
                }
            );
            
        } catch (error) {
            console.log(error);
        }
    };
    

    return (
        <div className='bridge'>
            <input type='text' value={amount} onChange={(e) => setAmount(e.target.value)} placeholder='bridge amount...' />
            <button onClick={bridge}>Bridge</button>
        </div>
    );
}

export default Bridge;
