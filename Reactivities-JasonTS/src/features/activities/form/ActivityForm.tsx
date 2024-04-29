import { useEffect, useState } from "react";
import { ActivityFormValues } from "../../../app/models/activity";
import * as Yup from 'yup'
import { Field, Form, Formik } from "formik";
import MyTextInput from "../../../app/common/form/MyTextInput";
import MySelectInput from "../../../app/common/form/MySelectInput";
import { categoryOptions } from "../../../app/common/options/categoryOptions";
import MyTextArea from "../../../app/common/form/MyTextArea";
import "../../../assets/css/buttonFormLoader.css"
import { useMutation, useQuery } from "@tanstack/react-query";
import { creacteActivity, getActivityById, updateActivity } from "../../../app/api/api";
import {v4 as uuid} from "uuid"
import MyDateInput from "../../../app/common/form/MyDateInput";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
export default function ActivityForm() {
  const [activity, setActivity] = useState<ActivityFormValues>(new ActivityFormValues())
  const navigate = useNavigate()
  const mutate = useMutation({
    mutationFn : (activity:ActivityFormValues) => {
      if(!activity.id)
        {
          let id = uuid();
          activity.id = id
          return creacteActivity(activity);
        }else {
          console.log(activity);
          
          return updateActivity(activity)          
        }
        
      
    },
    onSuccess: (data) => {
     if (!activity.id) {
      Swal.fire({
        title: "Success",
        text: "Success Created Activity",
        icon: "success",
      });
       navigate(`/activities/${data.data}`)
     }else{
      navigate(`/activities/${activity.id}`)
     }
    },
    onError: (error) => {
      console.log(error)
    }
  })


  const {id} = useParams()
    const {data,isSuccess} = useQuery({
      queryKey: ["byOd", id],
      queryFn : () => getActivityById(id!),
    })

      useEffect(() => {
          if (isSuccess) {
            data.date = new Date(data.date!);
            setActivity(new ActivityFormValues(data))
          }
      },[isSuccess])
  const validationSchema = Yup.object({
    title:Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    category: Yup.string().required("Category is required"),
    date: Yup.string().required("Date is required"),
    city:Yup.string().required("City is rquired"),
    venue: Yup.string().required("Venue is required"),
    isPrivate: Yup.boolean()
  })
    const error = "border border-red-500 ring-red-300 ring-2 focus:outline-red-100";
    
  return (
    <div className="py-20 px-20 flex justify-center">
      <div className="form w-[75%] bg-white p-3 shadow-2xl rounded-md">
        <Formik
          validationSchema={validationSchema}
          initialValues={activity}
          enableReinitialize
          onSubmit={(values) => mutate.mutateAsync(values)}
        >
          {({ handleSubmit, isValid, isSubmitting, dirty }) => (
            <Form onSubmit={handleSubmit}>
              <p className="font-bold text-[#39B8B0] mb-1">Activity Detail</p>
              <MyTextInput
                type="text"
                name="title"
                errorClass={error}
                placeholder="Title"
                className="border-2 w-full p-2 focus:outline-none focus:outline-blue-400 rounded-lg"
              />
              {/* <textarea
                rows={3}
                name="description"
                className="w-full focus:outline-none focus:outline-blue-400 rounded-lg p-2 mt-4 border-2"
                placeholder="Description"
              /> */}
              <MyTextArea
                name="description"
                placeholder="Description"
                rows={3}
                errorClass={error}
                className="w-full focus:outline-none focus:outline-blue-400 rounded-lg p-2 mt-4 border-2"
              />
              {/* <select name="category" className="w-full border-2 rounded-lg p-2 mt-3 focus:outline-none focus:outline-blue-400">
                <option className="text-gray-500 p-2" selected>
                  Category
                </option>
                <option className=" p-2">Category</option>
                <option className=" p-2">Category</option>
                <option className=" p-2">Category</option>
              </select> */}
              <MySelectInput
                name="category"
                options={categoryOptions}
                placeholder="option"
                errorClass={error}
                className="w-full border-2 rounded-lg p-2 mt-3 focus:outline-none focus:outline-blue-400"
              />
              {/* <MyTextInput
                placeholder="date"
                name="date"
                type="datetime-local"
                errorClass={error}
                className="w-full p-2 focus:outline-none focus:outline-blue-400 border-2 rounded-lg mt-4"
              /> */}
              <MyDateInput
                placeholderText="Date"
                name="date"
                showTimeSelect
                timeCaption="time"
                dateFormat="MMMM d, YYYY h:mm aa"
                className="w-full border-2 rounded-lg p-2 mt-3 focus:outline-none focus:outline-blue-400"
              />
              <label htmlFor="private" className="flex items-end">
                <Field
                  type="checkbox"
                  id="private"
                  name="isPrivate"
                  className="size-5 ring-0 mt-3 border-gray-200"
                />
                <p className="ml-2">Is Private</p>
              </label>
              <p className="font-bold text-[#39B8B0] mt-6">Activity Location</p>
              <MyTextInput
                type="text"
                name="city"
                placeholder="City"
                errorClass={error}
                className="border-2 w-full p-2 focus:outline-none focus:outline-blue-400 rounded-lg"
              />
              <MyTextInput
                type="text"
                name="venue"
                errorClass={error}
                placeholder="Venue"
                className="mt-4 border-2 w-full p-2 focus:outline-none focus:outline-blue-400 rounded-lg"
              />

              <div className="mt-4 flex justify-end">
                <Link to={'/activities'} className="bg-gray-600 py-2 px-3 text-white rounded-xl hover:ring-2 hover:ring-gray-300 mr-4 active:ring-4 active:ring-gray-200">
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="bg-green-600 py-2 px-3 text-white rounded-xl hover:ring-2 hover:ring-green-300 active:ring-4 active:ring-green-200 disabled:bg-green-200 disabled:ring-0"
                  disabled={isSubmitting || !dirty || !isValid}
                >
                  Submit
                  {isSubmitting && (
                    <div
                      className="ml-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-e-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]"
                      role="status"
                    >
                      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                        Loading...
                      </span>
                    </div>
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}