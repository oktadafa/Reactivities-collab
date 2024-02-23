import { Form, Formik } from 'formik'
import React from 'react'
import MyTextInput from '../../app/common/form/MyTextInput'
import { Button } from 'semantic-ui-react'

export default function LoginForm() {
  return (
        <Formik initialValues={{email:'', password:''}}
        onSubmit={value => console.log(value)
        }>
            {({handleSubmit})=> (
<Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
    <MyTextInput placeholder='Email' name='email'/>
    <MyTextInput placeholder='password' type='password' name='password'/>
    <Button positive content='Login'  type='submit' fluid/>
</Form>
            )}
        </Formik>
    )
}
