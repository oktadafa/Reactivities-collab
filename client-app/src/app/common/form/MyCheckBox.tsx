import { useField } from "formik";
import { ComponentClass } from "react";
import { CheckboxProps, Form, Label } from "semantic-ui-react";


export default function CheckBoxInput(props: ComponentClass<CheckboxProps>) {
    const [field, meta] = useField(props.name!);
    return(
        <>
        <Form.Field size='tiny'>
            <input {...field} {...props} />
            {meta.touched && meta.error ? (
            <Label basic color='red'>{meta.error}</Label>
            ): null}
        </Form.Field>
        
        </>
    )
}