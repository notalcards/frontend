'use client';

import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import TimelineIcon from '@mui/icons-material/Timeline';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PeopleIcon from '@mui/icons-material/People';
import HistoryIcon from '@mui/icons-material/History';
import LogoutIcon from '@mui/icons-material/Logout';
import { usePathname, useRouter } from 'next/navigation';
import api from '@/app/lib/api';
import { removeToken } from '@/app/lib/auth';

const DRAWER_WIDTH = 240;

const navItems = [
  { label: 'Натальная карта', icon: <AutoAwesomeIcon />, href: '/dashboard/natal' },
  { label: 'Гороскопы', icon: <CalendarMonthIcon />, href: '/dashboard/horoscope' },
  { label: 'Транзиты', icon: <CompareArrowsIcon />, href: '/dashboard/transits' },
  { label: 'Соляр', icon: <WbSunnyIcon />, href: '/dashboard/solar' },
  { label: 'Прогрессии', icon: <TimelineIcon />, href: '/dashboard/progressions' },
  { label: 'Венера', icon: <FavoriteIcon />, href: '/dashboard/venus' },
  { label: 'Синастрия', icon: <PeopleIcon />, href: '/dashboard/synastry' },
  { label: 'История', icon: <HistoryIcon />, href: '/dashboard/history' },
];

interface User {
  name: string;
  credits: number;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    api.get('/me').then(({ data }) => setUser(data)).catch(() => router.push('/login'));
  }, [router]);

  const handleLogout = async () => {
    try { await api.post('/logout'); } catch {}
    removeToken();
    router.push('/login');
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ justifyContent: 'center', py: 2 }}>
        <Typography variant="h6" fontWeight={800} sx={{
          background: 'linear-gradient(135deg, #C4B5FD, #7C3AED)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          🔮 NatalCharts
        </Typography>
      </Toolbar>
      <Divider sx={{ borderColor: 'rgba(124,58,237,0.2)' }} />
      <List sx={{ flex: 1, px: 1, pt: 1 }}>
        {navItems.map(({ label, icon, href }) => (
          <ListItem key={href} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => router.push(href)}
              selected={pathname === href}
              sx={{
                borderRadius: 2,
                '&.Mui-selected': {
                  bgcolor: 'rgba(124,58,237,0.25)',
                  '&:hover': { bgcolor: 'rgba(124,58,237,0.35)' },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: pathname === href ? 'primary.main' : 'text.secondary' }}>
                {icon}
              </ListItemIcon>
              <ListItemText
                primary={label}
                primaryTypographyProps={{ fontSize: 14, fontWeight: pathname === href ? 600 : 400 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ borderColor: 'rgba(124,58,237,0.2)' }} />
      <List sx={{ px: 1, pb: 1 }}>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2 }}>
            <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Выйти" primaryTypographyProps={{ fontSize: 14 }} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${DRAWER_WIDTH}px)`,
          ml: `${DRAWER_WIDTH}px`,
          bgcolor: 'background.paper',
          borderBottom: '1px solid rgba(124,58,237,0.2)',
          boxShadow: 'none',
        }}
      >
        <Toolbar sx={{ justifyContent: 'flex-end', gap: 2 }}>
          {user && (
            <>
              <Chip
                label={`💎 ${user.credits} кредитов`}
                size="small"
                sx={{ bgcolor: 'rgba(124,58,237,0.15)', color: '#C4B5FD', border: '1px solid rgba(124,58,237,0.3)' }}
              />
              <Typography variant="body2" color="text.secondary">
                {user.name}
              </Typography>
            </>
          )}
          <IconButton size="small" onClick={handleLogout} color="inherit">
            <LogoutIcon fontSize="small" />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            bgcolor: '#1A1033',
            borderRight: '1px solid rgba(124,58,237,0.2)',
          },
        }}
      >
        {drawer}
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8, bgcolor: 'background.default', minHeight: '100vh' }}>
        {children}
      </Box>
    </Box>
  );
}
