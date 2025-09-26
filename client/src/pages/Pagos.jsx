import Web3 from 'web3';
import { useEffect, useState } from 'react';
import { Loader } from '../components';
import { abi } from '../ABI.json'; // Asegúrate de que este ABI incluye getWhitelistDetails

const web3 = new Web3(window.ethereum);
const contractAddress = '0x8decb7E36488e95B63287eF1921905941C8C5156';
const contract = new web3.eth.Contract(abi, contractAddress);

const Pagos = () => {
  const [whiteListedAddresses, setWhiteListedAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchWhiteListedAddresses = async () => {
      try {
        setIsLoading(true);

        if (!window.ethereum) {
          throw new Error('Ethereum is not connected');
        }

        const addresses = await contract.methods
          .getWhiteListedAddresses()
          .call({ from: '0xA62FeC1444118BD0e80c6cdA6a4873144ECe21ca' });

        const detailedAddresses = await Promise.all(
          addresses.map(async (address) => {
            try {
              const details = await contract.methods
                .getWhitelistDetails(address)
                .call({ from: '0xA62FeC1444118BD0e80c6cdA6a4873144ECe21ca' });

              return {
                address,
                firstName: details[0],
                lastName: details[1],
                id: details[2],
                residence: details[3],
              };
            } catch (error) {
              return {
                address,
                firstName: 'N/A',
                lastName: 'N/A',
                id: 'N/A',
                residence: 'N/A',
              };
            }
          }),
        );

        setWhiteListedAddresses(detailedAddresses);
      } catch (error) {
        console.error('Error fetching whiteListedAddresses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWhiteListedAddresses();
  }, []);

  return (
    <div className="bg-[#1c1c24] flex flex-col justify-center items-center rounded-[10px] sm:p-10 p-4 min-h-[500px]">
      {isLoading && <Loader />}

      <div className="w-full max-w-4xl mb-10 text-center">
        <h1 className="font-epilogue font-bold text-2xl sm:text-3xl text-white">
          Lista Blanca de Inversores
        </h1>
        <p className="text-[#b2b3bd] mt-2">
          Estos inversores han sido verificados y están autorizados.
        </p>
      </div>

      <div className="grid gap-6 w-full max-w-6xl sm:grid-cols-2 lg:grid-cols-3 px-4">
        {whiteListedAddresses.map((entry, index) => (
          <div
            key={index}
            className="bg-[#2c2f32] border-l-[6px] border-[#FF751A] text-white rounded-xl p-5 shadow hover:scale-[1.02] transition-transform"
          >
            <h4 className="font-semibold text-sm break-all mb-2">
              🧾 <span className="text-orange-400">Address:</span>{' '}
              {entry.address}
            </h4>
            <p className="text-sm mb-1">
              👤 <span className="text-orange-300">Nombre:</span>{' '}
              {entry.firstName} {entry.lastName}
            </p>
            <p className="text-sm mb-1">
              🆔 <span className="text-orange-300">ID:</span> {entry.id}
            </p>
            <p className="text-sm">
              🌍 <span className="text-orange-300">Residencia:</span>{' '}
              {entry.residence}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pagos;
