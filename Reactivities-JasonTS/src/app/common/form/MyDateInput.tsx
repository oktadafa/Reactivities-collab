import { useField } from "formik";
import DatePicker, { ReactDatePickerProps } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
export default function MyDateInput(props: Partial<ReactDatePickerProps>) {
  const [field, meta, helpers] = useField(props.name!);
  var today = new Date();
  var tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  return (
    <>
      <DatePicker
        {...field}
        {...props}
        minDate={tomorrow}
        className={
          props.className +
          " " +
          (meta.touched &&
            meta.error &&
            "border border-red-500 ring-red-300 ring-2 focus:outline-red-100")
        }
        selected={(field.value && new Date(field.value)) || null}
        onChange={(value) => helpers.setValue(value)}
      />
      {meta.touched && meta.error ? (
        <p className="text-red-600 text-sm font-bold">{meta.error}</p>
      ) : null}
    </>
  );
}
