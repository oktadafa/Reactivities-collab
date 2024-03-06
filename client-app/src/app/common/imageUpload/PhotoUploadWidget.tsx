import { useEffect, useState } from "react";
import { Button, Grid, Header } from "semantic-ui-react";
import PhotoWidgetDropzone from "./PhotoWidgetDropzone";
import PhotoWidgetCropper from "./PhotoWidgetCropper";


interface Props {
    loading: boolean;
    uploudPhoto: (file: Blob) => void;
}

export default function PhotoUploadidget({loading, uploudPhoto}: Props) {
    const [files, setFiles] = useState<any>([]);
    const [cropper, setCropper ] =useState<Cropper>();

    function onCrop() {
        if (cropper) {
            cropper.getCroppedCanvas().toBlob(blob => uploudPhoto(blob!));
        }
    }

    useEffect(() => {
        return () => {
            files.forEach((file: any) => URL.revokeObjectURL(file.preview))
            }
    }, [files])
    return(
        <Grid>
            <Grid.Column width={4}>
                <Header sub color="teal" content='step 1 - add photo'/>
                <PhotoWidgetDropzone setFiles={setFiles}/>
            </Grid.Column>
            <Grid.Column width={1}/>
            <Grid.Column width={4}>
                <Header sub color="teal" content='step 2 - resize image'/>
                {files && files.length > 0 && (
                    <PhotoWidgetCropper setCropper = {setCropper} imagePreview={files[0].preview}/>
                )}
            </Grid.Column>
            <Grid.Column width={1}/>
            <Grid.Column width={4}>
                <Header sub color="teal" content='step 3 - preview & upload'/>
                {files && files.length > 0 &&
                <>
                <div className="img-preview" style={{minHeight: 200, overflow: 'hidden'}}/>
                <Button.Group widths={2}>
                    <Button loading={loading} onClick={onCrop} positive icon='check'/>
                    <Button disabled={loading} onClick={() => setFiles([])} icon='close'/>
                </Button.Group>
                </>}
            </Grid.Column>
        </Grid>
    )
}