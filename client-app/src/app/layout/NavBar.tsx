import { Button, Container, Menu, Image, Dropdown, Header, IconGroup, Icon } from "semantic-ui-react";
import { Link, NavLink } from "react-router-dom";
import { store, useStore } from "../stores/store";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import userStore from "../stores/userStore";
import notificationStore from "../stores/notificationStore";
import { formatDistanceToNow } from "date-fns";

export default observer(function NavBar() {
    const {userStore: {user, logout}, notificationStore:{loadNotifications, notifications,updateNotification} } = useStore();

    
    useEffect(() => {
      if (store.userStore.user) {
        store.notificationStore.createHubConnection();
        // loadNotifications()  P    
      }
    }, [notificationStore, userStore]);
   
    
    return (
      <Menu inverted fixed="top">
        <Container>
          <Menu.Item as={NavLink} to="/" header>
            <img
              src="/assets/logo.png"
              alt="logo"
              style={{ marginRight: "10px" }}
            />
            Reactivities
          </Menu.Item>
          <Menu.Item as={NavLink} to="/activities" name="Activities" />
          <Menu.Item as={NavLink} to="/errors" name="Errors" />
          <Menu.Item as={NavLink} to="/verify-email" name="verify-email"/>
          <Menu.Item>
            <Button
              as={NavLink}
              to="/createActivity"
              floated="right"
              positive
              content="Create Activity"
            />
          </Menu.Item>

          <Menu.Item position="right">
            <IconGroup style={{ marginRight: "10px" }}>
              <Dropdown scrolling icon="bell" clearable pointing="top right">
                <Dropdown.Menu>
                  {notifications.length < 1 ? (
                    <Header as="h5" content="No Any Notifications" />
                  ) : (
                    notifications.map((e) => (
                      <Dropdown.Item
                        as={Button}
                        style={{width:"250px", display:"flex", justifyContent:"space-between", padding:"40px 40px"}}
                        onClick={() =>
                          updateNotification(e.id, e.userNameFrom, e.isRead)
                        }
                      >
                        <div>
                          <Image
                          src={e.image ? e.image : "/assets/user.png"}
                          avatar
                          spaced="right"
                          />
                        <b>{e.from}</b>
                       {" "} {" "} {e.message}
                          </div>
                        <small>
                          {formatDistanceToNow(
                            new Date(e.date).toLocaleString()
                          )}{" "}
                          {!e.isRead && (
                            <div
                              style={{
                                width: "10px",
                                height: "10px",
                                backgroundColor: "red",
                                borderRadius: 50,
                                position: "absolute",
                                right: 1,
                                top: 5,
                              }}
                            ></div>
                          )}
                        </small>
                      </Dropdown.Item>
                    ))
                  )}
                </Dropdown.Menu>
              </Dropdown>
              {notifications.some(e => !e.isRead) && (
                <Icon name="circle" corner="top right" color="red" />
              )}
            </IconGroup>
            <Image
              src={user?.image || "/assets/user.png"}
              avatar
              spaced="right"
            />
            <Dropdown pointing="top left" text={user?.displayName}>
              <Dropdown.Menu>
                <Dropdown.Item
                  as={Link}
                  to={`/profiles/${user?.username}`}
                  text="My profile"
                />
                <Dropdown.Item onClick={logout} text="Logout" icon="power" />
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Item>
        </Container>
      </Menu>
    );
})