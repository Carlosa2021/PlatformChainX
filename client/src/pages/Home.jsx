import { DisplayCampaigns } from '../components';
import { useStateContext } from '../context';
import Banner from '../components/Banner';
import Footer from '../components/Footer';

const Home = () => {
  const { campaigns, isLoading } = useStateContext(); // NO USAMOS getCampaigns

  return (
    <div className="min-h-screen flex flex-col">
      {/* Banner */}
      <Banner />

      {/* Contenido principal */}
      <div className="flex-1">
        <DisplayCampaigns isLoading={isLoading} campaigns={campaigns} />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
