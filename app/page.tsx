'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Divider from '@mui/material/Divider';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Footer from '@/app/components/Footer';

const features = [
  {
    icon: '🌟',
    title: 'Натальная карта',
    desc: 'Полный разбор вашей карты рождения: планеты, дома, аспекты и детальная интерпретация от ИИ',
  },
  {
    icon: '⚡',
    title: 'Транзиты и прогрессии',
    desc: 'Текущие планетарные влияния на вашу карту — прогнозы на любую дату',
  },
  {
    icon: '☀️',
    title: 'Соляр',
    desc: 'Карта года рождения: главные темы, возможности и вызовы на ближайшие 12 месяцев',
  },
  {
    icon: '💕',
    title: 'Синастрия',
    desc: 'Астрологическая совместимость двух людей — полный анализ отношений',
  },
  {
    icon: '🌙',
    title: 'Гороскопы',
    desc: 'Персональные прогнозы на день, неделю и месяц на основе вашей натальной карты',
  },
  {
    icon: '💫',
    title: 'Циклы Венеры',
    desc: 'Циклы любви и денег: лучшие периоды для отношений, финансов и творчества',
  },
];

const tariffs = [
  {
    name: 'Старт',
    price: '299 ₽',
    credits: 500,
    desc: 'Попробуй все возможности',
    features: ['5 расчётов карт', 'Интерпретации от ИИ', 'История карт'],
    popular: false,
  },
  {
    name: 'Базовый',
    price: '699 ₽',
    credits: 1500,
    desc: 'Для регулярного использования',
    features: ['15 расчётов карт', 'Интерпретации от ИИ', 'История карт', 'Синастрия'],
    popular: true,
  },
  {
    name: 'Профи',
    price: '990 ₽',
    credits: 3000,
    desc: 'Максимум возможностей',
    features: ['30 расчётов карт', 'Интерпретации от ИИ', 'История карт', 'Синастрия', 'Приоритетный доступ'],
    popular: false,
  },
];

const steps = ['Дата и время рождения', 'Место рождения', 'Готово'];

