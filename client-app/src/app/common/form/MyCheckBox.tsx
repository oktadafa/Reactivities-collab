import { useField } from "formik";
import { ComponentClass } from "react";
import { CheckboxProps, Form, Item, Label, Menu } from "semantic-ui-react";


export default function CheckBoxInput(props: ComponentClass<CheckboxProps>) {
    const [field, meta, helpers] = useField(props.name!);
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