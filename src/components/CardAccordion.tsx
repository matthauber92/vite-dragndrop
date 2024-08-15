import {Item} from "../interfaces.ts";
import {Accordion, AccordionDetails, AccordionSummary, Box, Chip, IconButton, Typography} from "@mui/material";
import {Close, ExpandMore} from "@mui/icons-material";

const CardAccordion = ({items}: { items?: Item[] }) => {
  if (!items || items.length === 0) return null;

  return (
    <Accordion
      sx={{
        '& .MuiButtonBase-root.MuiAccordionSummary-root.MuiAccordionSummary-gutters': {
          minHeight: '20px'
        },
        boxShadow: 'none',
        height: '50%',
        position: 'inherit'
      }}
    >
      <AccordionSummary
        expandIcon={
          <ExpandMore
            sx={{
              color: 'primary.main',  // MUI blue color
            }}
          />
        }
        aria-controls="panel1a-content"
        id="panel1a-header"
        sx={{
          '& .MuiAccordionSummary-expandIconWrapper': {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
          },
          '& .MuiAccordionSummary-content': {
            justifyContent: 'center'
          },
        }}
      />

      <AccordionDetails sx={{p: 0}}>
        {items.map((item: Item) => (
          <Box
            key={item.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 0.5,
              m: 0.5,
              border: "1.5px solid #ddd",
              borderRadius: "2px",
              borderBottom: "2.5px solid #ddd",
            }}
          >
            <Typography variant="body2" color="primary" sx={{flexShrink: 0, marginRight: 1}}>
              Short Name
            </Typography>
            <Box sx={{display: 'flex'}}>
              <Chip
                label={item.content}
                size="small"
                sx={{
                  fontSize: '0.75rem', // Smaller font size
                  height: '22px', // Adjust height
                  mt: 0.5,
                  marginRight: 1,
                  '.MuiChip-label': {
                    paddingLeft: '6px', // Adjust padding for a tighter fit
                    paddingRight: '6px',
                  }
                }}
              />
              <IconButton size="small" color="primary">
                <Close fontSize="small"/>
              </IconButton>
            </Box>

          </Box>
        ))}
      </AccordionDetails>
    </Accordion>
  );
}

export default CardAccordion;