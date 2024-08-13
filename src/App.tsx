import React, { useState } from "react";
import { Grid, Button, Container, Box, Typography } from "@mui/material";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { addDays, startOfWeek, format } from "date-fns";
import "./App.css";

interface Item {
  id: string;
  content: string;
}

// Generate mock data for items
const getItems = (count: number, offset = 0): Item[] =>
  Array.from({ length: count }, (_v, k) => k).map((k) => ({
    id: `item-${k + offset}-${new Date().getTime()}`,
    content: `Task ${k + offset}`
  }));

// Initial data setup for each column
const initialData = [
  getItems(10),  // Crew
  getItems(2, 10), // Monday
  getItems(3, 20), // Tuesday
  getItems(1, 30), // Wednesday
  getItems(4, 40), // Thursday
  getItems(2, 50), // Friday
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

const getItemStyle = (isDragging: boolean, draggableStyle: React.CSSProperties = {}): React.CSSProperties => ({
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,
  background: isDragging ? "lightgreen" : "grey",
  ...draggableStyle,
});

const getListStyle = (isDraggingOver: boolean): React.CSSProperties => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  minHeight: 500,
});

function App() {
  // State for current week start date (Monday)
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [state, setState] = useState<Item[][]>(initialData);

  const daysOfWeek = Array.from({ length: 5 }, (_, i) => addDays(currentWeekStart, i));

  const handlePrevWeek = () => {
    setCurrentWeekStart(prev => addDays(prev, -7));
  };

  const handleNextWeek = () => {
    setCurrentWeekStart(prev => addDays(prev, 7));
  };

  function onDragEnd(result: DropResult) {
    const { source, destination, combine } = result;

    // Dropped outside the list
    if (!destination && !combine) {
      return;
    }

    const sInd = +source.droppableId;
    const dInd = destination ? +destination.droppableId : combine ? +combine.droppableId : -1;

    // Prevent any items from being dragged to the first column (index 0)
    if (destination && dInd === 0) {
      return;
    }

    // Prevent combining items in the first column with other items in the first column
    if (combine && sInd === 0 && dInd === 0) {
      return;
    }

    // Allow combining items from column 1 (index 0) with items in the days columns
    if (combine && sInd === 0 && dInd > 0) {
      const sourceItems = [...state[sInd]];
      const destinationItems = [...state[dInd]];

      // Remove the combined item from the source list
      const [removedItem] = sourceItems.splice(source.index, 1);

      // Combine content or handle merging logic
      const combinedItemIndex = destinationItems.findIndex(
        (item) => item.id === combine.draggableId
      );

      // Check if the item to be combined exists and combine the content
      if (combinedItemIndex !== -1) {
        destinationItems[combinedItemIndex] = {
          ...destinationItems[combinedItemIndex],
          content: `${destinationItems[combinedItemIndex].content} + ${removedItem.content}`,
        };
      }

      // Update state to reflect the combination and removal of the source item
      const newState = [...state];
      newState[sInd] = sourceItems;
      newState[dInd] = destinationItems;

      setState(newState.filter((group) => group.length > 0));
      return;
    }

    // Prevent items from the first column from being dragged to the day columns
    if (sInd === 0 && dInd > 0) {
      return;
    }

    // Handle reordering or moving items within the same column
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

  return (
    <Container>
      <Box sx={{ textAlign: "center", marginBottom: "20px" }}>
        <Button variant="contained" onClick={handlePrevWeek}>
          Previous Week
        </Button>
        <Button variant="contained" onClick={handleNextWeek} sx={{ marginLeft: "10px" }}>
          Next Week
        </Button>
      </Box>
      <DragDropContext onDragEnd={onDragEnd}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" align="center">Crew</Typography>
            <Droppable droppableId="0" isCombineEnabled>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
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
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style || {}
                          )}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            {item.content}
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => {
                                const newState = [...state];
                                newState[0].splice(index, 1);
                                setState(
                                  newState.filter((group) => group.length)
                                );
                              }}
                            >
                              delete
                            </Button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </Grid>

          {daysOfWeek.map((day, index) => (
            <Grid item xs={12} sm={6} md={2} key={index + 1}>
              <Typography variant="h6" align="center">{format(day, "EEEE, MMM d")}</Typography>
              <Droppable droppableId={`${index + 1}`} isCombineEnabled>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}
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
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              {item.content}
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() => {
                                  const newState = [...state];
                                  newState[index + 1].splice(idx, 1);
                                  setState(
                                    newState.filter((group) => group.length)
                                  );
                                }}
                              >
                                delete
                              </Button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </Grid>
          ))}
        </Grid>
      </DragDropContext>
    </Container>
  );
}

export default App;
