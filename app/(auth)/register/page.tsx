'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/app/lib/api';
import { setToken } from '@/app/lib/auth';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.password_confirmation) {
      setError('Пароли не совпадают');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/register', form);
      setToken(data.token);
      router.push('/dashboard/natal');
    } catch (err: unknown) {
      const errors = (err as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } })?.response?.data;
      if (errors?.errors) {
        setError(Object.values(errors.errors).flat().join(', '));
      } else {
        setError(errors?.message || 'Ошибка регистрации');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at top, #2D1B69 0%, #0F0A1E 60%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        py: 4,
      }}
    >
      <Card sx={{ width: '100%', maxWidth: 440 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight={700} textAlign="center" mb={1}>
            🔮 Регистрация
          </Typography>

          <Box textAlign="center" mb={3}>
            <Chip
              label="🎁 200 кредитов бесплатно при регистрации"
              sx={{ bgcolor: 'rgba(124,58,237,0.2)', color: '#C4B5FD', border: '1px solid rgba(124,58,237,0.4)' }}
            />
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Имя" value={form.name} onChange={handleChange('name')} required fullWidth />
            <TextField label="Email" type="email" value={form.email} onChange={handleChange('email')} required fullWidth />
            <TextField label="Пароль" type="password" value={form.password} onChange={handleChange('password')} required fullWidth />
            <TextField label="Подтвердите пароль" type="password" value={form.password_confirmation} onChange={handleChange('password_confirmation')} required fullWidth />
            <Button type="submit" variant="contained" size="large" fullWidth disabled={loading}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Создать аккаунт'}
            </Button>
          </Box>

          <Typography textAlign="center" mt={3} color="text.secondary">
            Уже есть аккаунт?{' '}
            <Link href="/login" style={{ color: '#9F67FF' }}>
              Войти
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
