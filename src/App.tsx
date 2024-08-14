import React, {useState} from "react";
import {
  Grid,
  Box,
  Typography,
  Card,
  Drawer,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Chip,
  TextField,
  Tabs,
  Tab,
  AppBar,
  Toolbar
} from "@mui/material";
import {DragDropContext, Droppable, Draggable, DropResult} from "@hello-pangea/dnd";
import {addDays, startOfWeek, format} from "date-fns";
import {
  ExpandMore,
  WbSunny,
  Nightlight,
  Fullscreen,
  Close,
  Search,
  FilterList,
  MoreVert,
  Help, Menu
} from "@mui/icons-material";

// Apply global styles to remove window scroll bars
const styles = {
  html: {
    overflow: 'hidden',
    height: '100%',
  },
  body: {
    overflow: 'hidden',
    height: '100%',
    margin: 0,
    padding: 0,
  },
};

Object.assign(document.documentElement.style, styles.html);
Object.assign(document.body.style, styles.body);

interface Item {
  id: string;
  content: string;
  details?: string;
  combinedItems?: Item[];
}

// Generate mock data for items
const getItems = (count: number, offset = 0): Item[] =>
  Array.from({length: count}, (_v, k) => k).map((k) => ({
    id: `item-${k + offset}-${new Date().getTime()}`,
    content: `Sortie ${k + offset}`,
    details: `Details for Sortie ${k + offset}`,
  }));

// Initial data setup for each column with much more mock data
const initialData = [
  getItems(50), // Backlog with 50 items
  getItems(50, 50), // Monday with 50 items
  getItems(50, 100), // Tuesday with 50 items
  getItems(50, 150), // Wednesday with 50 items
  getItems(50, 200), // Thursday with 50 items
  getItems(50, 250), // Friday with 50 items
];

const reorder = (list: Item[], startIndex: number, endIndex: number): Item[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const move = (
  source: Item[],
  destination: Item[],
  droppableSource: { index: number; droppableId: string },
  droppableDestination: { index: number; droppableId: string }
): { [key: string]: Item[] } => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);
  destClone.splice(droppableDestination.index, 0, removed);

  const result: { [key: string]: Item[] } = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

const grid = 8;

const getItemStyle = (
  isDragging: boolean,
  draggableStyle: React.CSSProperties = {}
): React.CSSProperties => ({
  userSelect: "none",
  padding: grid,
  margin: `0 0 ${grid}px 0`,
  background: isDragging ? "#e0f7fa" : "#fff",
  border: "1px solid #ddd",
  borderTopWidth: "2px",
  borderTopColor: "#1876d2",
  borderRadius: "2px",
  borderBottom: "4px solid #ddd",
  ...draggableStyle,
});

const getCrewStyle = (
  isDragging: boolean,
  draggableStyle: React.CSSProperties = {}
): React.CSSProperties => ({
  userSelect: "none",
  padding: grid,
  margin: `0 0 ${grid}px 0`,
  background: isDragging ? "#e0f7fa" : "#fff",
  border: "1px solid #ddd",
  borderRadius: "2px",
  borderBottom: "4px solid #ddd",
  ...draggableStyle,
});

