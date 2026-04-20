'use client';

import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import api from '@/app/lib/api';

interface Profile {
  id: number;
  name: string;
  birth_date: string;
  birth_time: string | null;
  birth_place: string;
  is_default: boolean;
}

const emptyForm = { name: '', birth_date: '', birth_time: '', birth_place: '' };

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const load = () => api.get('/profiles').then(({ data }) => setProfiles(data.data ?? data));

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/profiles', {
        name: form.name,
        birth_date: form.birth_date,
        birth_time: form.birth_time ? form.birth_time + ':00' : null,
        birth_place: form.birth_place,
      });
      setForm(emptyForm);
      setShowForm(false);
      setSuccess('Профиль создан');
      load();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      const msg = err.response?.data?.message || Object.values(err.response?.data?.errors || {}).flat().join(', ');
      setError(msg || 'Ошибка при создании профиля');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить профиль?')) return;
    try {
      await api.delete(`/profiles/${id}`);
      load();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Ошибка');
    }
  };

  const handleSetDefault = async (id: number) => {
    await api.post(`/profiles/${id}/default`);
    load();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>👤 Профили рождения</Typography>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={() => setShowForm(!showForm)}
        >
          Добавить профиль
        </Button>
      </Box>

      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {showForm && (
        <Card sx={{ mb: 3, bgcolor: '#1A1033', border: '1px solid rgba(124,58,237,0.3)' }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>Новый профиль</Typography>
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Имя (например: Я, Мама, Иван)"
                    fullWidth required
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Место рождения (город)"
                    fullWidth required
                    value={form.birth_place}
                    onChange={e => setForm({ ...form, birth_place: e.target.value })}
                    placeholder="Москва"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Дата рождения"
                    type="date"
                    fullWidth required
                    value={form.birth_date}
                    onChange={e => setForm({ ...form, birth_date: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Время рождения (необязательно)"
                    type="time"
                    fullWidth
                    value={form.birth_time}
                    onChange={e => setForm({ ...form, birth_time: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    helperText="Если не знаете — оставьте пустым"
                  />
                </Grid>
              </Grid>
              <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                <Button type="submit" variant="contained" disabled={loading}>
                  {loading ? 'Сохранение...' : 'Сохранить'}
                </Button>
                <Button variant="outlined" onClick={() => { setShowForm(false); setForm(emptyForm); }}>
                  Отмена
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      {profiles.length === 0 ? (
        <Card sx={{ bgcolor: '#1A1033', border: '1px solid rgba(124,58,237,0.2)', textAlign: 'center', py: 6 }}>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            У вас пока нет профилей. Добавьте первый!
          </Typography>
          <Button variant="contained" startIcon={<PersonAddIcon />} onClick={() => setShowForm(true)}>
            Добавить профиль
          </Button>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {profiles.map(profile => (
            <Grid item xs={12} sm={6} md={4} key={profile.id}>
              <Card sx={{
                bgcolor: '#1A1033',
                border: profile.is_default ? '1px solid rgba(124,58,237,0.6)' : '1px solid rgba(124,58,237,0.2)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}>
                <CardContent sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="h6" fontWeight={600}>{profile.name}</Typography>
                    {profile.is_default && <Chip label="По умолчанию" size="small" color="primary" />}
                  </Box>
                  <Divider sx={{ my: 1, borderColor: 'rgba(124,58,237,0.2)' }} />
                  <Typography variant="body2" color="text.secondary">📅 {profile.birth_date}</Typography>
                  {profile.birth_time && (
                    <Typography variant="body2" color="text.secondary">🕐 {profile.birth_time}</Typography>
                  )}
                  <Typography variant="body2" color="text.secondary">📍 {profile.birth_place}</Typography>
                </CardContent>
                <CardActions sx={{ px: 2, pb: 2, gap: 1 }}>
                  {!profile.is_default && (
                    <Button
                      size="small"
                      startIcon={<StarBorderIcon />}
                      onClick={() => handleSetDefault(profile.id)}
                    >
                      По умолчанию
                    </Button>
                  )}
                  {profile.is_default && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'primary.main' }}>
                      <StarIcon fontSize="small" />
                      <Typography variant="caption">Основной</Typography>
                    </Box>
                  )}
                  <Box sx={{ flex: 1 }} />
                  {profiles.length > 1 && (
                    <Button
                      size="small"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDelete(profile.id)}
                    >
                      Удалить
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
