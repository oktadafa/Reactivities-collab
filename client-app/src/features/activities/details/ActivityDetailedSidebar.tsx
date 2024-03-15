import { Segment, List, Label, Item, Image, Button } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { Activity } from '../../../app/models/activity'
import { useStore } from '../../../app/stores/store';
import { useState } from 'react';
import { Profile } from '../../../app/models/profile';


interface Props {
    activity: Activity;
}
 
export default observer(function ActivityDetailedSidebar ({activity: {attendees, host}}: Props) {
    const{userStore, activityStore} = useStore()
    const {kickUserActivity, loading} = activityStore
    const {user} = userStore
    const [target, setTarget] = useState('');

    if (!attendees) return null;
        
return (
        <>
            <Segment
                textAlign='center'
                style={{ border: 'none' }}
                attached='top'
                secondary
                inverted
                color='teal'
            >
                {attendees.length} {attendees.length === 1 ? 'Person' : 'People'} going
            </Segment>
            <Segment attached>
                <List relaxed divided>
                    {attendees.map(attendee => (
                        <Item style={{ position: 'relative' }} key={attendee.username}>
                        {attendee.username === host?.username && 
                        <Label
                            style={{ position: 'absolute' }}
                            color='orange'
                            ribbon='right'
                        >
                            Host
                        </Label>}
                        <Image size='tiny' src={attendee.image || '/assets/user.png'} />
                        <Item.Content verticalAlign='middle'>
                            <Item.Header as='h3'>
                                <Link to={`/profiles/${attendee.username}`}>{attendee.displayName}</Link>
                            </Item.Header>
                            {attendee.following &&   
                            <Item.Extra style={{ color: 'orange' }}>Following</Item.Extra>}
                            {
                                attendee.username !== host?.username && user?.username == host?.username &&
                            <Button 
                            content="Kick" 
                            color='red' 
                            style={{position:'absolute', right:0}} 
                            loading={target === `main${user}` && loading}
                            onClick={() => {
                               kickUserActivity(attendee.username)
                            }} 
                            />
                            }
                        </Item.Content>
                    </Item>
                    ))}
                    

                </List>
            </Segment>
        </>

    )
})