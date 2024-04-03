import { Button, Container, Menu, Image, Dropdown, Header } from "semantic-ui-react";
import { Link, NavLink } from "react-router-dom";
import { store, useStore } from "../stores/store";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import userStore from "../stores/userStore";
import notificationStore from "../stores/notificationStore";
import { formatDistanceToNow } from "date-fns";

export default observer(function NavBar() {
    const {userStore: {user, logout}, notificationStore:{loadNotifications, notifications} } = useStore();

    
    useEffect(() => {
      if (store.userStore.user) {
        store.notificationStore.createHubConnection();
        loadNotifications()      
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
            <Dropdown icon="bell" clearable pointing="top right">
              <Dropdown.Menu>
                {notifications.length < 1 ? (
                  <Header as="h5" content="No Any Notifications" />
                ) : (
                  notifications.map((e) => (
                    <Dropdown.Item
                      as={Link}
                      to={`/profiles/${e.userNameFrom}`}
                    >
                      <div style={{padding:"0px 5px"}}>
                        <Image
                          src={e.image ? e.image : "/assets/user.png"}
                          avatar
                          spaced="right"
                        />
                        <b>{e.from}</b> <p>{e.message}</p>
                        <small>
                          {" "}
                          {formatDistanceToNow(
                            new Date(e.date).toLocaleString()
                          )}
                        </small>
                      </div>
                    </Dropdown.Item>
                  ))
                )}
              </Dropdown.Menu>
            </Dropdown>
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