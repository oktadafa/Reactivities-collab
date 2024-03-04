import { observer } from "mobx-react-lite";
import React from "react";
import { Activity } from "../../app/models/activity";
import { Profile } from "../../app/models/profile";
import { Card, Icon, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";

interface Props{
    profile: Profile;
}


export default observer(function ProfileCard({profile}: Props) {
    return(
        <Card as={ Link } to={`/profile/${profile.username}`}>
            <Image src={profile.image || '/assets/user.png'}/>
            <Card.Content>
                <Card.Header>{profile.username}</Card.Header>
                <Card.Description>Bio goes here </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Icon name='User' />
                20 followers
            </Card.Content>
        </Card>
    )
})

    