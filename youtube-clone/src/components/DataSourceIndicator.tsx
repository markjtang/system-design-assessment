import { useEffect, useState } from 'react';
import { DataService } from '../services/dataService';
import { API_CONFIG } from '../config/api';
import '../styles/components/DataSourceIndicator.css';

const DataSourceIndicator = () => {
  const [apiHealthy, setApiHealthy] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const checkApiHealth = async () => {
      if (!API_CONFIG.USE_API) {
        setApiHealthy(null);
        return;
      }

      setChecking(true);
      try {
        const healthy = await DataService.checkApiHealth();
        setApiHealthy(healthy);
      } catch (error) {
        setApiHealthy(false);
      } finally {
        setChecking(false);
      }
    };

    checkApiHealth();
  }, []);

  const getStatusInfo = () => {
    if (!API_CONFIG.USE_API) {
      return {
        text: 'Using Mock Data',
        icon: '💾',
        className: 'mock-data',
        description: 'Currently using local mock data'
      };
    }

    if (checking) {
      return {
        text: 'Checking API...',
        icon: '⏳',
        className: 'checking',
        description: 'Checking API connection'
      };
    }

    if (apiHealthy) {
      return {
        text: 'API Connected',
        icon: '🟢',
        className: 'api-connected',
        description: 'Connected to backend API'
      };
    } else {
      return {
        text: 'API Offline (Using Mock Data)',
        icon: '🔴',
        className: 'api-offline',
        description: 'API unavailable, using fallback mock data'
      };
    }
  };

  const status = getStatusInfo();

  return (
    <div className={`data-source-indicator ${status.className}`} title={status.description}>
      <span className="status-icon">{status.icon}</span>
      <span className="status-text">{status.text}</span>
    </div>
  );
};

export default DataSourceIndicator; 