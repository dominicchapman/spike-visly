import { redo, undo, useMutation, useValue } from "@visly/state";
import { appState, selectors, mutations } from "@spike-visly/shared";

export const App = () => {
  const items = useValue(appState, selectors.items);
  const addItem = useMutation(appState, mutations.addItem);

  return (
    <>
      <button onClick={() => undo(appState)}>Undo</button>
      <button onClick={() => redo(appState)}>Redo</button>
      <button onClick={() => addItem()}>Add item</button>
      {items.map((item) => {
        return <div key={item}>{item}</div>;
      })}
    </>
  );
};
