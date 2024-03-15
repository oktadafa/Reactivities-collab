import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import {Segment, Header, Comment, Loader, Icon, Dropdown, DropdownMenu, DropdownItem, Button} from 'semantic-ui-react'
import { store, useStore } from '../../../app/stores/store';
import { Link } from 'react-router-dom';

import { Formik, Form, Field, FieldProps } from 'formik';
import * as Yup from 'yup';
import {  formatDistanceToNow } from 'date-fns';
import { Activity } from '../../../app/models/activity';
import { profile } from 'console';

interface Props {
    activity:Activity
}

export default observer(function ActivityDetailedChat({activity}: Props) {
    const {commentStore} = useStore();
    
    useEffect(() => {
        if (activity.id) {
            commentStore.createHubConnection(activity.id);
        }
        return () => {
            commentStore.clearComments();
        }
    }, [commentStore,activity.id])
    

    return (
      <>
        <Segment
          textAlign="center"
          attached="top"
          inverted
          color="teal"
          style={{ border: "none" }}
        >
          <Header>Chat about this event</Header>
        </Segment>
        <Segment attached clearing>
          <Comment.Group>
            {commentStore.comments.map((comment) => (
              <Comment key={comment.id}>
                <Comment.Avatar src={comment.image || "/assets/user.png"} />
                <Comment.Content>
                  <Comment.Author as={Link} to={`/profile/${comment.username}`}>
                    {comment.displayName}
                  </Comment.Author>

                  {comment.username == store.userStore.user?.username && (
                    <Dropdown icon="ellipsis vertical" color="grey">
                      <DropdownMenu>
                        <DropdownItem
                          content="hapus"
                          onClick={() =>
                            commentStore
                              .deleteComment(comment.id)
                              .catch((error) => console.log(error))
                          }
                        />
                      </DropdownMenu>
                    </Dropdown>
                  )}

                  <Comment.Metadata>
                    <div>{formatDistanceToNow(comment.createdAt)}</div>
                  </Comment.Metadata>
                  <Comment.Text style={{ whiteSpace: "pre-wrap" }}>
                    {comment.body}
                  </Comment.Text>
                </Comment.Content>
              </Comment>
            ))}
          </Comment.Group>

          <Formik
            onSubmit={(values, { resetForm }) =>
              commentStore
                .addComment(values)
                .then(() => resetForm())
                .catch((err) => console.log(err))
            }
            initialValues={Yup.object({
              body: Yup.string().required(),
            })}
          >
            {({ isSubmitting, isValid, handleSubmit }) => (
              <Form className="ui form">
                <Field name="body">
                  {(props: FieldProps) => (
                    <div style={{ position: "relative" }}>
                      <Loader active={isSubmitting} />
                      <textarea
                        placeholder="Enter your comment to submit, SHIFT + enter for new line"
                        rows={2}
                        {...props.field}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && e.shiftKey) {
                            return;
                          }
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            isValid && handleSubmit();
                          }
                        }}
                      />
                    </div>
                  )}
                </Field>
              </Form>
            )}
          </Formik>
        </Segment>
      </>
    );
})