import React, { useState } from "react";
import { Grid, Box, Typography, Card, Drawer, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { addDays, startOfWeek, format } from "date-fns";
import { ExpandMore, WbSunny, Nightlight, Fullscreen} from "@mui/icons-material";

interface Item {
  id: string;
  content: string;
  details?: string;
  combinedItems?: Item[];
}

// Generate mock data for items
const getItems = (count: number, offset = 0): Item[] =>
  Array.from({ length: count }, (_v, k) => k).map((k) => ({
    id: `item-${k + offset}-${new Date().getTime()}`,
    content: `Sortie ${k + offset}`,
    details: `Details for Sortie ${k + offset}`,
  }));

// Initial data setup for each column with much more mock data
const initialData = [
  getItems(50),  // Backlog with 50 items
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
  borderTopWidth: '2px',
  borderTopColor: '#1876d2',
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
    <Accordion   sx={{
      '& .MuiButtonBase-root.MuiAccordionSummary-root.MuiAccordionSummary-gutters': {
        minHeight: '20px'
      },
      boxShadow: 'none',
      height: '50%'
    }}>
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
            justifyContent: 'center',
          },
        }}
      />

      <AccordionDetails>
        {combinedItems.map((item) => (
          <Box key={item.id} sx={{ marginBottom: 1 }}>
            <Typography variant="body2">{item.content}</Typography>
          </Box>
        ))}
      </AccordionDetails>
    </Accordion>
  );
};

function CustomCardHeader({ day }: { day: string }) {
  return (
    <Box sx={{ backgroundColor: '#fff', border: '1px solid #ddd' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 0.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <WbSunny fontSize="small" color="primary" sx={{fontSize: 14}} />
          <Typography variant="body2" sx={{ ml: 1 }}>
            00:00
          </Typography>
          <Nightlight color="primary" fontSize="small" sx={{ ml: 2, fontSize: 14 }} />
          <Typography variant="body2" sx={{ ml: 1 }}>
            00:00 00%
          </Typography>
        </Box>
      </Box>
      <Box sx={{ borderBottom: '1px solid #ddd', m: 0 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 0.5 }}>
        <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: 12 }}>
          {day}
        </Typography>
        <Fullscreen fontSize="small" />
      </Box>
    </Box>
  );
}

function App() {
  const [currentWeekStart] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [state, setState] = useState<Item[][]>(initialData);
  const [, setDrawerOpen] = useState<boolean>(false);

  const daysOfWeek = Array.from({ length: 5 }, (_, i) => addDays(currentWeekStart, i));

  function onDragEnd(result: DropResult) {
    const { source, destination, combine } = result;

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

  const drawerWidth = 300; // Set the drawer width

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Box sx={{ display: 'flex', height: '98vh', width: '98vw', overflow: 'hidden' }}>
        <Drawer
          variant="persistent"
          anchor="left"
          open
          onClose={() => setDrawerOpen(false)}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
        >
          <Box
            sx={{ padding: 2, height: "100%" }}
            role="presentation"
          >
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              Crew
            </Typography>
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
        </Drawer>

        {/* Main Content Box with a single vertical scroll */}
        <Box sx={{ flexGrow: 1, transition: 'margin-left 0.3s ease-in-out', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Box sx={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)' }}>
            <Grid container spacing={0} justifyContent="space-between" sx={{ margin: 0, width: "100%", flexGrow: 1 }}>
              {daysOfWeek.map((day, index) => (
                <Grid item xs={2.4} key={index + 1} sx={{ padding: "0 4px", height: '100%' }}>
                  <Card variant="outlined" sx={{ height: "100%" }}>
                    <CustomCardHeader day={format(day, "EEEE, MMM d")} />
                    <Box sx={{ flexGrow: 1, padding: "8px" }}>
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
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={getItemStyle(
                                      snapshot.isDragging,
                                      provided.draggableProps.style || {}
                                    )}
                                  >
                                    <Typography variant="subtitle2">{item.content}</Typography>
                                    <Typography variant="body2" color="textSecondary">{item.details}</Typography>
                                    {renderCombinedItems(item.combinedItems)}
                                  </div>
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
  );
}

export default App;
