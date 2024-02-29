import { observer } from "mobx-react-lite";
import { List, Image, Popup } from "semantic-ui-react";
import { Profile } from "../../../app/models/profile";
import { Link } from "react-router-dom";
import ProfileCard from "../../profile/ProfileCard";

export interface Props {
    attendees: Profile[];
}

export default observer(function ActivityListItemAttendee({attendees}: Props) {
    return (
        <List horizontal>
            {attendees.map(attendee => (
                <Popup
                    hoverable
                    key={attendee.username}
                    trigger={
                        <List.Item key={attendee.username} as={ Link } to={`/profile/${attendee.username}`}>
                            <Image size="mini" circular src={attendee.image || '/assets/user.png'} />
                        </List.Item>
                    }
                >
                    <Popup.Content>
                        <ProfileCard profile={attendee}/>
                    </Popup.Content>
                </Popup>
                
            ))}
        </List>
    );
  })
            {/* <List.Item>
                <Image size="mini" circular src="/assets/user.png" />
            </List.Item>
            <List.Item>
            <Image size="mini" circular src="/assets/user.png" />                
            </List.Item>
            <List.Item>
            <Image size="mini" circular src="/assets/user.png" />
            </List.Item>      */}
    
    
    
    
    
    
    {/* <List.Content>
<List.Header>{attandee}</List.Header> */}
// </List.Content>