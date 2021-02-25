import React, { useEffect, useState} from "react";
import { useApp, useFocus, useFocusManager, useInput } from "ink";
import AWS from "aws-sdk"
import NavigationList from "./NavigationList";

const BucketViewer: React.FC<{lst: string[], setObjects: (l: string[]) => void, s3: AWS.S3}> = ({lst, setObjects, s3}) => {
  const [selected, setSelected] = useState(0);
  const {exit} = useApp();
  const {focusNext} = useFocusManager();
  const {isFocused} = useFocus({autoFocus: true});

  useEffect(() => {
    let isSubscribed = true;
    const bucketName = lst[selected];
    if (bucketName) {
      s3.listObjects({Bucket: bucketName}, function(err, data) {
        if (err) {
          throw err
        } else {
          if (data?.Contents !== undefined) {
            if (isSubscribed) {
              setObjects(data.Contents.map(d => d.Key ?? ""))
            }
          }
        }
      });
    }

    return () => {
      isSubscribed = false;
    }
    
  }, [selected, lst])

  useInput((input, key) => {
    if (input === "q") {
      exit();
    }
    if (isFocused && (input === 'j' || key.downArrow)) {
      setSelected(Math.min(lst.length - 1, selected + 1));
    }
    if (isFocused && (input === 'k' || key.upArrow)) {
      setSelected(Math.max(0, selected - 1));
    }
    if (isFocused && (input === 'l' || key.rightArrow)) {
      focusNext();
    }
  });

  return <NavigationList lst={lst} isFocused={isFocused} selected={selected} />
}

export default BucketViewer;
