import { Field, Form, Formik } from 'formik'
import React from 'react'
import { FaPaperPlane } from 'react-icons/fa6'
import { useStore } from '../../store/store'
import { observer } from 'mobx-react-lite'
import { useMutationSendComment } from '../service'

interface Props {
  img:string,
  id:string,
  setFile: React.Dispatch<React.SetStateAction<string>>
}
export default observer(function ImgPreview({img, id, setFile}:Props) {
  const {mutateAsync} = useMutationSendComment()
  return (
    <div className="z-30 fixed top-0 left-0 bottom-0 right-0 bg-[rgb(0,0,0,0.7)] flex items-center justify-center">
      <div>
        <img src={img} className='w-60'/>
        <div className='flex items-center mt-6 justify-center'>
          <Formik initialValues={{body:"", commentImage:img, activityId:""}} onSubmit={(values,{resetForm}) => {
            values.activityId = id;
            mutateAsync(values).then(data => {
              setFile("")
            }
            )
          return resetForm()
          } 
          }>
              {({handleSubmit}) => (
                <Form className='flex' onSubmit={handleSubmit}>
                     <Field className='p-2 border rounded-xl w-80 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-400' placeholder='Enter you message' type='text' name="body"/>
                     <button type='submit' className='flex bg-green-500 p-2 text-white items-center rounded ml-3'><FaPaperPlane/> Send</button>
                </Form>
              )}
          </Formik>
        </div>
      </div>
    </div>
  )
}
) 