import { Grid, GridColumn } from 'semantic-ui-react'
import ActivityList from './ActivityList';
import { observer } from 'mobx-react-lite';
import ActivityFilter from './ActivityFilter';


export default observer(function ActivityDashboard() {
  return (
    <Grid>
      <Grid.Column width="10">
        <ActivityList/>
      </Grid.Column>
      <Grid.Column width={6}>
        <ActivityFilter/>
      </Grid.Column>
    </Grid>
  );
})