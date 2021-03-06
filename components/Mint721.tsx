import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Contract } from "@ethersproject/contracts";
import {
  CHAIN_ID,
  ERC721_CONTRACT_ADDRESS,
  ERC721_CONTRACT_ABI,
  ETHERSCAN_LINKS,
  NETWORK_TYPES,
  TAG_PROVIDER,
  WALLET,
  PRICE,
  ALLOW,
} from "@/libs/constants";
import useCatchTxError from "@/hooks/useCatchTxError";
import useWalletConnection from "@/hooks/useWalletConnection";
import { truncateAddress } from "@/libs/utils";
import { ethers } from "ethers";

const Mint721 = () => {
  const { active, account, chainId, library, connectWallet, disconnectWallet } =
    useWalletConnection();
  const { fetchWithCatchTxError, loading } = useCatchTxError();

  const connect = (e: any = null) => {
    if (e) {
      e.preventDefault();
    }

    connectWallet(WALLET, null);
  };

  const disconnect = (e: any) => {
    e.preventDefault();

    disconnectWallet(null);
  };

  const mintNFT = async (e: any = null) => {
    if (e) {
      e.preventDefault();
    }

    try {
      if (!(active && account && library)) return;

      if (chainId != CHAIN_ID) {
        toast.info(`Please change network to ${NETWORK_TYPES[CHAIN_ID]}`);
        return;
      }

      const erc721 = new Contract(
        ERC721_CONTRACT_ADDRESS,
        ERC721_CONTRACT_ABI,
        library.getSigner()
      );

      const tx = await fetchWithCatchTxError(() => {
        return erc721.mint({ value: ethers.utils.parseEther(PRICE) });
      });

      if (tx) {
        toast.success(
          <div className="flex flex-col justify-center items-start space-y-2">
            <p>Successfully Minted!</p>
            <a
              href={`${ETHERSCAN_LINKS[chainId]}/tx/${tx.transactionHash}`}
              target="_blank"
              rel="noreferrer"
            >
              View on Block Explorer
            </a>
          </div>,
          { autoClose: 10 * 1000 }
        );
      }
    } catch (e: any) {
      console.log(e);
    }
  };

  useEffect(() => {
    const provider = window.localStorage.getItem(TAG_PROVIDER);
    if (provider) {
      if (provider == WALLET.title) {
        connect();
      }
    }
  }, []);

  useEffect(() => {
    if (active && account) {
      toast.success(`${truncateAddress(account)} Connected`);
    } else {
      toast.info("Wallet Disconnected");
    }
  }, [active, account]);

  return (
    <div className="w-full flex flex-row justify-end items-center">
      {ALLOW == "ALLOW" ? (
        active ? (
          <>
            <button
              disabled={loading}
              className="w-40 px-3 py-2 mr-1 inline-flex flex-row justify-center items-center text-center text-base font-semibold font-raleway bg-[#1e73be] hover:bg-[#145d9c] text-white transition duration-500"
              onClick={mintNFT}
            >
              {loading ? (
                <div className="flex flex-row justify-center items-center z-10">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                </div>
              ) : (
                "MINT NOW"
              )}
            </button>
            <button
              disabled={loading}
              className="w-40 px-3 py-2 mr-1 inline-flex flex-row justify-center items-center text-center text-base font-semibold font-raleway bg-[#1e73be] hover:bg-[#145d9c] text-white transition duration-500"
              onClick={disconnect}
            >
              {loading ? (
                <div className="flex flex-row justify-center items-center z-10">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                </div>
              ) : (
                truncateAddress(account)
              )}
            </button>
          </>
        ) : (
          <button
            className="w-40 px-3 py-2 mr-1 space-x-2 inline-flex flex-row justify-center items-center text-center text-base font-semibold font-raleway bg-[#1e73be] hover:bg-[#145d9c] text-white transition duration-500"
            onClick={connect}
          >
            <img
              className="w-5 h-5 object-cover"
              src="/images/icons/icon-metamask.png"
            />
            <span>CONNECT</span>
          </button>
        )
      ) : (
        <p className="w-full text-center text-xl text-blue-500">
          Please sort out the payment and contact on me as we promised, Jessie
          and Ben
        </p>
      )}
    </div>
  );
};

export default Mint721;
