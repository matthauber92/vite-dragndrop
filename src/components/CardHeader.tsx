import {Box, IconButton, Typography} from "@mui/material";
import {Fullscreen, Nightlight, WbSunny} from "@mui/icons-material";

const CardHeader = ({day}: { day: string }) => {
  return (
    <Box sx={{backgroundColor: '#fff', border: '1px solid #ddd'}}>
      <Box sx={{p: 0.5}}>
        <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <Box sx={{display: 'flex'}}>
            <WbSunny fontSize="small" color="primary" sx={{fontSize: 14}}/>
            <Typography variant="body2" sx={{ml: 1}}>
              00:00
            </Typography>
          </Box>
          <Box sx={{display: 'flex'}}>
            <Nightlight color="primary" fontSize="small" sx={{ml: 2, fontSize: 14}}/>
            <Typography variant="body2" sx={{ml: 1}}>
              00:00 00%
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box sx={{borderBottom: '1px solid #ddd', m: 0}}/>
      <Box sx={{display: 'flex', justifyContent: 'space-between', p: 0.5}}>
        <Typography variant="body2" sx={{fontWeight: 'bold', fontSize: 12, mt: 0.8}}>
          {day}
        </Typography>
        <IconButton size="small">
          <Fullscreen fontSize="small"/>
        </IconButton>
      </Box>
    </Box>
  )
}

export default CardHeader;