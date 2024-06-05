import { useMutation } from "@tanstack/react-query";
import { useStore } from "../../app/store/store";
import { observer } from "mobx-react-lite";
import { RegisterApi } from "../../app/api/api";
import { AxiosError, AxiosResponse } from "axios";
import { ErrorMessage, Form, Formik } from "formik";
import ValidationErrors from "../errors/ValidationErrors";
import Swal from "sweetalert2";
import * as Yup from "yup";
import MyTextInput from "../../app/common/form/MyTextInput";
interface UserRegistrasi {
  username: string;
  displayName: string;
  email: string;
  password: string;
}

export default observer(function registerForm() {
  const { modalStore } = useStore();
  const mutate = useMutation({
    mutationFn: (user: UserRegistrasi) => {
      return RegisterApi(user);
    },
    onError: (error: AxiosError) => {
      const { data } = error.response as AxiosResponse;
      const modalStateErrors: string[] = [];
      for (const key in data.errors) {
        if (data.errors[key]) {
          modalStateErrors.push(data.errors[key]);
        }
      }
      throw modalStateErrors.flat();
    },

    onSuccess: () => {
      Swal.fire({
        text: "Created Account Success",
        title: "Success",
        icon: "success",
      });
      modalStore.closeModal();
    },
  });
  const validationSchema = Yup.object({
    username: Yup.string()
      .required("Username Required")
      .matches(/^\S*$/, "Username Can't Contain Spaces")
      .matches(/\d/, "Username Must Contain At Least One Number")
      .matches(/[A-Z]+/, "Username Must Contain At Least One Uppercase Letter")
      .min(6, "Username Must Contain At Least Six Letters"),
    password: Yup.string()
      .required("Password Required")
      .min(8, "Password Must Contain At Least Six Letters")
      .matches(/[A-Z]/, "Password Muts Contain At Least One Uppercase Letter")
      .matches(/\d/, "Password Must Contain At Least One Number")
      .matches(/\W/, "Password Must Contain At Least One Symbol"),
    // .matches(/^(?=.*[a-zA-Z])()().*$/, "Password Invalid"),
    email: Yup.string().required("Email Required").email("Email Invalid"),
    displayName: Yup.string().required("Display Name Required"),
  });
  const error =
    "border border-red-500 ring-red-300 ring-2 focus:outline-red-100";
  return (
    <div className="sm:w-[30%] w-[70%] p-4 bg-white rounded-lg mx-auto mt-40">
      <Formik
        initialValues={{
          email: "",
          password: "",
          displayName: "",
          username: "",
          error: null,
        }}
        onSubmit={(values, { setErrors }) =>
          mutate.mutateAsync(values).catch((error) => setErrors({ error }))
        }
        validationSchema={validationSchema}
      >
        {({ handleSubmit, errors, isValid }) => (
          <Form onSubmit={handleSubmit}>
            <p className="text-center sm:text-2xl text-xl text-blue-500 font-bold mb-3">
              Register To Reactivities
            </p>
            <MyTextInput
              errorClass={error}
              type="text"
              name="displayName"
              className="w-full border p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none mt-3 rounded-lg"
              placeholder="Display Name"
            />

            <MyTextInput
              errorClass={error}
              type="text"
              name="username"
              className="w-full border p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none mt-3 rounded-lg"
              placeholder="Username"
            />
            <MyTextInput
              errorClass={error}
              type="email"
              name="email"
              className="w-full border p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none mt-3 rounded-lg"
              placeholder="Email"
            />
            <MyTextInput
              errorClass={error}
              type="password"
              name="password"
              className="w-full border p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none mt-3 rounded-lg"
              placeholder="Password"
            />
            <ErrorMessage
              name="error"
              render={() => (
                <ValidationErrors
                  errors={errors.error as unknown as string[]}
                />
              )}
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={() => modalStore.closeModal()}
                className="p-2 bg-gray-600 text-white rounded-lg active:ring-2 active:ring-gray-400 hover:ring-1 hover:ring-gray-300 mr-4"
              >
                Cancel
              </button>
              <button
                disabled={!isValid}
                type="submit"
                className="disabled:bg-green-400 p-2 bg-green-600 text-white rounded-lg disabled:active:ring-none active:ring-2 disabled:ring-white  active:ring-green-400 hover:ring-1  hover:ring-green-300 disabled:hover:ring-none"
              >
                Submit
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
});
