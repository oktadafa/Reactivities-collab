import { observer } from "mobx-react-lite";
import { Grid } from "semantic-ui-react";
import { store, useStore } from "../../../app/stores/store";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import ActivityDetailedHeader from "./ActivityDetailedHeader";
import ActivityDetailedInfo from "./ActivityDetailedInfo";
import ActivityDetailedChat from "./ActivityDetailedChat";
import ActivityDetailedSidebar from "./ActivityDetailedSidebar";


export default observer(function ActivityDetails() {
    const { activityStore, profileStore} = useStore();
    const { selectedActivity: activity, loadActivity, loadingInitial } = activityStore;
    const {loadFollowers} = profileStore
    const {id} = useParams();


    useEffect(() => {
        if (id) loadActivity(id);
        loadFollowers()
    }, [id, loadActivity,loadFollowers,activity?.attendees]);

    if (loadingInitial || !activity) return <LoadingComponent/>
    
    return (
      <Grid>
        <Grid.Column width={10}>
          <ActivityDetailedHeader activity={activity} />
          <ActivityDetailedInfo activity={activity} />
          {activity.isGoing && <ActivityDetailedChat activity={activity} />}
        </Grid.Column>
        {activity.isGoing && (
          <Grid.Column width={6}>
            <ActivityDetailedSidebar activity={activity} />
          </Grid.Column>
        )}
      </Grid>
    );
}
)
