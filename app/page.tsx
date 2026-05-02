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
import Alert from '@mui/material/Alert';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';
import MuiLink from '@mui/material/Link';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/ru';
import Footer from '@/app/components/Footer';
import CityAutocomplete from '@/app/components/CityAutocomplete';
import api from '@/app/lib/api';
import { setToken } from '@/app/lib/auth';

const features = [
  { icon: '🌟', title: 'Натальная карта', desc: 'Полный разбор вашей карты рождения: планеты, дома, аспекты и интерпретация от ИИ' },
  { icon: '⚡', title: 'Транзиты и прогрессии', desc: 'Текущие планетарные влияния на вашу карту — прогнозы на любую дату' },
  { icon: '☀️', title: 'Соляр', desc: 'Карта года рождения: главные темы, возможности и вызовы на 12 месяцев' },
  { icon: '💕', title: 'Синастрия', desc: 'Астрологическая совместимость двух людей — полный анализ отношений' },
  { icon: '🌙', title: 'Гороскопы', desc: 'Персональные прогнозы на день, неделю и месяц на основе вашей натальной карты' },
  { icon: '💫', title: 'Циклы Венеры', desc: 'Циклы любви и денег: лучшие периоды для отношений, финансов и творчества' },
];

const tariffs = [
  { name: 'Старт', price: '299 ₽', credits: 500, desc: 'Попробуй все возможности', features: ['5 расчётов карт', 'Интерпретации от ИИ', 'История карт'], popular: false },
  { name: 'Базовый', price: '699 ₽', credits: 1500, desc: 'Для регулярного использования', features: ['15 расчётов карт', 'Интерпретации от ИИ', 'История карт', 'Синастрия'], popular: true },
  { name: 'Профи', price: '990 ₽', credits: 3000, desc: 'Максимум возможностей', features: ['30 расчётов карт', 'Интерпретации от ИИ', 'История карт', 'Синастрия', 'Приоритетный доступ'], popular: false },
];

const steps = ['Дата рождения', 'Место рождения', 'Готово', 'Получение карты'];

const stepperSx = {
  '& .MuiStepLabel-label': { color: '#A0A0C0', fontSize: 12 },
  '& .MuiStepLabel-label.Mui-active': { color: '#C4B5FD' },
  '& .MuiStepLabel-label.Mui-completed': { color: '#86EFAC' },
  '& .MuiStepIcon-root': { color: 'rgba(124,58,237,0.3)' },
  '& .MuiStepIcon-root.Mui-active': { color: '#7C3AED' },
  '& .MuiStepIcon-root.Mui-completed': { color: '#22C55E' },
};

