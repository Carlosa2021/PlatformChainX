// contractConstants.js
export const campaignRegistryAddress =
  '0x9110DcBE001D9090Ba897126D04cA59b28f822e3'; // Reemplaza con la dirección correcta
export const usdcAddress = '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359';
export const priceFeedAddress = '0x73366Fe0AA0Ded304479862808e02506FE556a98';
export const plataformaChainxAddress =
  '0x78D69Fb6f757bCCE89381018125Cea307513ABf5';

// Asegúrate de que los ABI están correctamente importados
import campaignRegistryABI from '../src/context/campaignRegistryABI.json';
import usdcAbi from '../src/context/usdcAbi.json';
import aggregatorV3InterfaceABI from '../src/context/aggregatorV3InterfaceABI.json';
import PlataformaChainXABI from '../src/context/PlataformaChainXABI.json';

export {
  campaignRegistryABI,
  usdcAbi,
  aggregatorV3InterfaceABI,
  PlataformaChainXABI,
};
