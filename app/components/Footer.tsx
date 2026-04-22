import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MuiLink from '@mui/material/Link';
import NextLink from 'next/link';

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
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mb: 1.5, flexWrap: 'wrap' }}>
        <MuiLink component={NextLink} href="/privacy" variant="caption" sx={{ color: '#A0A0C0', opacity: 0.7 }}>
          Политика конфиденциальности
        </MuiLink>
        <MuiLink component={NextLink} href="/terms" variant="caption" sx={{ color: '#A0A0C0', opacity: 0.7 }}>
          Пользовательское соглашение
        </MuiLink>
        <MuiLink href="mailto:support@натальные-карты.рф" variant="caption" sx={{ color: '#A0A0C0', opacity: 0.7 }}>
          support@натальные-карты.рф
        </MuiLink>
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.4, lineHeight: 2, display: 'block' }}>
        ИП Смирнов Евгений Александрович · ИНН 121522198705 · ОГРНИП 314121502200060 · © 2024 NatalCharts
      </Typography>
    </Box>
  );
}
