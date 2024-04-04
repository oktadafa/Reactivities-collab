import { Link } from "react-router-dom";
import '../../app/layout/styles.css'
import { Container, Header, Segment, Image, Button, Icon } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import { observer } from "mobx-react-lite";
import LoginForm from "../users/LoginForm";
import RegisterForm from "../users/RegisterForm";
import { CredentialResponse, GoogleLogin, GoogleOAuthProvider, UseGoogleLoginOptionsImplicitFlow, useGoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
export default observer(function HomePage() {
    const   {userStore, modalStore} = useStore();
    // const login = useGoogleLogin({
    //   onSuccess: (credensialResponse:any) => {
    //     const jwt:any = jwtDecode(credensialResponse)
    //     jwt.displayName = jwt.name
    //     jwt.username = jwt.name
    //     jwt.photo = jwt.picture
    //   },
    //   onError : (eror) => {
    //     console.log(eror)
    //   },
    //   flow:'auth-code'
    // })ss
    const handleSuccess = (credensial:any) => {
          const jwt:any = jwtDecode(credensial)
          jwt.displayName = jwt.name
          jwt.username = jwt.name.split(" ").join(""); 
          jwt.photo = jwt.picture
        console.log(jwt);

          userStore.loginGoogle(jwt).catch(err => console.log(err)
          )
    }
    return (
      <Segment inverted textAlign="center" vertical className="masthead">
        <Container text>
          <Header as="h1" inverted>
            <Image
              size="massive"
              src="/assets/logo.png"
              alt="logo"
              style={{ marginBottom: 12 }}
            />
            Reactivities
          </Header>
          {userStore.isLoggedIn ? (
            <>
              <Header
                as="h2"
                inverted
                content={`Welcome back ${userStore.user?.displayName}`}
              />
              <Button as={Link} to="/activities" size="huge" inverted>
                Go to Activities!!
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => modalStore.openModal(<LoginForm />)}
                size="huge"
                inverted
              >
                Login!!
              </Button>
              <Button
                onClick={() => modalStore.openModal(<RegisterForm />)}
                size="huge"
                inverted
              >
                Register
              </Button>
              <br />
              {/* <Button style={{marginTop:"10px"}} onClick={() => login()} size="huge" color="blue">
                <Icon name="google" color="grey" inverted/>
                Signin With Google
              </Button> */}
              <GoogleLogin
                onSuccess={(credential) => handleSuccess(credential.credential)}
                onError={() => console.log("gagal")}
                useOneTap
              />
            </>
          )}
        </Container>
      </Segment>
    );
})