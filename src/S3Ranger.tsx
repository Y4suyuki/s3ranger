import React, { useEffect, useState} from "react";
import { Box, Text, useApp, useFocus, useFocusManager, useInput } from "ink";
import AWS from "aws-sdk"
import ObjectViewer from "./ObjectViewer";
import NavigationList from "./NavigationList";
import BucketViewer from "./BucketViewer";


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
