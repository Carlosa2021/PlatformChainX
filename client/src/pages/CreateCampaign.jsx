import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { useStateContext } from '../context';
import { money } from '../assets';
import { CustomButton, FormField, Loader } from '../components';
import { checkIfImage } from '../utils';
import { ThemeContext } from '../components/ThemeContext';

const CreateCampaign = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { createCampaign } = useStateContext();
  const { theme } = useContext(ThemeContext);

  const [form, setForm] = useState({
    name: '',
    title: '',
    description: '',
    location: '',
    target: '',
    deadline: '',
    image: '',
    tokenContract: '',
    documents: '',
    documentTitles: '',
    video: '',
    tokenInfo: '',
    startDate: '',
    tokenValueInEUR: '',
  });

  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const deadlineTimestamp = Math.floor(
      new Date(form.deadline).getTime() / 1000,
    );
    const startDateTimestamp = Math.floor(
      new Date(form.startDate).getTime() / 1000,
    );

    checkIfImage(form.image, async (exists) => {
      if (exists) {
        setIsLoading(true);
        if (
          typeof form.target === 'string' &&
          !isNaN(parseFloat(form.target))
        ) {
          const campaignData = {
            ...form,
            target: ethers.utils.parseUnits(form.target, 18),
            deadline: deadlineTimestamp,
            startDate: startDateTimestamp,
            tokenValueInEUR: Math.round(Number(form.tokenValueInEUR)),
          };
          try {
            await createCampaign(campaignData);
            setIsLoading(false);
            navigate('/');
          } catch (error) {
            console.error('Error al crear la campaña:', error);
            setIsLoading(false);
          }
        } else {
          alert('Please provide a valid target amount');
          setIsLoading(false);
        }
      } else {
        alert('Provide valid image URL');
        setForm({ ...form, image: '' });
      }
    });
  };

  return (
    <div
      className="flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4"
      style={{
        backgroundColor: theme.colors.primaryBackground,
        color: theme.colors.primaryText,
      }}
    >
      {isLoading && <Loader />}

      <div
        className="flex justify-center items-center p-[16px] sm:min-w-[380px] rounded-[10px]"
        style={{ backgroundColor: theme.colors.cardBackground }}
      >
        <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px]">
          Start a Campaign
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full mt-[65px] flex flex-col gap-y-8"
      >
        <h3 className="text-lg font-bold">Detalles generales</h3>
        <div className="flex flex-wrap gap-[40px]">
          <FormField
            labelName="Your Name *"
            placeholder="John Doe"
            inputType="text"
            value={form.name}
            handleChange={(e) => handleFormFieldChange('name', e)}
          />
          <FormField
            labelName="Campaign Title *"
            placeholder="Write a title"
            inputType="text"
            value={form.title}
            handleChange={(e) => handleFormFieldChange('title', e)}
          />
        </div>

        <FormField
          labelName="Story *"
          placeholder="Write your story"
          isTextArea
          value={form.description}
          handleChange={(e) => handleFormFieldChange('description', e)}
        />

        <div
          className="w-full flex justify-start items-center p-4 h-[120px] rounded-[10px]"
          style={{ backgroundColor: theme.colors.highlightBackground }}
        >
          <img
            src={money}
            alt="money"
            className="w-[40px] h-[40px] object-contain"
          />
          <h4 className="font-epilogue font-bold text-[25px] ml-[20px]">
            You will get 100% of the raised amount
          </h4>
        </div>

        <h3 className="text-lg font-bold">Información del Token</h3>
        <div className="flex flex-wrap gap-[40px]">
          <FormField
            labelName="Goal *"
            placeholder="ETH 1.0"
            inputType="text"
            value={form.target}
            handleChange={(e) => handleFormFieldChange('target', e)}
          />
          <FormField
            labelName="Token Contract Address *"
            placeholder="0x..."
            inputType="text"
            value={form.tokenContract}
            handleChange={(e) => handleFormFieldChange('tokenContract', e)}
          />
          <FormField
            labelName="End Date *"
            placeholder="End Date"
            inputType="date"
            value={form.deadline}
            handleChange={(e) => handleFormFieldChange('deadline', e)}
          />
          <FormField
            labelName="Start Date *"
            placeholder="Start Date"
            inputType="date"
            value={form.startDate}
            handleChange={(e) => handleFormFieldChange('startDate', e)}
          />
        </div>

        <FormField
          labelName="Campaign image *"
          placeholder="Place image URL of your campaign"
          inputType="url"
          value={form.image}
          handleChange={(e) => handleFormFieldChange('image', e)}
        />
        {form.image && (
          <img
            src={form.image}
            alt="Preview"
            className="w-full max-w-md rounded-lg shadow mt-4"
            onError={(e) => (e.target.style.display = 'none')}
          />
        )}

        <FormField
          labelName="Location *"
          placeholder="Campaign Location"
          inputType="text"
          value={form.location}
          handleChange={(e) => handleFormFieldChange('location', e)}
        />
        <FormField
          labelName="Token Value in EUR *"
          placeholder="1"
          inputType="number"
          min="1"
          step="1"
          value={form.tokenValueInEUR}
          handleChange={(e) =>
            handleFormFieldChange('tokenValueInEUR', {
              target: { value: Math.round(Number(e.target.value)) || 1 },
            })
          }
        />

        <div className="flex justify-center items-center mt-[40px]">
          <CustomButton
            btnType="submit"
            title="Submit new campaign"
            styles="bg-[#FF751A] hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-lg transition-all duration-300"
          />
        </div>
      </form>
    </div>
  );
};

export default CreateCampaign;
