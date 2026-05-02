'use client';

import { useState, useEffect, useCallback } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import debounce from 'lodash/debounce';

interface CityOption {
  display_name: string;
  name: string;
  lat: string;
  lon: string;
}

interface CityAutocompleteProps {
  value: string;
  onChange: (city: string, lat?: number, lng?: number) => void;
  label?: string;
  required?: boolean;
  error?: boolean;
  helperText?: string;
}

export default function CityAutocomplete({
  value,
  onChange,
  label = 'Город',
  required = false,
  error = false,
  helperText,
}: CityAutocompleteProps) {
  const [inputValue, setInputValue] = useState(value || '');
  const [options, setOptions] = useState<CityOption[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCities = useCallback(
    debounce(async (query: string) => {
      if (!query || query.length < 2) {
        setOptions([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?` +
            new URLSearchParams({
              q: query,
              format: 'json',
              addressdetails: '1',
              limit: '10',
              'accept-language': 'ru',
            }),
          {
            headers: {
              'User-Agent': 'NatalCharts-App/1.0',
            },
          }
        );
        const data = await response.json();
        setOptions(data || []);
      } catch (error) {
        console.error('Geocoding error:', error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    fetchCities(inputValue);
  }, [inputValue, fetchCities]);

  return (
    <Autocomplete
      freeSolo
      options={options}
      loading={loading}
      value={value}
      inputValue={inputValue}
      onInputChange={(_, newInputValue) => {
        setInputValue(newInputValue);
        // Если пользователь вводит вручную без выбора из списка
        if (newInputValue && !options.find((o) => o.display_name === newInputValue)) {
          onChange(newInputValue);
        }
      }}
      onChange={(_, newValue) => {
        if (typeof newValue === 'string') {
          onChange(newValue);
        } else if (newValue && typeof newValue === 'object') {
          const city = newValue as CityOption;
          onChange(city.name || city.display_name, parseFloat(city.lat), parseFloat(city.lon));
        }
      }}
      getOptionLabel={(option) => {
        if (typeof option === 'string') return option;
        return option.display_name || option.name || '';
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          required={required}
          error={error}
          helperText={helperText}
          slotProps={{
            ...params.slotProps,
            input: {
              ...params.slotProps.input,
              endAdornment: (
                <>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.slotProps.input.endAdornment}
                </>
              ),
            },
          }}
          sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'rgba(124,58,237,0.05)' } }}
        />
      )}
      sx={{
        '& .MuiAutocomplete-option': {
          fontSize: 14,
        },
      }}
    />
  );
}
