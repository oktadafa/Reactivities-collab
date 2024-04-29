import { useField } from "formik";

interface Props {
  placeholder: string;
  name: string;
  options: any; //{text: string, value: number}[];
  label?: string;
  className: string;
  errorClass: string
}

//jadi klo semisal algi isi form tetapi di alihkanjadi warna merah
export default function MySelectInput(props: Props) {
  const [field, meta, helpers] = useField(props.name);
  return (
    <>
      <label>{props.label}</label>
      <select
        className={
          props.className + " " +(meta.touched && meta.error && props.errorClass)
        }
        value={field.value || null}
        onChange={(e) => helpers.setValue(e.target.value)}
        onBlur={() => helpers.setTouched(true)}
      >
        <option selected disabled>
          Select Cateogry
        </option>
        {props.options.map((e: any) => (
          <option value={e.value}>{e.text}</option>
        ))}
      </select>
      {meta.touched && meta.error ? (
        <p className="text-red-600 text-sm font-bold">{meta.error}</p>
      ) : null}
    </>
  );
}
