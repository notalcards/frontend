'use client';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface Props {
  title: string;
  profileName?: string;
  interpretation: string;
  createdAt?: string;
}

export default function ChartResult({ title, profileName, interpretation, createdAt }: Props) {
  return (
    <Card sx={{ mt: 3 }}>
      <Box
        sx={{
          background: 'linear-gradient(135deg, #4C1D95 0%, #7C3AED 100%)',
          px: 3,
          py: 2,
        }}
      >
        <Typography variant="h6" fontWeight={700}>{title}</Typography>
        {profileName && (
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            👤 {profileName}
          </Typography>
        )}
        {createdAt && (
          <Typography variant="caption" sx={{ opacity: 0.6 }}>
            {new Date(createdAt).toLocaleString('ru-RU')}
          </Typography>
        )}
      </Box>
      <CardContent>
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
          dangerouslySetInnerHTML={{ __html: interpretation }}
        />
      </CardContent>
    </Card>
  );
}
