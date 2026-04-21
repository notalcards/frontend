'use client';

import { useState } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import ProfileSelector from '@/app/components/ProfileSelector';
import ChartResult from '@/app/components/ChartResult';
import api from '@/app/lib/api';

interface ChartData {
  id: number;
  interpretation: string;
  created_at: string;
  profile?: { name: string };
}

export default function NatalPage() {
  const [profileId, setProfileId] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [chart, setChart] = useState<ChartData | null>(null);

  const handleGenerate = async () => {
    if (!profileId) { setError('Выберите профиль'); return; }
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/charts/generate', { type: 'natal', profile_id: profileId });
      setChart(data.chart ?? data);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Ошибка при построении карты');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={1}>🌟 Натальная карта</Typography>
      <Typography color="text.secondary" mb={3}>
        Построение индивидуальной натальной карты по дате, времени и месту рождения
      </Typography>

      <Card>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <ProfileSelector value={profileId} onChange={setProfileId} />

          <Box display="flex" alignItems="center" gap={2}>
            <Button
              variant="contained"
              size="large"
              onClick={handleGenerate}
              disabled={loading || !profileId}
              sx={{ minWidth: 200 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Построить карту'}
            </Button>
            <Chip label="💎 100 кредитов" size="small" sx={{ bgcolor: 'rgba(124,58,237,0.15)', color: '#C4B5FD' }} />
          </Box>

          {error && <Alert severity="error">{error}</Alert>}
        </CardContent>
      </Card>

      {/* Decorative zodiac wheel */}
      {!chart && !loading && (
        <Box sx={{ textAlign: 'center', mt: 6, opacity: 0.3 }}>
          <svg width="240" height="240" viewBox="0 0 240 240">
            <circle cx="120" cy="120" r="110" fill="none" stroke="#7C3AED" strokeWidth="1" />
            <circle cx="120" cy="120" r="80" fill="none" stroke="#7C3AED" strokeWidth="0.5" />
            <circle cx="120" cy="120" r="50" fill="none" stroke="#7C3AED" strokeWidth="0.5" />
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i * 30 - 90) * (Math.PI / 180);
              return (
                <line
                  key={i}
                  x1={120 + 50 * Math.cos(angle)}
                  y1={120 + 50 * Math.sin(angle)}
                  x2={120 + 110 * Math.cos(angle)}
                  y2={120 + 110 * Math.sin(angle)}
                  stroke="#7C3AED"
                  strokeWidth="0.5"
                />
              );
            })}
            <text x="120" y="126" textAnchor="middle" fill="#7C3AED" fontSize="14">♈♉♊♋♌♍</text>
          </svg>
        </Box>
      )}

      {chart && (
        <ChartResult
          title="🌟 Натальная карта"
          profileName={chart.profile?.name}
          interpretation={chart.interpretation}
          createdAt={chart.created_at}
        />
      )}
    </Box>
  );
}
