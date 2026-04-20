'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import api from '@/app/lib/api';

interface Tariff {
  name: string;
  credits: number;
  amount: number;
  description: string;
}

interface Tariffs {
  start: Tariff;
  base: Tariff;
  pro: Tariff;
}

const TARIFF_ICONS: Record<string, string> = {
  start: '🌱',
  base: '⭐',
  pro: '🔥',
};

const TARIFF_POPULAR: Record<string, boolean> = {
  start: false,
  base: true,
  pro: false,
};

export default function CreditsPage() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');

  const [tariffs, setTariffs] = useState<Tariffs | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedTariff, setSelectedTariff] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    api.get('/payments/tariffs').then(({ data }) => setTariffs(data));
    api.get('/me').then(({ data }) => setCredits(data.credits));
  }, []);

  const handleBuy = async (tariffKey: string) => {
    setError('');
    setLoading(true);
    setSelectedTariff(tariffKey);
    try {
      const { data } = await api.post('/payments/create', { tariff: tariffKey });
      window.location.href = data.confirmation_url;
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Ошибка при создании платежа');
      setLoading(false);
      setSelectedTariff(null);
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={1}>💎 Кредиты</Typography>
      <Typography color="text.secondary" mb={3}>
        Каждое действие (натальная карта, прогноз и т.д.) стоит 100 кредитов
      </Typography>

      {status === 'success' && (
        <Alert severity="success" sx={{ mb: 3 }}>
          ✅ Оплата прошла успешно! Кредиты будут зачислены в течение нескольких секунд.
        </Alert>
      )}

      {credits !== null && (
        <Card sx={{ mb: 4, background: 'linear-gradient(135deg, #4C1D95 0%, #7C3AED 100%)' }}>
          <CardContent sx={{ py: 2.5 }}>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>Текущий баланс</Typography>
            <Typography variant="h3" fontWeight={800}>💎 {credits}</Typography>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              кредитов · хватит на {Math.floor(credits / 100)} действий
            </Typography>
          </CardContent>
        </Card>
      )}

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {!tariffs ? (
        <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
          {(Object.entries(tariffs) as [string, Tariff][]).map(([key, t]) => (
            <Card
              key={key}
              sx={{
                position: 'relative',
                border: TARIFF_POPULAR[key] ? '2px solid #7C3AED' : '1px solid rgba(124,58,237,0.2)',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)' },
              }}
            >
              {TARIFF_POPULAR[key] && (
                <Box sx={{
                  position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
                  bgcolor: '#7C3AED', color: '#fff', px: 2, py: 0.5,
                  borderRadius: 10, fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap',
                }}>
                  Популярный
                </Box>
              )}
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h2" sx={{ mb: 1 }}>{TARIFF_ICONS[key]}</Typography>
                <Typography variant="h6" fontWeight={700} mb={0.5}>{t.name}</Typography>

                <Typography variant="h3" fontWeight={800} color="primary" mb={0.5}>
                  {t.amount} ₽
                </Typography>

                <Divider sx={{ my: 2, borderColor: 'rgba(124,58,237,0.2)' }} />

                <Chip
                  label={`💎 ${t.credits.toLocaleString('ru-RU')} кредитов`}
                  sx={{ bgcolor: 'rgba(124,58,237,0.15)', color: '#C4B5FD', mb: 1 }}
                />
                <Typography variant="body2" color="text.secondary" mb={2}>
                  = {Math.floor(t.credits / 100)} действий · {(t.amount / t.credits * 100).toFixed(1)} ₽/действие
                </Typography>

                <Button
                  variant={TARIFF_POPULAR[key] ? 'contained' : 'outlined'}
                  fullWidth
                  size="large"
                  onClick={() => handleBuy(key)}
                  disabled={loading}
                  sx={!TARIFF_POPULAR[key] ? { borderColor: '#7C3AED', color: '#C4B5FD' } : {}}
                >
                  {loading && selectedTariff === key
                    ? <CircularProgress size={22} color="inherit" />
                    : 'Купить'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <Typography variant="body2" color="text.secondary" mt={4} textAlign="center">
        Оплата через ЮКассу · Visa, Mastercard, МИР, СБП, ЮMoney
      </Typography>
    </Box>
  );
}
