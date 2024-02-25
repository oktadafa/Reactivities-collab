import React from "react";
import Calendar from "react-calendar";
import { Header, Menu } from "semantic-ui-react";

export default function ActivityFilters() {
    return(
        <>
            <Menu vertical size="large" style={{width:'100%'}}>
                <Header icon='filter' attached color='teal' content='filters'/>
                <Menu.Item content='all Activities'/>
                <Menu.Item content="i'm going"/>
                <Menu.Item content="I'm Hosting"/>
                <Menu.Item content='all Activities'/>
            </Menu>
            <Header/>
            <Calendar/>
        </>
        
    )
}