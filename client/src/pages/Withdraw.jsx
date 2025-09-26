import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import Footer from '../components/Footer';
import { useStateContext } from '../context';
import { money } from '../assets';
import { CustomButton, FormField, Loader } from '../components';
import { ThemeContext } from '../components/ThemeContext';

const WithdrawTokens = () => {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const [isLoading, setIsLoading] = useState(false);
  const { withdrawTokens } = useStateContext();

  const [form, setForm] = useState({
    withdrawAddress: '',
    amount: '',
  });

  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await withdrawTokens({
        ...form,
        amount: ethers.utils.parseUnits(form.amount, 18),
      });
      navigate('/');
    } catch (error) {
      console.error('❌ Error withdrawing tokens:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-between"
      style={{ backgroundColor: theme.colors.primaryBackground }}
    >
      <div
        className="mx-auto flex flex-col rounded-[14px] shadow-2xl sm:p-10 p-6 w-full sm:w-[460px] mt-20 mb-12"
        style={{ backgroundColor: theme.colors.cardBackground }}
      >
        {isLoading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 rounded-[14px]">
            <Loader />
          </div>
        )}

        <div
          className="flex justify-center items-center p-4 rounded-t-[14px] mb-8 shadow-md"
          style={{ backgroundColor: theme.colors.headerBackground }}
        >
          <h1
            className="text-2xl font-bold tracking-wide"
            style={{ color: theme.colors.accent }}
          >
            Retiro de Tokens
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 z-10">
          <FormField
            labelName="Dirección de retiro *"
            placeholder="0x1234..."
            inputType="text"
            value={form.withdrawAddress}
            handleChange={(e) => handleFormFieldChange('withdrawAddress', e)}
          />

          <FormField
            labelName="Cantidad a retirar *"
            placeholder="Cantidad en USDC"
            inputType="number"
            value={form.amount}
            handleChange={(e) => handleFormFieldChange('amount', e)}
          />

          <div
            className="flex items-center gap-4 rounded-xl shadow-sm p-4"
            style={{
              background: theme.colors.gradient,
            }}
          >
            <img
              src={money}
              alt="money"
              className="w-10 h-10 object-contain drop-shadow-xl"
            />
            <div className="text-white">
              <h4 className="font-semibold text-sm mb-1">Aviso importante</h4>
              <p className="text-xs opacity-85 leading-tight">
                Recibirás tus tokens una vez finalice el plazo de retiro de la
                campaña.
              </p>
            </div>
          </div>

          <CustomButton
            btnType="submit"
            title={isLoading ? 'Procesando...' : 'Retirar Tokens'}
            styles="bg-[#FF751A] hover:bg-orange-600 text-white text-base font-bold py-3 px-6 rounded-xl shadow-md transition-all duration-300 w-full"
            disabled={isLoading}
          />
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default WithdrawTokens;
