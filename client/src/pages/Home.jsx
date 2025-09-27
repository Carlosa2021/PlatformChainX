import { DisplayCampaigns } from '../components';
import { useStateContext } from '../context/SimpleContext';
import Banner from '../components/Banner';
import Footer from '../components/Footer';

const Home = () => {
  const { campaigns, loading } = useStateContext(); // Usar loading en lugar de isLoading

  return (
    <div className="min-h-screen flex flex-col">
      {/* Banner */}
      <Banner />

      {/* Contenido principal */}
      <div className="flex-1">
        <DisplayCampaigns isLoading={loading} campaigns={campaigns} />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
