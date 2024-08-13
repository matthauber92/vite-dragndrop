import React, { useState } from "react";
import "./App.css";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

interface Item {
  id: string;
  content: string;
}

const getItems = (count: number, offset = 0): Item[] =>
  Array.from({ length: count }, (_v, k) => k).map((k) => ({
    id: `item-${k + offset}-${new Date().getTime()}`,
    content: `item ${k + offset}`,
  }));

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
  width: 250,
  minHeight: 500,
});

function App() {
  const [state, setState] = useState<Item[][]>([getItems(10), getItems(5, 10)]);

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

    // Allow combining items from column 1 (index 0) with items in column 2 (index 1)
    if (combine && sInd === 0 && dInd === 1) {
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

    // Prevent items from the first column from being dragged to the second column
    if (sInd === 0 && dInd === 1) {
      return;
    }

    // Handle reordering or moving items within the same column
    if (sInd === dInd) {
      const items = reorder(state[sInd], source.index, destination.index);
      const newState = [...state];
      newState[sInd] = items;
      setState(newState);
    } else {
      const result = move(state[sInd], state[dInd], source, destination);
      const newState = [...state];
      newState[sInd] = result[sInd];
      newState[dInd] = result[dInd];

      setState(newState.filter((group) => group.length > 0));
    }
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
      <DragDropContext onDragEnd={onDragEnd}>
        {state.map((el, ind) => (
          <Droppable key={ind} droppableId={`${ind}`} isCombineEnabled>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
                {...provided.droppableProps}
              >
                {el.map((item, index) => (
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
                          <button
                            type="button"
                            onClick={() => {
                              const newState = [...state];
                              newState[ind].splice(index, 1);
                              setState(
                                newState.filter((group) => group.length)
                              );
                            }}
                          >
                            delete
                          </button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </DragDropContext>
    </div>
  );
}

export default App;
