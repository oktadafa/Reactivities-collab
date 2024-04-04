import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import { Field, FieldProps, Form, Formik } from 'formik'
import React from 'react'
import { Button, Header, Image, Item, ItemContent, ItemGroup, ItemHeader, ItemImage, Segment } from 'semantic-ui-react'
export default function ActivityPost() {
  const form = {
    text:'',
    image: ''
  }
  const handleFormSubmit = (form:any) => {
    console.log(form);
  }

  return (
    <>
      <Segment
        textAlign="center"
        color="teal"
        inverted
        attached="top"
        clearing
        style={{ border: "none" }}
      >
        <Header>New Post Activity</Header>
      </Segment>
      <Segment attached>
        <ItemGroup>
          <Item>
            <ItemImage src={"/assets/user.png"} size="mini" />
            <ItemContent>
              <ItemHeader content="Anda" />
            </ItemContent>
          </Item>
        </ItemGroup>
        <Formik
          initialValues={form}
          onSubmit={(values) => handleFormSubmit(values)}
        >
          {({ isSubmitting, isValid, handleSubmit }) => (
            <Form className="ui form">
              <Field name="text">
                {(props: FieldProps) => (
                  <textarea
                    placeholder="Enter your comment to submit, SHIFT + enter for new line"
                    rows={2}
                    {...props.field}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        return;
                      }
                    }}
                  />
                )}
              </Field>
              <Button onClick={() => handleSubmit()} content="Submit" />
            </Form>
          )}
        </Formik>
      </Segment>
    </>
  );
}
