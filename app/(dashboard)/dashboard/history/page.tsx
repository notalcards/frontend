'use client';

import { useState, useEffect, useCallback } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import api from '@/app/lib/api';

const TYPE_LABELS: Record<string, string> = {
  natal: '🌟 Натальная карта',
  solar: '☀️ Соляр',
  transit: '⚡ Транзиты',
  monthly: '🌙 Гороскоп',
  progressions: '📈 Прогрессии',
  venus: '💕 Циклы Венеры',
  synastry: '💑 Синастрия',
};

interface Chart {
  id: number;
  type: string;
  profile?: { name: string };
  created_at: string;
  interpretation: string;
}

export default function HistoryPage() {
  const [charts, setCharts] = useState<Chart[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<Chart | null>(null);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get('/charts');
      setCharts(data.data ?? data);
    } catch {
      setError('Ошибка загрузки истории');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/charts/${id}`);
      setCharts((prev) => prev.filter((c) => c.id !== id));
    } catch {
      setError('Ошибка при удалении');
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={1}>📚 История</Typography>
      <Typography color="text.secondary" mb={3}>Ваши сохранённые карты и прогнозы</Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box display="flex" justifyContent="center" mt={6}><CircularProgress /></Box>
      ) : charts.length === 0 ? (
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">Пока нет построенных карт</Typography>
        </Card>
      ) : (
        <TableContainer component={Card}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Тип</TableCell>
                <TableCell>Профиль</TableCell>
                <TableCell>Дата</TableCell>
                <TableCell align="right">Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {charts.map((chart) => (
                <TableRow key={chart.id} hover>
                  <TableCell>
                    <Chip label={TYPE_LABELS[chart.type] ?? chart.type} size="small"
                      sx={{ bgcolor: 'rgba(124,58,237,0.15)', color: '#C4B5FD' }} />
                  </TableCell>
                  <TableCell>{chart.profile?.name ?? '—'}</TableCell>
                  <TableCell>{new Date(chart.created_at).toLocaleString('ru-RU')}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => setSelected(chart)} title="Просмотреть">
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(chart.id)} title="Удалить">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={!!selected} onClose={() => setSelected(null)} maxWidth="md" fullWidth>
        <DialogTitle>{selected ? TYPE_LABELS[selected.type] : ''}</DialogTitle>
        <DialogContent dividers>
          <Typography sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
            {selected?.interpretation}
          </Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
