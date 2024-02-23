import { Button, Container, Menu } from "semantic-ui-react";
import { useStore } from "../stores/store";
import { NavLink } from "react-router-dom";


export default function Navbar()
{
    const { activityStore } = useStore();

    return (
      <Menu inverted fixed="top">
        <Container>
          <Menu.Item header as={NavLink} to={"/"}>
            <img
              src="/assets/logo.png"
              alt="logo"
              style={{ marginRight: "10px" }}
            />
            Reactivities
          </Menu.Item>
          <Menu.Item name="Activities" as={NavLink} to={"/activities"} />
          <Menu.Item name="Error" as={NavLink} to={"/errors"} />
          <Menu.Item>
            <Button
              positive
              as={NavLink}
              to={"/createActivity"}
              content="Create Activities"
            />
          </Menu.Item>
        </Container>
      </Menu>
    );
}