export default function Home() {
  const router = useRouter();
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');

  const handleStart = () => {
    router.push(`/register?date=${birthDate}&time=${birthTime}`);
  };

  return (
    <Box sx={{ bgcolor: '#0F0A1E', minHeight: '100vh', color: '#E2E0F0' }}>

      {/* Header */}
      <Box sx={{ borderBottom: '1px solid rgba(124,58,237,0.2)', px: 4, py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography fontWeight={800} sx={{ background: 'linear-gradient(135deg,#C4B5FD,#7C3AED)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: 20 }}>
          🔮 NatalCharts
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button component={Link} href="/login" sx={{ color: '#C4B5FD' }}>Войти</Button>
          <Button component={Link} href="/register" variant="contained" size="small">Регистрация</Button>
        </Box>
      </Box>

      {/* Hero */}
      <Box sx={{ textAlign: 'center', pt: { xs: 8, md: 12 }, pb: 8, px: 3, background: 'radial-gradient(ellipse at top, #2D1B69 0%, #0F0A1E 60%)' }}>
        <Typography variant="body2" sx={{ color: '#C4B5FD', mb: 2, opacity: 0.8, letterSpacing: 2, textTransform: 'uppercase', fontSize: 13 }}>
          Более 300 000 пользователей доверяют нам
        </Typography>
        <Typography variant="h2" fontWeight={800} sx={{ background: 'linear-gradient(135deg,#C4B5FD 0%,#7C3AED 50%,#9F67FF 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 3, fontSize: { xs: 36, md: 60 }, lineHeight: 1.1 }}>
          Узнай, что звёзды<br />говорят о тебе
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 560, mx: 'auto', mb: 6, fontWeight: 400 }}>
          Персональные астрологические карты и прогнозы на основе точных расчётов и анализа ИИ
        </Typography>

        {/* Step-by-step start */}
        <Container maxWidth="sm">
          <Card sx={{ bgcolor: '#1A1033', border: '1px solid rgba(124,58,237,0.4)', borderRadius: 3, p: 1 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
                ✨ Построй свою натальную карту
              </Typography>
              <Stepper activeStep={0} alternativeLabel sx={{ mb: 4 }}>
                {steps.map(label => (
                  <Step key={label}>
                    <StepLabel sx={{
                      '& .MuiStepLabel-label': { color: '#A0A0C0', fontSize: 12 },
                      '& .MuiStepIcon-root': { color: 'rgba(124,58,237,0.3)' },
                      '& .MuiStepIcon-root.Mui-active': { color: '#7C3AED' },
                    }}>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={7}>
                  <TextField
                    label="Дата рождения"
                    type="date"
                    fullWidth
                    value={birthDate}
                    onChange={e => setBirthDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'rgba(124,58,237,0.05)' } }}
                  />
                </Grid>
                <Grid item xs={12} sm={5}>
                  <TextField
                    label="Время рождения"
                    type="time"
                    fullWidth
                    value={birthTime}
                    onChange={e => setBirthTime(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    helperText="Необязательно"
                    sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'rgba(124,58,237,0.05)' } }}
                  />
                </Grid>
              </Grid>
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleStart}
                sx={{ py: 1.5, fontSize: 16, fontWeight: 700 }}
              >
                Продолжить →
              </Button>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
                🎁 200 кредитов бесплатно при регистрации
              </Typography>
            </CardContent>
          </Card>
        </Container>
      </Box>

      {/* Features */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Typography variant="h4" fontWeight={700} textAlign="center" sx={{ mb: 2 }}>
          Всё что нужно для астрологического анализа
        </Typography>
        <Typography color="text.secondary" textAlign="center" sx={{ mb: 7, maxWidth: 500, mx: 'auto' }}>
          Точные расчёты астрологических карт и интерпретации от искусственного интеллекта
        </Typography>
        <Grid container spacing={3}>
          {features.map(f => (
            <Grid item xs={12} sm={6} md={4} key={f.title}>
              <Card sx={{ bgcolor: '#1A1033', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 3, height: '100%', transition: 'border-color .2s', '&:hover': { borderColor: 'rgba(124,58,237,0.5)' } }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography sx={{ fontSize: 36, mb: 2, lineHeight: 1 }}>{f.icon}</Typography>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>{f.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{f.desc}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Divider sx={{ borderColor: 'rgba(124,58,237,0.15)' }} />

      {/* Tariffs */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Typography variant="h4" fontWeight={700} textAlign="center" sx={{ mb: 2 }}>
          Тарифы
        </Typography>
        <Typography color="text.secondary" textAlign="center" sx={{ mb: 7 }}>
          Один кредит — один расчёт карты. Без подписки, платишь только за то, что используешь.
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          {tariffs.map(t => (
            <Grid item xs={12} sm={6} md={4} key={t.name}>
              <Card sx={{
                bgcolor: t.popular ? 'rgba(124,58,237,0.15)' : '#1A1033',
                border: t.popular ? '2px solid #7C3AED' : '1px solid rgba(124,58,237,0.2)',
                borderRadius: 3,
                height: '100%',
                position: 'relative',
              }}>
                {t.popular && (
                  <Box sx={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', bgcolor: '#7C3AED', color: '#fff', px: 2, py: 0.5, borderRadius: 10, fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' }}>
                    Популярный
                  </Box>
                )}
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>{t.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{t.desc}</Typography>
                  <Typography variant="h3" fontWeight={800} sx={{ my: 3, color: '#C4B5FD' }}>{t.price}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>💎 {t.credits} кредитов</Typography>
                  <Divider sx={{ borderColor: 'rgba(124,58,237,0.2)', mb: 3 }} />
                  <Box sx={{ textAlign: 'left', mb: 4 }}>
                    {t.features.map(feat => (
                      <Typography key={feat} variant="body2" sx={{ mb: 1 }}>✅ {feat}</Typography>
                    ))}
                  </Box>
                  <Button
                    component={Link}
                    href="/register"
                    variant={t.popular ? 'contained' : 'outlined'}
                    fullWidth
                    size="large"
                    sx={t.popular ? {} : { borderColor: '#7C3AED', color: '#C4B5FD' }}
                  >
                    Начать
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Footer />

    </Box>
  );
}
