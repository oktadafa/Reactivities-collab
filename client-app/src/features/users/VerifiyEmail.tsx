import { Field, Form, Formik } from "formik";
import { store } from "../../app/stores/store";
import { Button } from "semantic-ui-react";
import { useEffect, useState } from "react";

interface TimeLeft {
  minutes: number;
  seconds: number;
}

export default function VerifiyEmail() {  
  const {userStore} = store;
   const calculateTimeLeft = (): TimeLeft => {
     const nowTime = new Date().getTime();
     const targetTime = new Date(
       store.userStore.user?.expireVerifyCode!
     ).getTime();
     const difference = targetTime - nowTime;
     let timeLeft: TimeLeft = { minutes: 0, seconds: 0 };

     if (difference > 0) {
       timeLeft = {
         minutes: Math.floor(difference / 60000),
         seconds: Math.floor((difference % 60000) / 1000),
       };
       store.userStore.setButtonSendToken(true)
     } else {
       store.userStore.setButtonSendToken(false);
     }

     return timeLeft;
   };

   const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

   useEffect(() => {
     const timer = setTimeout(() => {
       setTimeLeft(calculateTimeLeft());
     }, 1000);

     return () => {
       clearTimeout(timer);
     };
   }, [timeLeft]); 

   const formatTime = (time: number): string => {
     return time < 10 ? `0${time}` : time.toString();
   };

  return (
    <div className="bg-gradient-to-r from-indigo-500 from-69% via-sky-400 vie-30% to-sky-200 to-11% flex justify-center h-screen items-center">
      <div className="bg-white p-10 rounded-xl text-center ">
        <h1 className="font-bold text-2xl mb-4">Verification Email</h1>
        <p className="font-semibold">
          Email was sent to {userStore.user?.email}
        </p>
        <p>
          Please enter the validatin code below, if you have not reveived this
          email, please check your spam, folder
        </p>
        <Formik
          initialValues={{ verifyToken: "" }}
          onSubmit={(values) => store.userStore.sendTokenVerify(values)}
        >
          {({ handleSubmit, isSubmitting }) => (
            <Form onSubmit={handleSubmit} autoComplete="off">
              <Field
                type="text"
                name="verifyToken"
                className="outline-none border-sky-600 border-2 py-1 px-2 rounded-xl my-3 focus:ring-1 w-80"
                placeholder="Your verification code"
              />
              <br />
              <Button
                loading={isSubmitting}
                className="bg-blue-600 text-white w-60 py-1 rounded-xl text-lg shadow-lg hover:ring-1 active:ring-2"
              >
                Verify
              </Button>
            </Form>
          )}
        </Formik>
        <p className="my-3">Or</p>
        <Formik
          onSubmit={() => store.userStore.sendTokenToEmail()}
          initialValues={{}}
        >
          {({ handleSubmit, isSubmitting }) => (
            <Form onSubmit={handleSubmit}>
              <Button
                loading={isSubmitting}
                className="text-blue-800  border-2 border-blue-600 w-60 py-1 rounded-xl text-lg shadow-lg hover:ring-1 active:ring-2"
                disabled={userStore.buttonSendBackVrify}
              >
                Send Code Verification
              </Button>
              <div className="mt-4 text-blue-700 font-bold">
                <span>{formatTime(timeLeft.minutes)}:</span>
                <span>{formatTime(timeLeft.seconds)}</span>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
