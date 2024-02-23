import  { ChangeEvent, useEffect, useState } from 'react'
import { Button,  FormField,  FormTextArea, Header, Label, Segment } from 'semantic-ui-react'
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Activity } from '../../../app/models/activities';
import {v4 as uuid} from 'uuid';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import MyTextInput from '../../../app/common/form/MyTextInput';
import MyTextArea from './MyTextArea';
import MySelectInput from '../../../app/common/form/MySelectInput';
import { categoryOptions } from '../../../app/common/options/categoryOptions';
import MyDateInput from '../../../app/common/form/MyDateInput';

export default observer(function ActivityForm() {
  const { activityStore } = useStore();
  const {  updateActivity, createActivity, loadingUpdate, loadActivity, loadingInitial} = activityStore;
  const navigate = useNavigate()
  const [activity, setActivity] = useState<Activity>({
    id: "",
    title: "",
    venue: "",
    category: "",
    description: "",
    city: "",
    date: null,
  });

  const validationSchema = Yup.object({
    title : Yup.string().required("Title is require"),
    city: Yup.string().required("City is required"),
    date: Yup.string().required("Date is required"),
    venue : Yup.string().required("City is require"),
    description : Yup.string().required("Description"),
    category : Yup.string().required("Category is require")
  })

  useEffect(() => {
    if (id) {
      loadActivity(id).then(activity => setActivity(activity!))
    }
  },[loadActivity])
  const {id} = useParams();


  const handleSubmit = (activity:Activity) => {
    if (!activity.id) {
      activity.id =  uuid();
createActivity(activity).then(() => navigate(`/activities/${activity.id}`))  
    }else {
   updateActivity(activity).then(() => navigate(`/activities/${activity.id}`)); 
    }
  };


if (loadingInitial) {
  <LoadingComponent content='Loading App..'/>
}
  
  return (
    <Segment clearing>
      <Header content='Activity Details' sub color='teal'/>
      <Formik
      validationSchema={validationSchema}
        enableReinitialize
        initialValues={activity}
        onSubmit={(values) => handleSubmit(values)}
        autoComplete="off"
      >
        {({ handleSubmit, isValid, isSubmitting, dirty }) => (
          <Form className="ui form" onSubmit={handleSubmit}>
           <MyTextInput placeholder='Title' name='title'/>

            <MyTextArea
            row={3}
              placeholder="Description"
              name="description"
            />
            <MySelectInput
            option={categoryOptions}
              placeholder="Category"
              name="category"
            />
            <MyDateInput
              placeholderText="Date"
              name="date"
              showTimeSelect
              timeCaption='time'
              dateFormat='MMMM d, yyyy h:mm aa'
            />
            <Header content="Location Details" sub color='teal' />
            <MyTextInput
              placeholder="City"
              name="city"
            />
            <MyTextInput
              placeholder="Venue"
              name="venue"
            />
            <Button
              floated="right"
              disabled={isSubmitting || !dirty || !isValid}
              positive
              type="submit"
              content="Submit"
              loading={loadingUpdate}
            />
            <Button
              floated="right"
              type="button"
              content="Cancel"
              as={Link}
              to={"/activities"}
            />
          </Form>
        )}
      </Formik>
    </Segment>
  );
}); 