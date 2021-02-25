import React from 'react'
import {render} from 'ink';
import S3Ranger from "./S3Ranger"
import meow from "meow"

const cli = meow(`
  Usage
  $ cli

  Options
    --profile, -p  aws profile name

  Examples
    $ cli --profile foo
`, {
  flags: {
    profile: {
      type: 'string',
      alias: 'p'
    }
  }
})

render(<S3Ranger {...cli.flags} />);
