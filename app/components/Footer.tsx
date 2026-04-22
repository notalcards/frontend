import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        borderTop: '1px solid rgba(124,58,237,0.15)',
        py: 3,
        px: 4,
        textAlign: 'center',
      }}
    >
      <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.5, lineHeight: 2, display: 'block' }}>
        ИП Смирнов Евгений Александрович · ИНН 121522198705 · ОГРНИП 314121502200060
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.5 }}>
        support@натальные-карты.рф · © 2024 NatalCharts
      </Typography>
    </Box>
  );
}
