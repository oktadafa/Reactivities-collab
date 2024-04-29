import { observer } from 'mobx-react-lite';
import {Button, Header, Item, Segment, Image, Label, Modal, ModalHeader, ModalContent, ModalActions,  List} from 'semantic-ui-react'
import {Activity} from "../../../app/models/activity";
import { Link } from 'react-router-dom';
import { format } from "date-fns";
import { useStore } from '../../../app/stores/store';
import { useEffect, useState } from 'react';

const activityImageStyle = {
    filter: 'brightness(30%)'
};

const activityImageTextStyle = {
    position: 'absolute',
    bottom: '5%',
    left: '5%',
    width: '100%',
    height: 'auto',
    color: 'white'
};


interface Props {
    activity: Activity
}

export default observer (function ActivityDetailedHeader({activity}: Props) {
    const [modal, setModal] = useState(false)
    const {activityStore: {updateAttendance, loading, cancelActivityToggle, addUserActivity, loadingAddUser}, profileStore : {followings, loadFollowers}} = useStore();
    useEffect(() => {
      loadFollowers()
    },[loadFollowers])
    
    return (
      <Segment.Group>
        <Segment basic attached="top" style={{ padding: "0" }}>
          {activity.isCancelled && (
            <Label
              style={{
                position: "absolute",
                zIndex: 1000,
                left: -14,
                top: 20,
              }}
              ribbon
              color="red"
              content="Cancelled"
            />
          )}
          <Image
            src={`/assets/categoryImages/${activity.category}.jpg`}
            fluid
            style={activityImageStyle}
          />
          <Segment style={activityImageTextStyle} basic>
            <Item.Group>
              <Item>
                <Item.Content>
                  <Header
                    size="huge"
                    content={activity.title}
                    style={{ color: "white" }}
                  />
                  <p>{format(activity.date!, "dd MMM yyyy")}</p>
                  <p>
                    Hosted by{" "}
                    <strong>
                      {" "}
                      <Link to={`/profiles/${activity.host?.username}`}>
                        {activity.host?.displayName}
                      </Link>
                    </strong>
                  </p>
                </Item.Content>
              </Item>
            </Item.Group>
          </Segment>
        </Segment>
        <Segment clearing attached="bottom">
          {activity.isHost ? (
            <>
              <Button
                color={activity.isCancelled ? "green" : "red"}
                floated="left"
                basic
                content={
                  activity.isCancelled
                    ? "Re-active Activity"
                    : "Cancel Activity"
                }
                onClick={cancelActivityToggle}
                loading={loading}
              />
              <Button
                color="blue"
                floated="right"
                content="+ Attende"
                onClick={() => {
                  setModal(true);
                }}
              />
              <Button
                as={Link}
                disabled={activity.isCancelled}
                to={`/manage/${activity.id}`}
                color="orange"
                floated="right"
              >
                Manage Event
              </Button>
            </>
          ) : activity.isGoing ? (
            <Button
              loading={loading}
              onClick={/*() =>*/ updateAttendance /*(activity)*/}
            >
              Cancel attendance
            </Button>
          ) : (
            <Button loading={loading} onClick={updateAttendance} color="teal">
              Join Activity
            </Button>
          )}
        </Segment>
        <Modal open={modal} size="mini">
          <ModalHeader>Add Attendee</ModalHeader>
          <ModalContent>
            <List relaxed divided>
              {followings.length < 1 ? <Header content="Empty" as="h4" textAlign='center'/> : followings.map(e => (                
              <Item style={{ position: "relative" }} key={e.username}>
                  <Image size="tiny" src={e.image || "/assets/user.png"} />
                  <Item.Content verticalAlign="middle">
                    <Item.Header as="h4">
                      {e.displayName}
                    </Item.Header>
                    <Button loading={loadingAddUser} content="Add" color='green' onClick={() => addUserActivity(e.username)}/>
                  </Item.Content>
                </Item>
              )) }
               </List>
          </ModalContent>
          <ModalActions>
            <Button
              content="Exit"
              color="red"
              onClick={() => setModal(false)}
            />
          </ModalActions>
        </Modal>
      </Segment.Group>
    );
})