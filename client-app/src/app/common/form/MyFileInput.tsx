import { useField } from "formik";
import { Form, Label } from "semantic-ui-react";

interface Props {
  name: string;
}

export default function MyFileInput(props: Props) {
  const [field, meta, helpers] = useField(props.name);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    helpers.setValue(file);
  };

  return (
    <Form.Field error={meta.touched && !!meta.error}>
      <input type="file" {...field} {...props} onChange={handleFileChange} />
      {meta.touched && meta.error && (
        <Label basic color="red">
          {meta.error}
        </Label>
      )}
    </Form.Field>
  );
}
