import Box from '@mui/material/Box';
import Footer from '@/app/components/Footer';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box sx={{ flex: 1 }}>{children}</Box>
      <Footer />
    </Box>
  );
}
