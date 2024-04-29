import { useField } from "formik";

interface Props {
  placeholder: string;
  name: string;
  rows: number;
  label?: string;
  className: string;
  errorClass:string;
}

//jadi klo semisal algi isi form tetapi di alihkanjadi warna merah
export default function MyTextArea(props: Props) {
  const [field, meta] = useField(props.name);
  return (
    <>
      <label>{props.label}</label>
      <textarea {...field} {...props}  className={ props.className +  " "+ (meta.error && meta.touched && props.errorClass) } />
      {meta.touched && meta.error ? (
        <p className="text-red-600 text-sm font-bold">
          {meta.error}
        </p>
      ) : null}
    </>
  );
}
