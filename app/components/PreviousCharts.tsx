'use client';

import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '@/app/lib/api';

interface Chart {
  id: number;
  type: string;
  profile?: { name: string };
  created_at: string;
  interpretation: string;
  input_data?: Record<string, unknown>;
}

interface PreviousChartsProps {
  type: string;
  title?: string;
  onRefresh?: () => void;
}

export default function PreviousCharts({ type, title, onRefresh }: PreviousChartsProps) {
  const [charts, setCharts] = useState<Chart[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Chart | null>(null);

  const load = async () => {
    try {
      const { data } = await api.get(`/charts?type=${type}`);
      setCharts(data.data ?? data);
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [type]);

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/charts/${id}`);
      setCharts((prev) => prev.filter((c) => c.id !== id));
      onRefresh?.();
    } catch {
      // silent fail
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  if (charts.length === 0) {
    return null;
  }

  return (
    <Box mt={4}>
      <Typography variant="h6" fontWeight={600} mb={2}>
        {title || 'Предыдущие генерации'}
      </Typography>

      <Grid container spacing={2}>
        {charts.map((chart) => (
          <Grid key={chart.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              sx={{
                bgcolor: '#1A1033',
                border: '1px solid rgba(124,58,237,0.2)',
                borderRadius: 2,
                transition: 'border-color 0.2s, transform 0.2s',
                '&:hover': {
                  borderColor: 'rgba(124,58,237,0.5)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                  <Typography variant="body2" color="text.secondary" fontSize={12}>
                    {new Date(chart.created_at).toLocaleDateString('ru-RU', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </Typography>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => setSelected(chart)}
                      sx={{ color: '#C4B5FD', p: 0.5 }}
                      title="Просмотреть"
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(chart.id)}
                      sx={{ color: '#EF4444', p: 0.5, ml: 0.5 }}
                      title="Удалить"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                <Typography variant="subtitle2" fontWeight={600} mb={0.5}>
                  {chart.profile?.name || 'Без профиля'}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    fontSize: 13,
                    lineHeight: 1.5,
                  }}
                >
                  {chart.interpretation?.replace(/<[^>]*>/g, '').substring(0, 120) || 'Без описания'}...
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={!!selected} onClose={() => setSelected(null)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: '#1A1033', borderBottom: '1px solid rgba(124,58,237,0.2)' }}>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              {selected?.profile?.name || 'Карта'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {selected?.created_at &&
                new Date(selected.created_at).toLocaleString('ru-RU', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent dividers sx={{ bgcolor: '#0F0A1E' }}>
          <Box
            sx={{
              lineHeight: 1.8,
              color: 'text.secondary',
              '& h2': { color: '#C4B5FD', fontSize: '1.15rem', fontWeight: 700, mt: 3, mb: 1 },
              '& h3': { color: '#A78BFA', fontSize: '1rem', fontWeight: 600, mt: 2, mb: 0.5 },
              '& p': { mb: 1.5 },
              '& ul': { pl: 2.5, mb: 1.5 },
              '& li': { mb: 0.5 },
              '& strong': { color: '#E2E0F0', fontWeight: 600 },
            }}
            dangerouslySetInnerHTML={{ __html: selected?.interpretation ?? '' }}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
}
