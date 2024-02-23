import React from 'react'
import { Dimmer, Loader } from 'semantic-ui-react'

interface Props {
    content? : string;
    inverted?: boolean;
}


function LoadingComponent({inverted = true, content = 'Loading...'} : Props) {
  return (
    <Dimmer active={true} inverted={inverted}>
        <Loader content={content}/>
    </Dimmer>
  )
}

export default LoadingComponent