import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";
import { Card, Grid, Header, Tab } from "semantic-ui-react";
import ProfileCard from "./ProfileCard";

export default observer(function ProfileFollowings() {
    const {profileStore} = useStore();
    const {profile, followings, loadingFollowings, activeTab} = profileStore;

        console.log(followings);
        
    return (
        <Tab.Pane loading={loadingFollowings}>
            <Grid>
                <Grid.Column width={16}>
                    <Header 
                    floated="left" 
                    icon='user' 
                    content={activeTab === 3 ? `People following ${profile?.displayName}` : `People  ${profile?.displayName} is following`} />  
                </Grid.Column>
                <Grid.Column width={16}>
                    <Card.Group itemPerRows={4}>
                        {followings.map(p => (
                            <ProfileCard key={p.username} profile={p}/>
                            ))}
                    </Card.Group>
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
})



                            // useEffect(() => {
                            //     loadFollowings('following');
                            // }, [loadFollowings])
                        
                            //useEffect tidak di pakai lagi