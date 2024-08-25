// 'use client';

// import { useWallet } from '@solana/wallet-adapter-react';
// import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
// import '@solana/wallet-adapter-react-ui/styles.css';

// const WalletConnect = () => {
//   const { connected } = useWallet();

//   return (
//     <div>
//       <WalletMultiButton />
//       {connected && <p className="mt-2">Wallet connected!</p>}
//     </div>
//   );
// };

// export default WalletConnect;







// 'use client';

// import { useWallet } from '@solana/wallet-adapter-react';
// import dynamic from 'next/dynamic';

// // Dynamically import the WalletMultiButton
// const WalletMultiButtonDynamic = dynamic(() =>
//   import('@solana/wallet-adapter-react-ui').then((mod) => mod.WalletMultiButton),
//   { ssr: false }
// );

// const WalletConnect = () => {
//   const { connected } = useWallet();

//   return (
//     <div>
//       <WalletMultiButtonDynamic />
//       {connected && <p className="mt-2">Wallet connected!</p>}
//     </div>
//   );
// };

// export default WalletConnect;











'use client';
import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';

const WalletConnect = () => {
  const { connected } = useWallet();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div>
      <WalletMultiButton />
      {connected && <p className="mt-2">Wallet connected!</p>}
    </div>
  );
};

export default WalletConnect;