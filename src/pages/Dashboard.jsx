import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import PurchasesTab from '../components/dashboard/PurchasesTab';
import LicensesTab from '../components/dashboard/LicensesTab';
import SettingsTab from '../components/dashboard/SettingsTab';
import SupportTab from '../components/dashboard/SupportTab';
import { useAuthStore } from '../store/useStore';

export default function Dashboard({ darkMode, setDarkMode }) {
  const [activeTab, setActiveTab] = useState('purchases');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#0A1628]' : 'bg-[#F8FAFC]'}`}>
      <DashboardHeader
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        user={user}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex">
        <DashboardSidebar
          darkMode={darkMode}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className={`flex-1 lg:ml-[260px] pt-[70px] min-h-screen transition-all duration-300`}>
          <div className="p-6 lg:p-8 max-w-[1400px] mx-auto">
            {activeTab === 'purchases' && <PurchasesTab darkMode={darkMode} />}
            {activeTab === 'licenses' && <LicensesTab darkMode={darkMode} />}
            {activeTab === 'settings' && <SettingsTab darkMode={darkMode} user={user} />}
            {activeTab === 'support' && <SupportTab darkMode={darkMode} />}
          </div>
        </main>
      </div>
    </div>
  );
}
