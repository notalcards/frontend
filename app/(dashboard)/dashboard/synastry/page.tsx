'use client';

import { useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import ProfileSelector from '@/app/components/ProfileSelector';
import ChartResult from '@/app/components/ChartResult';
import PreviousCharts from '@/app/components/PreviousCharts';
import api from '@/app/lib/api';

interface ChartData { id: number; interpretation: string; created_at: string; profile?: { name: string } }

export default function SynastryPage() {
  const [profileId1, setProfileId1] = useState<number | ''>('');
  const [profileId2, setProfileId2] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [chart, setChart] = useState<ChartData | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleGenerate = async () => {
    if (!profileId1 || !profileId2) { setError('Выберите оба профиля'); return; }
    if (profileId1 === profileId2) { setError('Выберите два разных профиля'); return; }
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/charts/generate', { type: 'synastry', profile_id: profileId1, profile_id2: profileId2 });
      setChart(data);
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Ошибка при расчёте синастрии');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={1}>💑 Синастрия</Typography>
      <Typography color="text.secondary" mb={3}>Сравнение двух натальных карт — анализ совместимости</Typography>

      <Card>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <ProfileSelector value={profileId1} onChange={setProfileId1} label="Первый профиль" />
          <ProfileSelector value={profileId2} onChange={setProfileId2} label="Второй профиль" />

          <Box display="flex" alignItems="center" gap={2}>
            <Button variant="contained" size="large" onClick={handleGenerate} disabled={loading || !profileId1 || !profileId2} sx={{ minWidth: 200 }}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Рассчитать синастрию'}
            </Button>
            <Chip label="💎 100 кредитов" size="small" sx={{ bgcolor: 'rgba(124,58,237,0.15)', color: '#C4B5FD' }} />
          </Box>
          {error && <Alert severity="error">{error}</Alert>}
        </CardContent>
      </Card>

      {chart && (
        <ChartResult title="💑 Синастрия" interpretation={chart.interpretation} createdAt={chart.created_at} />
      )}

      <PreviousCharts type="synastry" title="📚 Предыдущие синастрии" key={refreshKey} />
    </Box>
  );
}
