import  { Fragment } from 'react'
import {Header } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import ActivityListItem from './ActivityListItem';
import { Activity } from '../../../app/models/activities';


export default observer(function ActivityList() {
  const { activityStore } = useStore();

  return (
    <>
      {activityStore.groupActivities.map(([group, activities]) => (
        <Fragment key={group}>
          <Header sub color="teal">
            {group}
          </Header>
              {activityStore.ActivitiesByDate.length > 0 ? (
                activities.map((activity:Activity) => (
                  <ActivityListItem activity={activity} key={activity.id} />
                ))
              ) : (
                <Header content="Not Found" as="h3" textAlign="center" />
              )}
        </Fragment>
      ))}
    </>
  );
}); 