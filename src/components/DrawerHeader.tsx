import {Box, IconButton, Tab, Tabs, TextField, Typography} from "@mui/material";
import {Close, FilterList, Search} from "@mui/icons-material";
import React from "react";

interface SearchFieldProps {
  handleDrawer: () => void;
  handleTabChange: (_event: React.SyntheticEvent, newValue: number) => void;
  tabValue: number;
}

const DrawerHeader = ({tabValue, handleDrawer, handleTabChange}: SearchFieldProps) => {
  return (
    <>
      <IconButton
        size="small"
        onClick={handleDrawer}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
        }}
      >
        <Close fontSize="small"/>
      </IconButton>
      <Typography variant="h6" sx={{marginBottom: 2}}>
        Crew
      </Typography>

      <Box sx={{display: 'flex', alignItems: 'center', marginBottom: 2}}>
        <TextField
          variant="filled"
          placeholder="Search..."
          size="small"
          fullWidth
          InputProps={{
            startAdornment: (
              <Search/>
            ),
          }}
          sx={{
            flexGrow: 1,
            '& .MuiInputBase-root': {
              borderRadius: 12,
              pl: 1,
              paddingTop: '4px',
              paddingBottom: '4px'
            },
            '& .MuiFilledInput-input': {
              pl: 1,
              paddingTop: '4px',
              paddingBottom: '4px'
            },
            '& .MuiFilledInput-root::before': {
              borderBottom: 'none'
            },
            '& .MuiFilledInput-root:focus-within': {
              borderBottom: 'none'
            },
            '& .MuiFilledInput-root:hover:not(.Mui-disabled, .Mui-error):before': {
              borderBottom: 'none'
            },
            '& .MuiFilledInput-root::after': {
              borderBottom: 'none'
            }
          }}
        />
        <IconButton size="small" sx={{marginLeft: 1}}>
          <FilterList/>
        </IconButton>
      </Box>

      {/* Tabs */}
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        sx={{
          marginBottom: 2,
          minHeight: '32px',
        }}
      >
        <Tab
          label="ALL"
          sx={{
            minHeight: '32px',
            padding: '6px 12px',
            fontSize: '0.875rem',
          }}
        />
        <Tab
          label="AVAILABLE"
          sx={{
            minHeight: '32px',
            padding: '6px 12px',
            fontSize: '0.875rem',
          }}
        />
        <Tab
          label="REQUESTS"
          sx={{
            minHeight: '32px',
            padding: '6px 12px',
            fontSize: '0.875rem',
          }}
        />
      </Tabs>
    </>
  )
}

export default DrawerHeader;