const renderCombinedItems = (combinedItems?: Item[]) => {
  if (!combinedItems || combinedItems.length === 0) return null;

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
        {combinedItems.map((item) => (
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
};

function CustomCardHeader({day}: { day: string }) {
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
  );
}

function App() {
  const [currentWeekStart] = useState<Date>(startOfWeek(new Date(), {weekStartsOn: 1}));
  const [state, setState] = useState<Item[][]>(initialData);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(true);
  const [tabValue, setTabValue] = useState(0); // For tab selection

  const daysOfWeek = Array.from({length: 5}, (_, i) => addDays(currentWeekStart, i));

  function onDragEnd(result: DropResult) {
    const {source, destination, combine} = result;

    if (!destination && !combine) {
      return;
    }

    const sInd = +source.droppableId;
    const dInd = destination ? +destination.droppableId : combine ? +combine.droppableId : -1;

    if (destination && dInd === 0) {
      return;
    }

    if (combine && sInd === 0 && dInd === 0) {
      return;
    }

    if (combine && sInd === 0 && dInd > 0) {
      const sourceItems = [...state[sInd]];
      const destinationItems = [...state[dInd]];
      const [removedItem] = sourceItems.splice(source.index, 1);

      const combinedItemIndex = destinationItems.findIndex(
        (item) => item.id === combine.draggableId
      );

      if (combinedItemIndex !== -1) {
        if (!destinationItems[combinedItemIndex].combinedItems) {
          destinationItems[combinedItemIndex].combinedItems = [];
        }
        destinationItems[combinedItemIndex].combinedItems!.push(removedItem);
      }

      const newState = [...state];
      newState[sInd] = sourceItems;
      newState[dInd] = destinationItems;

      setState(newState.filter((group) => group.length > 0));
      return;
    }

    if (sInd === 0 && dInd > 0) {
      return;
    }

    if (destination && sInd === dInd) {
      const items = reorder(state[sInd], source.index, destination.index);
      const newState = [...state];
      newState[sInd] = items;
      setState(newState);
    } else if (destination) {
      const result = move(state[sInd], state[dInd], source, destination);
      const newState = [...state];
      newState[sInd] = result[sInd];
      newState[dInd] = result[dInd];
      setState(newState.filter((group) => group.length > 0));
    }
  }

  const drawerWidth = 300;

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <>
      <AppBar color="default">
        <Toolbar>
          <Grid container>
            <Grid item md={4}>
              <Box display={'flex'}>
                <IconButton sx={{mr: 1}} onClick={() => drawerOpen ? setDrawerOpen(false) : setDrawerOpen(true)}>
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
      <Toolbar/> {/* This helps push the Drawer and content below the AppBar */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Box sx={{display: 'flex', height: 'calc(100vh - 64px)', width: '100vw', overflow: 'hidden', marginTop: 0}}>
          <Drawer
            variant="persistent"
            anchor="left"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            sx={{
              width: drawerOpen ? drawerWidth : 0,
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
                transition: 'width 0.3s ease',
                mt: 9,
                overflow: 'hidden', // Remove the scroll from the entire drawer
              },
            }}
          >
            <Box
              sx={{
                padding: 2,
                height: "100%",
                margin: 0,
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
              }}
              role="presentation"
            >
              <IconButton
                size="small"
                onClick={() => setDrawerOpen(false)}
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
                  minHeight: '32px', // Adjust the height of the Tabs container
                }}
              >
                <Tab
                  label="ALL"
                  sx={{
                    minHeight: '32px', // Adjust the height of the individual tab
                    padding: '6px 12px', // Adjust the padding
                    fontSize: '0.875rem', // Adjust the font size
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

              {/* Scrollable Content */}
              <Box
                sx={{
                  flexGrow: 0,
                  overflowY: 'auto',
                  height: '65%',
                }}
              >
                <Droppable droppableId="0" isCombineEnabled>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {state[0].map((item, index) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={getCrewStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style || {}
                              )}
                            >
                              <Typography variant="subtitle2">{item.content}</Typography>
                              <Typography variant="body2" color="textSecondary">{item.details}</Typography>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </Box>
            </Box>
          </Drawer>

          {/* Main Content Box */}
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto', // Ensure the main content can scroll
              transition: 'width 0.3s ease',
            }}
          >
            <Box sx={{
              flexGrow: 1,
              overflowY: 'auto', // Allow vertical scrolling in main content
              display: 'flex',
              flexDirection: 'column',
              height: 'calc(100vh - 64px)'
            }}>
              <Grid container spacing={0} justifyContent="space-between" sx={{margin: 0, width: "100%", flexGrow: 1}}>
                {daysOfWeek.map((day, index) => (
                  <Grid item xs={12} sm={6} md={2.4} key={index + 1} sx={{p: 0, height: '100%'}}>
                    <Card variant="outlined" sx={{height: "100%"}}>
                      <CustomCardHeader day={format(day, "EEEE, MMM d")}/>
                      <Box sx={{flexGrow: 1, padding: "8px"}}>
                        <Droppable droppableId={`${index + 1}`} isCombineEnabled>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                            >
                              {state[index + 1].map((item, idx) => (
                                <Draggable
                                  key={item.id}
                                  draggableId={item.id}
                                  index={idx}
                                >
                                  {(provided, snapshot) => (
                                    <Box
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={getItemStyle(
                                        snapshot.isDragging,
                                        provided.draggableProps.style || {}
                                      )}
                                    >
                                      <Box sx={{
                                        position: 'relative',
                                        paddingRight: '40px'
                                      }}>
                                        <Box sx={{flexShrink: 1}}>
                                          <Typography variant="subtitle2">{item.content}</Typography>
                                          <Typography variant="body2" color="textSecondary">{item.details}</Typography>
                                        </Box>
                                        <Box sx={{
                                          position: 'absolute',
                                          top: 0,
                                          right: 0,
                                          display: 'flex',
                                          alignItems: 'center',
                                          flexShrink: 1
                                        }}>
                                          <Chip
                                            label="SP"
                                            color="success"
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
                                          <IconButton size="small">
                                            <MoreVert sx={{fontSize: 18}}/>
                                          </IconButton>
                                        </Box>
                                      </Box>
                                      {renderCombinedItems(item.combinedItems)}
                                    </Box>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        </Box>
      </DragDropContext>
    </>
  );
}

export default App;
