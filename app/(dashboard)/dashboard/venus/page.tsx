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
import api from '@/app/lib/api';

interface ChartData { id: number; interpretation: string; created_at: string; profile?: { name: string } }

export default function VenusPage() {
  const [profileId, setProfileId] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [chart, setChart] = useState<ChartData | null>(null);

  const handleGenerate = async () => {
    if (!profileId) { setError('Выберите профиль'); return; }
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/charts/generate', { type: 'venus', profile_id: profileId });
      setChart(data);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Ошибка при расчёте циклов Венеры');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={1}>💕 Циклы Венеры</Typography>
      <Typography color="text.secondary" mb={3}>Venus Love & Money Cycles — циклы любви и денег</Typography>

      <Card>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <ProfileSelector value={profileId} onChange={setProfileId} />
          <Box display="flex" alignItems="center" gap={2}>
            <Button variant="contained" size="large" onClick={handleGenerate} disabled={loading || !profileId} sx={{ minWidth: 200 }}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Рассчитать циклы'}
            </Button>
            <Chip label="💎 100 кредитов" size="small" sx={{ bgcolor: 'rgba(124,58,237,0.15)', color: '#C4B5FD' }} />
          </Box>
          {error && <Alert severity="error">{error}</Alert>}
        </CardContent>
      </Card>

      {chart && (
        <ChartResult title="💕 Циклы Венеры" profileName={chart.profile?.name} interpretation={chart.interpretation} createdAt={chart.created_at} />
      )}
    </Box>
  );
}
