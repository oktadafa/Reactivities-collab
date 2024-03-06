import React, { SyntheticEvent, useEffect } from "react";
import { observer } from "mobx-react-lite";
import ProfileStore from "../../app/stores/profileStore";
import { useStore } from "../../app/stores/store";
import { Card, Grid, Header, Tab, TabPane, TabProps, Image } from "semantic-ui-react";
import { Activity } from "../../app/models/activity";
import { userActivity } from "../../app/models/profile";
import { Link } from "react-router-dom";
import { format } from "date-fns";

const panes = [
    { menuItem: 'Future Events', pane: {key: 'future' } },
    {menuItem: 'Past Events', pane: {key: 'past'} },
    {menuItem: 'Hosting,', pane: {key: 'hosting'} }
];

export default observer(function ProfileActivities() {
    const { profileStore } = useStore();
    const {
        loadUserActiviies,
        profile,
        loadingActivities,
        userActivities,
    } = profileStore;

    useEffect(() => {
        loadUserActiviies(profile!.username);
    }, [loadUserActiviies, profile]);

    const handleTabChange = (e: SyntheticEvent, data: TabProps) => {
        loadUserActiviies(profile!.username, panes[data.activeIndex as number].pane.key);
    };

    return(
        <Tab.Pane loading ={loadingActivities}>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated="left" icon='calender' content={'Activities'}/>
                </Grid.Column>
                <Grid.Column width={16}>
                    <Tab
                        panes={panes}
                        menu={{ secondary: true, pointing: true }}
                        onTabChange={(e, data ) =>handleTabChange(e, data)}
                    />
                    <br />
                    <Card.Group itemPerRows={4}>
                        {userActivities.map((activity: userActivity) => (
                            <Card
                                as={Link}
                                to={`/activities/${activity.id}`}
                                key={activity.id}

                            >
                                <Image
                                    src={`/assets/categoryImages/${activity.category}.jpg`}
                                    style={{ minHeight: 100, objectFit: 'cover'}}
                                
                                />
                                <Card.Content>
                                    <Card.Header textAlign='center'>{activity.title}</Card.Header>
                                    <Card.Meta textAlign='center'>
                                        <div>{format(new Date(activity.date), 'do LLL')}</div>
                                        <div>{format(new Date(activity.date), 'h:mm a')}</div>
                                    </Card.Meta>
                                </Card.Content>
                            </Card>
                        ))}
                    </Card.Group>
                </Grid.Column>
            </Grid>
        </Tab.Pane>      
    );
});