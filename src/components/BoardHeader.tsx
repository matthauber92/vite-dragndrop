import {AppBar, Box, Grid, IconButton, Toolbar, Typography} from "@mui/material";
import {Help, Menu} from "@mui/icons-material";

const BoardHeader = ({handleDrawer}: { handleDrawer: () => void }) => {
  return (
    <>
      <AppBar color="default">
        <Toolbar>
          <Grid container>
            <Grid item md={4}>
              <Box display={'flex'}>
                <IconButton sx={{mr: 1}} onClick={handleDrawer}>
                  <Menu/>
                </IconButton>
                <Typography variant="h6" fontWeight="bold" sx={{mt: 0.5}}>
                  Crew Board
                </Typography>
              </Box>
            </Grid>

            <Grid item md={4} textAlign={'center'}>
              <Typography variant="h6" fontWeight="bold">
                00:00 - 00:00
              </Typography>
            </Grid>

            <Grid item md={4}>
              <IconButton sx={{float: 'right'}}>
                <Help/>
              </IconButton>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Toolbar/>
    </>
  )
}

export default BoardHeader;
