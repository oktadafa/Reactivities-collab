import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import {Segment, Header, Comment, Dropdown, DropdownMenu, DropdownItem, Icon} from 'semantic-ui-react'
import { store, useStore } from '../../../app/stores/store';
import { Link } from 'react-router-dom';
import {  formatDistanceToNow } from 'date-fns';
import { Activity } from '../../../app/models/activity';
import { useForm } from 'react-hook-form';

interface Props {
    activity:Activity
}

export default observer(function ActivityDetailedChat({activity}: Props) {
    const {commentStore} = useStore();
    // const[selectedFile, setSelectedFile] = useState<File |null>(null)
    // const[preveiwImage, setPreveiwImage] = useState<any>('')
    const {register,handleSubmit, reset} = useForm()
    // const [meta,helpers] = useField("file")
    // const handleChange = (e:any) => {
    //   const file  = e.target.files[0]
    //   setSelectedFile(file)

    //   if (file) {
    //     const reader = new FileReader()
    //     reader.onloadend = () => {setPreveiwImage(reader.result)}
    //     reader.readAsDataURL(file);
    //   }else {
    //     setPreveiwImage('')
    //   }
    // }
    
    useEffect(() => {
        if (activity.id) {
            commentStore.createHubConnection(activity.id);
        }
        return () => {
            commentStore.clearComments();
        }
    }, [commentStore,activity.id])
    

    return (
      <>
        <Segment
          textAlign="center"
          attached="top"
          inverted
          color="teal"
          style={{ border: "none" }}
        >
          <Header>Chat about this event</Header>
        </Segment>
        <Segment attached clearing>
          <Comment.Group>
            {commentStore.comments.map((comment) => (
              <Comment key={comment.id}>
                <Comment.Avatar src={comment.image || "/assets/user.png"} />
                <Comment.Content>
                  <Comment.Author as={Link} to={`/profile/${comment.username}`}>
                    {comment.displayName}
                  </Comment.Author>

                  {comment.username == store.userStore.user?.username && (
                    <Dropdown icon="ellipsis vertical" color="grey">
                      <DropdownMenu>
                        <DropdownItem
                          content="hapus"
                          onClick={() =>
                            commentStore
                              .deleteComment(comment.id)
                              .catch((error) => console.log(error))
                          }
                        />
                      </DropdownMenu>
                    </Dropdown>
                  )}

                  <Comment.Metadata>
                    <div>{formatDistanceToNow(comment.createdAt)}</div>
                  </Comment.Metadata>
                  <Comment.Text style={{ whiteSpace: "pre-wrap" }}>
                    {comment.body}
                  </Comment.Text>
                  {comment.commentImage && (
                    <img src={comment.commentImage} style={{ width: "50%" }} />
                  )}
                </Comment.Content>
              </Comment>
            ))}
          </Comment.Group>
          <form
            onSubmit={handleSubmit((data) => {
              commentStore
                .addComment(data, data.file[0])
                .then((_) => reset())
                .catch((err) => console.log(err));
            })}
          >
            <input {...register("body", { required: true })} className="w-80 border-2 px-1 py-2 border-blue-400 rounded-xl" placeholder='Message'/>
            <label htmlFor='file'>
              <Icon name='photo' circular className='bg-blue-400 border-none hover:bg-white hover:border-blue-900' size='large'/>
            <input type="file" {...register("file")} className="hidden" id='file'/>
            </label>
            <button type="submit" className='py-1 bg-green-700 px-7 text-white rounded-lg'>test</button>
          </form>
        </Segment>
      </>
    );
})