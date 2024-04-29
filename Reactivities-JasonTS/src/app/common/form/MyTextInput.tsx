import { useField } from "formik";

interface Props {
  placeholder: string;
  name: string;
  label?: string;
  type?: string;
  className:string
  errorClass : string;
}

//jadi klo semisal algi isi form tetapi di alihkanjadi warna merah
export default function MyTextInput(props: Props) {
  const [field, meta] = useField(props.name);
  return (
    <>
      <label>{props.label}</label>
      <input
        {...field}
        {...props}
        className={
          props.className +
          " " +
          (meta.touched && meta.error && props.errorClass)
        }
      />
      {meta.touched && meta.error ? (
        <p className="text-red-600 text-sm font-bold">{meta.error}</p>
      ) : null}
    </>
  );
}
