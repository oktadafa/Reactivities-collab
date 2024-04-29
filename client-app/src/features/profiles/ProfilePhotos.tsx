import { observer } from "mobx-react-lite";
import { SyntheticEvent, useState } from "react";
import { Card, Header, Tab, Image, Grid, Button } from "semantic-ui-react";
import { Photo, Profile } from "../../app/models/profile";
import { useStore } from "../../app/stores/store";
import PhotoUploadidget from "../../app/common/imageUpload/PhotoUploadWidget";

interface Props{
    profile: Profile;
}

export default observer(function ProfilePhotos({profile}: Props) {
    const {profileStore: {isCurrentUser, uploudPhoto, uploading,
        loading, setMainPhoto, deletePhoto }} = useStore();
    const [addPhotoMode, setAddPhotoMode] = useState(false);
    const [target, setTarget] = useState('');


    function  handlePhotoUpload(file:Blob){
        uploudPhoto(file).then(() => setAddPhotoMode(false));
    }

    function handleSetMainPhoto(photo: Photo, e: SyntheticEvent<HTMLButtonElement>){
        setTarget(e.currentTarget.name);
        setMainPhoto(photo);
    } 

    function handleDeletePhoto(photo: Photo, e: SyntheticEvent<HTMLButtonElement>) {
        setTarget(e.currentTarget.name);
        deletePhoto(photo);
        
    }

    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated="left" icon='image' content='photo'/>
                    {isCurrentUser && (
                        <Button floated="right" basic 
                            content={addPhotoMode ? 'cancel' : 'Add Photo'}
                            onClick={() => setAddPhotoMode(!addPhotoMode)}
                        />
                  )}
                </Grid.Column>
                <Grid.Column width={16}>
                    {addPhotoMode ? (
                        <PhotoUploadidget uploudPhoto={handlePhotoUpload} loading={uploading}/>
                    ) : (
                        // <Header icon='image' content='Photos' />
                        <Card.Group itemsPerRow={5}>
                            {profile.photos?.map(photo => (
                                <Card key={photo.id}>
                                    <Image src={photo.url} />
                                    {isCurrentUser && (
                                        <Button.Group fluid widths={2}>
                                            <Button
                                                basic
                                                color="green"
                                                content='Main'
                                                // name={'main' + photo.id}
                                                // disabled={photo.isMain}
                                                // loading={target === 'main' + photo.id && loading}
                                                name={`main${photo.id}`} // Nama tombol berdasarkan ID foto
                                                disabled={photo.isMain || target === `main${photo.id}`} // Tombol dinonaktifkan jika foto sudah menjadi utama atau sedang diproses
                                                // loading={target === `main${photo.id}`}
                                                loading={target === `main${photo.id}` && loading}
                                                onClick={e => handleSetMainPhoto(photo, e)}
                                            />
                                            <Button 
                                                basic 
                                                color="red"  
                                                icon='trash' 
                                                loading={target === photo.id && loading}
                                                onClick={e => handleDeletePhoto(photo, e)}
                                                disabled={photo.isMain}
                                                name={photo.id}
                                            />
                                        </Button.Group>
                                    )}
                                </Card>
                            ))}
                    </Card.Group>
                    )}
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
})