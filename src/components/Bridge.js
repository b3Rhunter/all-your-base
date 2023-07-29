import './Bridge.css';
import { useState } from 'react';
import { ethers } from 'ethers';

function Bridge() {

    const [amount, setAmount] = useState('');

    const bridge = async () => {
        try {
            let provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const network = await provider.getNetwork();
            const desiredChainId = '0x1';
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
                                    chainName: 'Mainnet',
                                    nativeCurrency: {
                                        name: 'ETH',
                                        symbol: 'ETH',
                                        decimals: 18
                                    },
                                    rpcUrls: ['https://mainnet.infura.io/v3/'],
                                    blockExplorerUrls: ['https://etherscan.io'],
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

            

            try {
                let provider = new ethers.providers.Web3Provider(window.ethereum);
                await provider.send("eth_requestAccounts", []);
                const network = await provider.getNetwork();
                const desiredChainId = '0x2105';
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
                                        chainName: 'Base Mainnet',
                                        nativeCurrency: {
                                            name: 'ETH',
                                            symbol: 'ETH',
                                            decimals: 18
                                        },
                                        rpcUrls: ['https://developer-access-mainnet.base.org'],
                                        blockExplorerUrls: ['https://basescan.org'],
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
            } catch (error) {
                console.log(error);
            }



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
