'use client';

import { useState, useEffect } from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import api from '@/app/lib/api';

interface Profile {
  id: number;
  name: string;
  birth_date: string;
  birth_place: string;
}

interface Props {
  value: number | '';
  onChange: (id: number) => void;
  label?: string;
}

export default function ProfileSelector({ value, onChange, label = 'Профиль' }: Props) {
  const [profiles, setProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    api.get('/profiles').then(({ data }) => setProfiles(data.data ?? data));
  }, []);

  const handleChange = (e: SelectChangeEvent<number | ''>) => {
    if (e.target.value !== '') onChange(e.target.value as number);
  };

  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select value={value} onChange={handleChange} label={label}>
        {profiles.map((p) => (
          <MenuItem key={p.id} value={p.id}>
            {p.name} — {p.birth_date}, {p.birth_place}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
