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

export default function SolarPage() {
  const [profileId, setProfileId] = useState<number | ''>('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [chart, setChart] = useState<ChartData | null>(null);

  const handleGenerate = async () => {
    if (!profileId) { setError('Выберите профиль'); return; }
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/charts/generate', { type: 'solar', profile_id: profileId, year: parseInt(year) });
      setChart(data);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Ошибка при построении соляра');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={1}>☀️ Соляр</Typography>
      <Typography color="text.secondary" mb={3}>Солнечное возвращение — карта на год от одного дня рождения до другого</Typography>

      <Card>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <ProfileSelector value={profileId} onChange={setProfileId} />
          <TextField label="Год" type="number" value={year} onChange={(e) => setYear(e.target.value)} inputProps={{ min: 1900, max: 2100 }} fullWidth />
          <Box display="flex" alignItems="center" gap={2}>
            <Button variant="contained" size="large" onClick={handleGenerate} disabled={loading || !profileId} sx={{ minWidth: 200 }}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Построить соляр'}
            </Button>
            <Chip label="💎 100 кредитов" size="small" sx={{ bgcolor: 'rgba(124,58,237,0.15)', color: '#C4B5FD' }} />
          </Box>
          {error && <Alert severity="error">{error}</Alert>}
        </CardContent>
      </Card>

      {chart && (
        <ChartResult title="☀️ Соляр" profileName={chart.profile?.name} interpretation={chart.interpretation} createdAt={chart.created_at} />
      )}
    </Box>
  );
}
