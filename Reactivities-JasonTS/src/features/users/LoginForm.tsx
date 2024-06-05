import { observer } from "mobx-react-lite";
import { useStore } from "../../app/store/store";
import { Field, Form, Formik } from "formik";
import { useMutation } from "@tanstack/react-query";
import { loginApi } from "../../app/api/api";
import Swal from "sweetalert2";
import { router } from "../../app/router/router";
import { AxiosResponse } from "axios";
import * as Yup from "yup";
interface user {
  username: string;
  password: string;
}

export default observer(function LoginForm() {
  const {
    modalStore,
    userStore,
    commonStore: { setBearer },
  } = useStore();
  const mutate = useMutation({
    mutationFn: (user: user) => {
      return loginApi(user);
    },
    onError: () => {
      Swal.fire({
        text: "Email Or Password Wrong!",
        title: "Failed",
        icon: "error",
      });
    },

    onSuccess: (data: AxiosResponse<Token>) => {
      modalStore.closeModal();
      userStore.getUser();

      setBearer(data.data);
      router.navigate("/activities");
    },
  });

  const validation = Yup.object({
    username: Yup.string().required(),
    password: Yup.string().required(),
  });

  return (
    <div className="sm:w-[30%] w-[70%] p-4 bg-white rounded-lg mx-auto mt-60">
      <Formik
        validationSchema={validation}
        initialValues={{ username: "", password: "" }}
        onSubmit={(values) => mutate.mutateAsync(values)}
      >
        {({ handleSubmit, isSubmitting, isValid }) => (
          <Form onSubmit={handleSubmit}>
            <p className="text-center text-2xl text-blue-500 font-bold mb-3">
              Login To Reactivities
            </p>
            <Field
              type="text"
              name="username"
              className="w-full border p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none mb-3 rounded-lg"
              placeholder="Username"
            />
            <Field
              type="password"
              name="password"
              className="w-full border p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none mb-3 rounded-lg"
              placeholder="Password"
            />
            <div className="flex justify-end">
              <button
                onClick={() => modalStore.closeModal()}
                className="p-2 bg-gray-600 text-white rounded-lg active:ring-2 active:ring-gray-400 hover:ring-1 hover:ring-gray-300 mr-4"
              >
                Cancel
              </button>
              <button
                className="p-2 bg-green-600 text-white rounded-lg active:ring-2 active:ring-green-400 hover:ring-1 hover:ring-green-300 disabled:bg-green-200 disabled:ring-0 disabled:hover:ring-0"
                disabled={!isValid || isSubmitting}
                type="submit"
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
