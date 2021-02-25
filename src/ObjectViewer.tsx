import React, { useEffect, useState } from "react";
import { useFocus, useFocusManager, useInput } from "ink";
import NavigationList from "./NavigationList"

const ObjectViewer: React.FC<{lst: string[]}> = ({ lst }) => {

  const [selected, setSelected] = useState(0);
  const {isFocused} = useFocus();
  const {focusPrevious} = useFocusManager();

  useEffect(() => {
    setSelected(0);
  }, [lst])

  useInput((input, _) => {
    if (isFocused && input === 'j') {
      setSelected(Math.min(lst.length - 1, selected + 1));
    }
    if (isFocused && input === 'k' ) {
      setSelected(Math.max(0, selected - 1));
    }
    if (isFocused && input === 'h') {
      focusPrevious();
    }
  });

  return <NavigationList lst={lst} isFocused={isFocused} selected={selected} />
}

export default ObjectViewer;
