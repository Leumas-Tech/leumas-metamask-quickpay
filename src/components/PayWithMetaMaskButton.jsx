import React, { useState, useEffect } from 'react';
import MetamaskSVG from "./MetamaskSVG.svg";
import { OrbitSpinner } from 'react-epic-spinners';

const MessageResponse = ({ message, messageType }) => {
  return (
    <div
      className={`p-4 rounded text-center font-bold ${
        messageType === 'success' ? 'bg-green-500' : 'bg-red-500'
      }`}
      style={{
        overflowWrap: 'break-word',
        wordWrap: 'break-word',
        overflow: 'hidden',
        maxWidth: '100%',
        maxHeight: '100%'
      }}
    >
      {message}
    </div>
  );
}

const PayWithMetaMaskButton = ({ 
  amount, 
  recipientAddress,
  onPaymentSuccess,
  onPaymentFailure,
  mode = 'production',
  tokensList = ["ETH", "BTC", "USDT"] // Default tokens list
}) => {
  const [account, setAccount] = useState(null);
  const [token, setToken] = useState(tokensList[0]);  // default to the first token in the list
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);
  const [transactionHash, setTransactionHash] = useState(null);
  const [transactionSuccess, setTransactionSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [conversionRate, setConversionRate] = useState(null);

  const connectMetaMask = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
      } catch (error) {
        console.error('User denied account access...');
      }
    } else {
      alert('Please install MetaMask to use this feature!');
    }
  };

  const switchNetwork = async () => {
    const testnetChainId = '0x5'; // Goerli testnet
    const mainnetChainId = '0x1'; // Ethereum mainnet
    const chainId = mode === 'test' ? testnetChainId : mainnetChainId;

    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId }],
        });
      } catch (error) {
        if (error.code === 4902) {
          alert('Please add the Goerli test network to MetaMask');
        } else {
          console.error('Failed to switch network:', error);
        }
      }
    }
  };

  const getConvertedAmount = () => {
    if (token === 'ETH' && conversionRate) {
      return amount / conversionRate;
    }
    return amount; // For other tokens, we keep the amount as is (no conversion)
  };

  const sendTransaction = async () => {
    console.log('Sending transaction to:', recipientAddress);

    if (!account) {
      await connectMetaMask();
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (!accounts.length) {
        setErrorMessage('Transaction declined by the user.');
        onPaymentFailure('Transaction declined by the user.');
        return;
      }
    }

    await switchNetwork();

    if (typeof window.ethereum !== 'undefined' && account) {
      const convertedAmount = getConvertedAmount();
      const valueInWei = BigInt(Math.round(convertedAmount * 10 ** 18)).toString(16);

      const transactionParameters = {
        from: account,
        to: recipientAddress,
        value: '0x' + valueInWei,
      };

      setLoading(true);

      try {
        const txHash = await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [transactionParameters],
        });
        console.log('Transaction Hash:', txHash);
        setTransactionHash(txHash);

        const getReceipt = async () => {
          const txReceipt = await window.ethereum.request({
            method: 'eth_getTransactionReceipt',
            params: [txHash],
          });
          const etherscanURL = mode === 'test' 
            ? `https://goerli.etherscan.io/tx/${txReceipt}` 
            : `https://etherscan.io/tx/${txReceipt}`;

          if (txReceipt && txReceipt.status === '0x1') {
            console.log('Transaction confirmed on Ethereum:', txReceipt);
            setTransactionSuccess(true);

            setMessage(
              <span>
                Transaction Successful
                <a href={etherscanURL} target="_blank" rel="noopener noreferrer">
                  {txHash}
                </a>
              </span>
            );
            setMessageType('success');
            setLoading(false);

            if (typeof onPaymentSuccess === "function") {
              onPaymentSuccess();
            }
          } else if (txReceipt) {
            console.error('Transaction failed:', txReceipt);
            setErrorMessage('Payment could not be processed.');
            onPaymentFailure('Payment could not be processed.');
            setLoading(false);
          } else {
            setTimeout(getReceipt, 5000);
          }
        };

        getReceipt();
      } catch (error) {
        console.error('Payment failed:', error.message);
        setLoading(false);
        setErrorMessage(error.message.includes('User denied') 
          ? 'Transaction declined by the user.' 
          : 'Payment could not be processed.');
        onPaymentFailure(error.message);
      }
    }
  };

  const fetchConversionRate = async () => {
    const backendEndpoint = `https://leumas-api-63700dc8135b.herokuapp.com/getConversionRate`;

    try {
      const response = await fetch(backendEndpoint);
      const data = await response.json();
      setConversionRate(data.ethereum.usd);
    } catch (error) {
      console.error("Failed to fetch conversion rate:", error);
    }
  };

  useEffect(() => {
    fetchConversionRate();
  }, []);

  const displayAmount = getConvertedAmount();

  return (

      <div className="flex items-center space-x-4">
       
        <select 
          value={token} 
          onChange={(e) => setToken(e.target.value)} 
          className="bg-white text-gray-700 py-2 px-3 rounded border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        >
          {tokensList.map(t => <option value={t} key={t}>{t}</option>)}
        </select>

        <button 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-md transition-transform transform active:scale-95 flex items-center gap-2"
          onClick={sendTransaction}
        >
          <img src={MetamaskSVG} alt="MetaMask" className="w-6 h-6" /> {displayAmount.toFixed(5)} {token}
        </button>

         {loading && <OrbitSpinner color="#00BFFF" />}

      {transactionSuccess && (
        <MessageResponse message={message} messageType={messageType} />
      )}

      {errorMessage && (
        <div className="text-red-500 mt-2">
          {errorMessage}
        </div>
      )}
      </div>

    
  );

};

export default PayWithMetaMaskButton;
