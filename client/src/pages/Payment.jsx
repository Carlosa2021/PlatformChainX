import Web3 from 'web3';
import { useEffect, useState, useContext } from 'react';
import { Loader } from '../components';
import Footer from '../components/Footer';
import { ABI } from '../ABI.json';
import { Blobbie } from 'thirdweb/react';
import { ThemeContext } from '../components/ThemeContext';

const web3 = new Web3(window.ethereum);
const contractAddress = '0x879CaF6c12D2fD533ee4A9a75B68159d270dfBD5';
const contract = new web3.eth.Contract(ABI, contractAddress);

const Payment = () => {
  const { theme } = useContext(ThemeContext);
  const [whiteListedAddresses, setWhiteListedAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchWhiteListedAddresses = async () => {
      try {
        setIsLoading(true);
        if (!window.ethereum) throw new Error('Ethereum is not connected');

        const addresses = await contract.methods
          .getWhiteListedAddresses()
          .call({ from: '0xA62FeC1444118BD0e80c6cdA6a4873144ECe21ca' });

        const detailed = await Promise.all(
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
            } catch {
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

        setWhiteListedAddresses(detailed);
      } catch (error) {
        console.error('Error fetching whitelist:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWhiteListedAddresses();
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: theme.colors.primaryBackground,
        color: theme.colors.primaryText,
      }}
    >
      <main className="flex-grow w-full max-w-6xl mx-auto px-4 sm:px-8 pt-8 pb-12">
        <h1
          className="text-2xl sm:text-3xl font-bold text-center mb-6"
          style={{ color: theme.colors.primaryText }}
        >
          Lista Blanca de Inversores Verificados
        </h1>

        <div
          className="rounded-xl shadow-lg overflow-hidden"
          style={{
            backgroundColor: theme.colors.cardBackground,
          }}
        >
          <div
            className="px-6 py-3 text-sm sm:text-base font-semibold"
            style={{
              backgroundColor: theme.colors.headerBackground,
              color: theme.colors.primaryText,
            }}
          >
            Tabla de Inversores
          </div>

          {isLoading ? (
            <div className="flex justify-center p-6">
              <Loader />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr
                    style={{
                      backgroundColor: theme.colors.tableHeader,
                      color: theme.colors.secondaryText,
                    }}
                    className="uppercase text-xs font-semibold tracking-wider"
                  >
                    <th className="px-6 py-3">Inversor</th>
                    <th className="px-6 py-3">Dirección Wallet</th>
                    <th className="px-6 py-3">ID</th>
                    <th className="px-6 py-3">Residencia</th>
                  </tr>
                </thead>
                <tbody>
                  {whiteListedAddresses.map((entry, i) => (
                    <tr
                      key={i}
                      className="transition-colors"
                      style={{
                        backgroundColor: theme.colors.cardBackground,
                      }}
                    >
                      <td className="px-6 py-4 flex items-center gap-3">
                        <Blobbie
                          address={entry.address}
                          className="w-8 h-8 rounded-full border border-white"
                        />
                        <span
                          className="text-sm font-medium capitalize"
                          style={{ color: theme.colors.primaryText }}
                        >
                          {entry.firstName} {entry.lastName}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-mono break-all">
                        <code
                          className="px-2 py-1 rounded-md"
                          style={{
                            backgroundColor: theme.colors.codeBackground,
                            color: theme.colors.secondaryText,
                          }}
                        >
                          {entry.address}
                        </code>
                      </td>
                      <td
                        className="px-6 py-4 text-sm"
                        style={{ color: theme.colors.primaryText }}
                      >
                        {entry.id}
                      </td>
                      <td
                        className="px-6 py-4 text-sm"
                        style={{ color: theme.colors.secondaryText }}
                      >
                        {entry.residence}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Payment;
