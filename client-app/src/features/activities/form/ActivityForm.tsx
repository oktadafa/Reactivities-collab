import { useEffect, useState } from "react";
import { Button, Checkbox, Header, Segment } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { Link, useNavigate, useParams } from "react-router-dom";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import {v4 as uuid} from 'uuid'; 
import { Formik,Form } from "formik";
import * as Yup from 'yup';
import MyTextInput from "../../../app/common/form/MyTextInput";
import MyTextArea from "../../../app/common/form/MyTestArea";
import MySelectInput from "../../../app/common/form/MySelectInput";
import { categoryOptions } from "../../../app/common/options/categoryOptions";
import MyDateInput from "../../../app/common/form/MyDateInput";
import { ActivityFormValues } from "../../../app/models/activity";

export default observer(function ActivityForm() {
    const {activityStore} = useStore();
    const {createActivity, updateActivity, loadActivity, loadingInitial} = activityStore;
    const {id} = useParams();
    const navigate = useNavigate();

    const [activity, setActivity] = useState<ActivityFormValues>(new ActivityFormValues());

    const validationSchema = Yup.object({
        title: Yup.string().required('The activity title is required'),
        description: Yup.string().required('The activity description is required'),
        category: Yup.string().required(),
        date: Yup.string().required('Date is required').nullable(),
        city: Yup.string().required(),
        venue  : Yup.string().required(),
        isPrivate: Yup.string()
    })

    useEffect(() => {
        if (id) loadActivity(id).then(activity => setActivity(new ActivityFormValues(activity)))
    },[id, loadActivity]);

    function handleFormSubmit(activity: ActivityFormValues) {
        if(!activity.id){
            let newActivity = {
                ...activity,
                id: uuid()
            }
            // createActivity(newActivity).then(() => navigate(`/activities/${activity.id}`));
            createActivity(newActivity).then(() => navigate(`/activities/${newActivity.id}`));
        } else{
            updateActivity(activity).then(() => navigate(`/activities/${activity.id}`));
        }
    }


    if (loadingInitial) return <LoadingComponent content='loading activity...'/>

        return (
          <Segment clearing>
            <Header content="Activity Details" sub color="teal" />
            <Formik
              validationSchema={validationSchema}
              enableReinitialize
              initialValues={activity}
              onSubmit={(values) => handleFormSubmit(values)
              }
            >
              {({ handleSubmit, isValid, isSubmitting, dirty }) => (
                <Form
                  className="ui form"
                  onSubmit={handleSubmit}
                  autoComplete="off"
                >
                  <MyTextInput name="title" placeholder="Title" />
                  <MyTextArea
                    rows={3}
                    placeholder="Description"
                    name="description"
                  />
                  <MySelectInput
                    options={categoryOptions}
                    placeholder="Category"
                    name="category"
                  />
                  <MyDateInput
                    placeholderText="Date"
                    name="date"
                    showTimeSelect
                    timeCaption="time"
                    dateFormat="MMMM d, YYYY h:mm aa"
                  />


                  {/* <CheckBoxInput
                  onClick = ''
                  name="isPrivate"

                  />  */}

                  {/* <div style={{display:"flex", gap:"10px"}}> */}
                  <Checkbox 
                    type="checkbox" 
                    toggle
                    class='ui toggle checkbox'  
                    label = 'Is Privatedocke'                  
                    />
                    {/* <p>Is Private</p> */}
                  {/* </div> */}

                  <Header content="Location Details" sub color="teal" />
                  <MyTextInput placeholder="City" name="city" />
                  <MyTextInput placeholder="Venue" name="venue" />
                  <Button
                    disabled={!isValid || !dirty || isSubmitting}
                    loading={isSubmitting}
                    floated="right"
                    positive
                    type="submit"
                    content="submit"
                  />
                  <Button
                    as={Link}
                    to="/activities"
                    floated="right"
                    type="button"
                    content="cancel"
                  />
                </Form>
              )}
            </Formik>
          </Segment>
        );
    })