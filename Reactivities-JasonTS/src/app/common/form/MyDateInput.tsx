import { useField } from "formik";
import DatePicker, { ReactDatePickerProps } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

//jadi klo semisal lagi isi form tetapi di alihkanjadi warna merah
export default function MyDateInput(props: Partial<ReactDatePickerProps>) {
  const [field, meta, helpers] = useField(props.name!);
  return (
    <>
      <DatePicker
        {...field}
        {...props}
        className={props.className + " " +
          (meta.touched &&
          meta.error &&
          "border border-red-500 ring-red-300 ring-2 focus:outline-red-100"
        )}
        selected={(field.value && new Date(field.value)) || null}
        onChange={(value) => helpers.setValue(value)}
      />
      {meta.touched && meta.error ? (
        <p className="text-red-600 text-sm font-bold">{meta.error}</p>
      ) : null}
    </>
  );
}
