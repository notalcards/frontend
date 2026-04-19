'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Link from 'next/link';

const features = [
  '🌟 Натальная карта',
  '🌙 Гороскопы',
  '⚡ Транзиты и прогрессии',
  '☀️ Соляр',
  '💕 Синастрия',
  '💫 Циклы Венеры',
];

export default function Home() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at top, #2D1B69 0%, #0F0A1E 60%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        px: 3,
        textAlign: 'center',
      }}
    >
      {/* Stars decoration */}
      <Typography sx={{ fontSize: 64, mb: 2, lineHeight: 1 }}>🔮</Typography>

      <Typography
        variant="h2"
        sx={{
          fontWeight: 800,
          background: 'linear-gradient(135deg, #C4B5FD 0%, #7C3AED 50%, #9F67FF 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 2,
        }}
      >
        NatalCharts
      </Typography>

      <Typography
        variant="h5"
        color="text.secondary"
        sx={{ mb: 1, maxWidth: 560 }}
      >
        Ваш персональный астрологический советник
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 5, maxWidth: 480, opacity: 0.7 }}>
        Рассчитайте натальную карту, получите прогнозы транзитов, прогрессий и многое другое
        на основе точных астрологических данных
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', mb: 6 }}>
        {features.map((f) => (
          <Chip
            key={f}
            label={f}
            sx={{
              bgcolor: 'rgba(124,58,237,0.15)',
              border: '1px solid rgba(124,58,237,0.3)',
              color: '#C4B5FD',
            }}
          />
        ))}
      </Box>

      <Stack direction="row" spacing={2}>
        <Button
          component={Link}
          href="/login"
          variant="outlined"
          size="large"
          sx={{ px: 4, borderColor: '#7C3AED', color: '#C4B5FD' }}
        >
          Войти
        </Button>
        <Button
          component={Link}
          href="/register"
          variant="contained"
          size="large"
          sx={{ px: 4 }}
        >
          Зарегистрироваться
        </Button>
      </Stack>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 4, opacity: 0.5 }}>
        🎁 200 кредитов бесплатно при регистрации
      </Typography>
    </Box>
  );
}
