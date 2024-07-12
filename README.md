# Pay with MetaMask - Crypto Payments for React Apps by Leumas Tech

Integrate crypto payments into your React applications with the `PayWithMetaMaskButton` by Leumas Tech. Perfect for microservices and eCommerce stores, allowing users to pay directly to your wallet address using MetaMask.

- **Checkout the NPM Package**: [Here on NPM](https://www.npmjs.com/package/leumas-metamask-quickpay)
- 
## Features

- Easy integration of MetaMask payments into React applications.
- Supports multiple cryptocurrencies including ETH, BTC, and USDT.
- Customizable to accept different tokens.
- Production and test modes for secure transactions.

## Installation

Install the package via npm:

```bash
npm install leumas-metamask-quickpay


# Example

```
import React from 'react';
import PayWithMetaMaskButton from 'leumas-metamask-pay';

const YourComponent = () => {
  const handlePaymentSuccess = () => {
    console.log('Payment Successful!');
  };

  return (
    <div>
      <h1>Buy our product</h1>
      <PayWithMetaMaskButton 
        amount={50} 
        recipientAddress="0xYourRecipientAddress" 
        onPaymentSuccess={handlePaymentSuccess} 
      />
    </div>
  );
};

export default YourComponent;
```

## Props

- **amount** (number): The amount to be paid.
- **recipientAddress** (string): The address of the recipient.
- **onPaymentSuccess** (function): Callback function to be called on successful payment.
- **onPaymentFailure** (function): Callback function to be called on payment failure.
- **mode** (string): Mode of the transaction ('production' or 'test'). Default is 'production'.
- **tokensList** (array): List of tokens accepted for payment. Default is ["ETH"].

## Use Cases

- **E-commerce Stores**: Accept cryptocurrency payments directly on your e-commerce platform.
- **Microservices**: Enable microservices to handle payments in crypto.
- **Donations**: Accept donations in cryptocurrency.
- **Digital Products**: Sell digital products and services and accept crypto payments.
- **Subscriptions**: Manage subscriptions with crypto payments.

## Updates

We continuously work on improving the `PayWithMetaMaskButton` component. Here are some recent updates:

- **v1.0.10**: Working on fixing custom testnets or custom networks, as well as supporting other tokens, including potential custom tokens.
- **v1.0.9**: Minor bug fixes and performance improvements.
- **v1.0.8**: Enhanced error handling for failed transactions.
- **v1.0.7**: Updated the README with detailed usage instructions.
- **v1.0.6**: Improved UI styling and added support for multiple themes.
- **v1.0.5**: Added support for more cryptocurrencies.
- **v1.0.4**: Fixed bugs related to network switching.
- **v1.0.3**: Introduced test mode (initial version was buggy).
- **v1.0.2**: Enhanced styling for better user experience.
- **v1.0.1**: Added support for test coins.
- **v1.0.0**: Initial release with basic MetaMask payment functionality.


## Quick Links

- **YouTube Channel**: [Leumas Tech YouTube](https://www.youtube.com/@l.e.u.m.a.s4218)
- **Home Page**: [Leumas Tech](https://leumas.tech)
- **GitHub Repository**: [GitHub](https://github.com/Leumas-Tech)
- **NPM Package**: [NPM](https://www.npmjs.com/package/leumas-metamask-quickpay)

For further details, visit our [documentation](https://leumas.tech/docs).
