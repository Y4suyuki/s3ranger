import React, { useEffect, useState} from "react";
import { Box, Text, useApp, useFocus, useFocusManager, useInput } from "ink";
import AWS from "aws-sdk"
import ObjectViewer from "./ObjectViewer";
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

const S3Ranger: React.FC<{profile: string | undefined}> = ({ profile }) => {

  const defaultMessage = "";
  const [message, setMessage] = useState(defaultMessage)

  const credentials = new AWS.SharedIniFileCredentials({ profile });
  AWS.config.credentials = credentials;

  AWS.config.getCredentials(function(err) {
    if (err) {
      console.log(err.stack);
      setMessage(`failed to get credentials for profile: ${profile}`);
    }
  });

  const s3 = new AWS.S3({apiVersion: "2006-03-01"});

  const [lst, setLst] = useState<string[]>([]);
  const [objects, setObjects] = useState<string[]>([])

  useEffect(() => {
    setMessage("getting s3 bucket list...");
    s3.listBuckets((err, data) => {
      if (err) {
        console.log("Error", err);
        setMessage("failed to get s3 bucket list")
      } else {
        const res = data.Buckets ?? []
        setLst(res.map(d => d.Name ? d.Name : ""))
        setMessage(defaultMessage)
      }
    })
  }, [])

  return (
    <Box flexDirection="column">
      <Text>Use arrow keys to move. Press "q" to exit. </Text>
      <Box>
        <BucketViewer lst={lst} setObjects={setObjects} s3={s3} />
        <ObjectViewer lst={objects} />
      </Box>
      <Box>
        <Text color="yellow">profile: {profile}</Text><Text>{message}</Text>
      </Box>
    </Box>
  );
}

export default S3Ranger;
