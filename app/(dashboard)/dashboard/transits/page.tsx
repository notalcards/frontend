'use client';

import { useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import ProfileSelector from '@/app/components/ProfileSelector';
import ChartResult from '@/app/components/ChartResult';
import api from '@/app/lib/api';

interface ChartData { id: number; interpretation: string; created_at: string; profile?: { name: string } }

export default function TransitsPage() {
  const [profileId, setProfileId] = useState<number | ''>('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [chart, setChart] = useState<ChartData | null>(null);

  const handleGenerate = async () => {
    if (!profileId) { setError('Выберите профиль'); return; }
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/charts/generate', { type: 'transit', profile_id: profileId, transit_date: date });
      setChart(data);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Ошибка при получении транзитов');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={1}>⚡ Транзиты</Typography>
      <Typography color="text.secondary" mb={3}>Текущие и будущие планетарные транзиты на натальную карту</Typography>

      <Card>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <ProfileSelector value={profileId} onChange={setProfileId} />
          <TextField label="Дата транзита" type="date" value={date} onChange={(e) => setDate(e.target.value)} slotProps={{ inputLabel: { shrink: true } }} fullWidth />
          <Box display="flex" alignItems="center" gap={2}>
            <Button variant="contained" size="large" onClick={handleGenerate} disabled={loading || !profileId} sx={{ minWidth: 200 }}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Рассчитать транзиты'}
            </Button>
            <Chip label="💎 100 кредитов" size="small" sx={{ bgcolor: 'rgba(124,58,237,0.15)', color: '#C4B5FD' }} />
          </Box>
          {error && <Alert severity="error">{error}</Alert>}
        </CardContent>
      </Card>

      {chart && (
        <ChartResult title="⚡ Транзиты" profileName={chart.profile?.name} interpretation={chart.interpretation} createdAt={chart.created_at} />
      )}
    </Box>
  );
}