export default function Home() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  // Step 1
  const [birthDate, setBirthDate] = useState<Dayjs | null>(null);
  const [birthTime, setBirthTime] = useState('');

  // Step 2
  const [birthPlace, setBirthPlace] = useState('');
  const [birthLat, setBirthLat] = useState<number | undefined>();
  const [birthLng, setBirthLng] = useState<number | undefined>();

  // Step 3
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/register', { name: name || 'Пользователь', email, password, password_confirmation: password });
      setToken(data.token);
      await api.post('/profiles', {
        name: name || 'Я',
        birth_date: birthDate ? birthDate.format('YYYY-MM-DD') : '',
        birth_time: birthTime ? birthTime + ':00' : null,
        birth_place: birthPlace || 'Не указано',
        lat: birthLat,
        lng: birthLng,
      });
      router.push('/dashboard/natal');
    } catch (err: any) {
      const errors = err.response?.data?.errors;
      setError(errors ? Object.values(errors).flat().join(', ') : err.response?.data?.message || 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
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

        {/* Wizard */}
        <Container maxWidth="sm">
          <Card sx={{ bgcolor: '#1A1033', border: '1px solid rgba(124,58,237,0.4)', borderRadius: 3, p: 1 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>✨ Построй свою натальную карту</Typography>

              <Stepper activeStep={step} alternativeLabel sx={{ mb: 4 }}>
                {steps.map(label => (
                  <Step key={label}>
                    <StepLabel sx={stepperSx}>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              {/* Step 1 */}
              {step === 0 && (
                <Box>
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid size={{ xs: 12, sm: 7 }}>
                      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
                        <DatePicker
                          label="Дата рождения"
                          value={birthDate}
                          onChange={(newValue) => setBirthDate(newValue)}
                          format="DD.MM.YYYY"
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              required: true,
                              sx: { '& .MuiOutlinedInput-root': { bgcolor: 'rgba(124,58,237,0.05)' } }
                            }
                          }}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 5 }}>
                      <TextField
                        label="Время рождения" type="time" fullWidth required
                        value={birthTime} onChange={e => setBirthTime(e.target.value)}
                        slotProps={{ inputLabel: { shrink: true } }}
                        sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'rgba(124,58,237,0.05)' } }}
                      />
                    </Grid>
                  </Grid>
                  <Button variant="contained" fullWidth size="large" disabled={!birthDate || !birthTime}
                    onClick={() => setStep(1)} sx={{ py: 1.5, fontWeight: 700 }}>
                    Далее →
                  </Button>
                </Box>
              )}

              {/* Step 2 — Place */}
              {step === 1 && (
                <Box>
                  <Box sx={{ mb: 3 }}>
                    <CityAutocomplete
                      value={birthPlace}
                      onChange={(city, lat, lng) => {
                        setBirthPlace(city);
                        setBirthLat(lat);
                        setBirthLng(lng);
                      }}
                      label="Город рождения"
                      required
                    />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button variant="outlined" fullWidth onClick={() => setStep(0)}
                      sx={{ borderColor: 'rgba(124,58,237,0.4)', color: '#C4B5FD' }}>
                      ← Назад
                    </Button>
                    <Button variant="contained" fullWidth size="large" disabled={!birthPlace}
                      onClick={() => setStep(2)} sx={{ py: 1.5, fontWeight: 700 }}>
                      Далее →
                    </Button>
                  </Box>
                </Box>
              )}

              {/* Step 3 — Chart Ready */}
              {step === 2 && (
                <Box>
                  <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography variant="h5" fontWeight={700} sx={{ mb: 2, color: '#C4B5FD' }}>
                      ✨ Ваша натальная карта готова!
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Создайте аккаунт, чтобы увидеть полную интерпретацию
                    </Typography>
                    <LinearProgress
                      sx={{
                        mb: 3,
                        height: 8,
                        borderRadius: 4,
                        bgcolor: 'rgba(124,58,237,0.2)',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: 'linear-gradient(90deg, #7C3AED, #C4B5FD)',
                          background: 'linear-gradient(90deg, #7C3AED, #C4B5FD)',
                        }
                      }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button variant="outlined" onClick={() => setStep(1)}
                      sx={{ borderColor: 'rgba(124,58,237,0.4)', color: '#C4B5FD', minWidth: 90 }}>
                      ← Назад
                    </Button>
                    <Button variant="contained" fullWidth size="large"
                      onClick={() => setStep(3)} sx={{ py: 1.5, fontWeight: 700 }}>
                      Посмотреть карту →
                    </Button>
                  </Box>
                </Box>
              )}

              {/* Step 4 — Registration */}
              {step === 3 && (
                <Box>
                  {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
                    <TextField label="Ваше имя" fullWidth value={name} onChange={e => setName(e.target.value)}
                      sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'rgba(124,58,237,0.05)' } }} />
                    <TextField label="Email" type="email" fullWidth required value={email} onChange={e => setEmail(e.target.value)}
                      sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'rgba(124,58,237,0.05)' } }} />
                    <TextField label="Пароль" type="password" fullWidth required value={password} onChange={e => setPassword(e.target.value)}
                      sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'rgba(124,58,237,0.05)' } }} />
                  </Box>
                  <FormControlLabel
                    control={<Checkbox checked={consent} onChange={e => setConsent(e.target.checked)} size="small"
                      sx={{ color: '#7C3AED', '&.Mui-checked': { color: '#7C3AED' } }} />}
                    label={
                      <Typography variant="body2" color="text.secondary" textAlign="left">
                        Я даю согласие на{' '}
                        <MuiLink component={Link} href="/privacy" sx={{ color: '#9F67FF' }}>обработку персональных данных</MuiLink>
                        {' '}и принимаю{' '}
                        <MuiLink component={Link} href="/terms" sx={{ color: '#9F67FF' }}>пользовательское соглашение</MuiLink>
                      </Typography>
                    }
                    sx={{ alignItems: 'flex-start', mb: 2 }}
                  />
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button variant="outlined" onClick={() => setStep(1)}
                      sx={{ borderColor: 'rgba(124,58,237,0.4)', color: '#C4B5FD', minWidth: 90 }}>
                      ← Назад
                    </Button>
                    <Button variant="contained" fullWidth size="large"
                      disabled={!email || !password || !consent || loading}
                      onClick={handleRegister} sx={{ py: 1.5, fontWeight: 700 }}>
                      {loading ? <CircularProgress size={24} color="inherit" /> : '🌟 Получить натальную карту'}
                    </Button>
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
                    🎁 200 кредитов бесплатно · Уже есть аккаунт?{' '}
                    <MuiLink component={Link} href="/login" sx={{ color: '#9F67FF' }}>Войти</MuiLink>
                  </Typography>
                </Box>
              )}

            </CardContent>
          </Card>
        </Container>
      </Box>

      {/* Features */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Typography variant="h4" fontWeight={700} textAlign="center" sx={{ mb: 2 }}>Всё что нужно для астрологического анализа</Typography>
        <Typography color="text.secondary" textAlign="center" sx={{ mb: 7, maxWidth: 500, mx: 'auto' }}>
          Точные расчёты астрологических карт и интерпретации от искусственного интеллекта
        </Typography>
        <Grid container spacing={3}>
          {features.map(f => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={f.title}>
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
        <Typography variant="h4" fontWeight={700} textAlign="center" sx={{ mb: 2 }}>Тарифы</Typography>
        <Typography color="text.secondary" textAlign="center" sx={{ mb: 7 }}>
          Один кредит — один расчёт карты. Без подписки, платишь только за то, что используешь.
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          {tariffs.map(t => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={t.name}>
              <Card sx={{ bgcolor: t.popular ? 'rgba(124,58,237,0.15)' : '#1A1033', border: t.popular ? '2px solid #7C3AED' : '1px solid rgba(124,58,237,0.2)', borderRadius: 3, height: '100%', position: 'relative' }}>
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
                  <Button component={Link} href="/register" variant={t.popular ? 'contained' : 'outlined'} fullWidth size="large"
                    sx={t.popular ? {} : { borderColor: '#7C3AED', color: '#C4B5FD' }}>
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
