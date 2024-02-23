import { Header, Item, Segment } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import { observer } from "mobx-react-lite";
import ActivityListItem from "./dashboard/ActivityListItem";
import { Fragment } from "react";
import { Activity } from "../../app/models/activity";

export default observer(function ActivityList() {
    const {activityStore} = useStore();
    const {groupedActivities} = activityStore;

   return(
    <>
        {groupedActivities.map(([group, activities]) => (
        <Fragment key={group}>
            <Header sub color="teal">
                {group}
            </Header>

                {activities.map((activity: Activity) => (
                   <ActivityListItem key={activity.id} activity={activity}/>
                ))}
        </Fragment>
            ))}
    </>
    )
})