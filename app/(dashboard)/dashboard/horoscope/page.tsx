'use client';

import { useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import ProfileSelector from '@/app/components/ProfileSelector';
import ChartResult from '@/app/components/ChartResult';
import api from '@/app/lib/api';

const TABS = [
  { label: 'Ежедневный', type: 'daily' },
  { label: 'Еженедельный', type: 'weekly' },
  { label: 'Ежемесячный', type: 'monthly' },
];

interface ChartData { id: number; interpretation: string; created_at: string; profile?: { name: string } }

export default function HoroscopePage() {
  const [tab, setTab] = useState(0);
  const [profileId, setProfileId] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [chart, setChart] = useState<ChartData | null>(null);

  const handleGenerate = async () => {
    if (!profileId) { setError('Выберите профиль'); return; }
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/charts/generate', { type: 'monthly', profile_id: profileId, period: TABS[tab].type });
      setChart(data);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Ошибка при получении прогноза');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={1}>🌙 Гороскопы</Typography>
      <Typography color="text.secondary" mb={3}>Персональные прогнозы на основе вашей натальной карты</Typography>

      <Tabs value={tab} onChange={(_, v) => { setTab(v); setChart(null); }} sx={{ mb: 3 }}>
        {TABS.map((t, i) => <Tab key={i} label={t.label} />)}
      </Tabs>

      <Card>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <ProfileSelector value={profileId} onChange={setProfileId} />
          <Box display="flex" alignItems="center" gap={2}>
            <Button variant="contained" size="large" onClick={handleGenerate} disabled={loading || !profileId} sx={{ minWidth: 200 }}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Получить прогноз'}
            </Button>
            <Chip label="💎 100 кредитов" size="small" sx={{ bgcolor: 'rgba(124,58,237,0.15)', color: '#C4B5FD' }} />
          </Box>
          {error && <Alert severity="error">{error}</Alert>}
        </CardContent>
      </Card>

      {chart && (
        <ChartResult
          title={`🌙 ${TABS[tab].label} прогноз`}
          profileName={chart.profile?.name}
          interpretation={chart.interpretation}
          createdAt={chart.created_at}
        />
      )}
    </Box>
  );
}
