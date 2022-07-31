import { Amplify, Auth, Logger } from 'aws-amplify';
import React, { useEffect, useState } from "react";
import { Authenticator, useAuthenticator, useTheme, View, Image, Heading, Button } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsExports from './aws-exports';
import { SelectField, TextField } from '@aws-amplify/ui-react';
import { Hub } from 'aws-amplify';
import axios from "axios";
import "./App.css";

Amplify.configure(awsExports);
const logger = new Logger('WUS_log', 'DEBUG');

const BACKEND_URL = "http://localhost:5005"; //EC2 IP Addr -->"http://44.206.211.1:5000"
const FRONTEND_URL="http://localhost:3000"; 

export default function App() {
  
  var institution;
  var role;
  var fname;
  var lname;
  var coming_from_signup=false; 
  var confirmed_email =false;
  useEffect(() => {
    
    Hub.listen('auth', (data) => {
      switch (data.payload.event) {
        case 'signIn':
          if(!confirmed_email && coming_from_signup)break;
          console.log('user signed in');
          //(if signup flag then we have this information)
          let username = data.payload.data["username"]
          let attr = data.payload.data["attributes"]
          let email = attr["email"]
          let user_id = attr["sub"]
          console.log(user_id, username, email)
          if(coming_from_signup){
            // console.log(institution,fname,lname,role)
            // Dump data to user route in the backend
            var dataString = {
              "UserID": user_id, 
              "UserName":username,
              "Email": email,
              "Role":role,
              "first_name":fname,
              "last_name":lname,
              "institution":institution,
              "signup_login":coming_from_signup,
              "LoginStatus":true,
            };
            var config = {
              headers: {
                'Access-Control-Allow-Origin': '*'
              }
            };
            
            axios.post(BACKEND_URL + "/user", dataString, config)
            .then((response) => {
              window.location = FRONTEND_URL+"/?userID="+user_id+"&username="+username
            }, (error) => {
              console.log(error);
            });
          }
          else{
            console.log("FE redirect only")
            var dataString = {
              "UserID": user_id, 
              "UserName":username,
              "signup_login":coming_from_signup,
              "LoginStatus":true
            };
            axios.post(BACKEND_URL + "/user", dataString, config)
            .then((response) => {
              window.location = FRONTEND_URL+"/?userID="+user_id+"&username="+username
            }, (error) => {
              console.log(error);
            });
            //Redirect to the frontend
          }
          break;
        case 'signUp':
            console.log('user signed up'); 
            break;
        case 'signOut':
            console.log('user signed out');
            break;
        case 'signIn_failure':
            console.log('user sign in failed');
            break;
        case 'configured':
            console.log('the Auth module is configured');
            break;
        case 'confirmSignUp':
          console.log("Confirmation:",data.payload.data)
          if(data.payload.data =="SUCCESS"){
            confirmed_email = true;
          }
          coming_from_signup = true;
          break;

      }
    });
  }, []);
  
  
  // const services = {
  //   async handleSignUp(formData) {
  //     let { username, password, attributes } = formData;
  //     console.log(formData)
  //     console.log(attributes)
  //     return Auth.signUp({
  //       username,
  //       password,
  //       attributes,
  //     });
      

  //   },
  // }

  // const funcc = async () => {
  //   let user = await Auth.currentAuthenticatedUser();
  //   logger.info('user name = ', user)
  //   const { username } = user;
  //   setUsername(username)
  //   if (user) {
  //     logger.info('Redirect to CHOP WUS page');
  //     //window.location = "http://localhost:3000/?userID="+userID+"&username="+username+"&role="+role;
  //   }
  // }
  // funcc()

  
  
  const components = {
    Header() {
      const { tokens } = useTheme();
  
      return (
        <View textAlign="center" padding={tokens.space.large}>
          <Image
            alt="WUS logo"
            src="./wake_up_safe_logo.png"
          />
        </View>
      );
    },
    SignIn:{
      Footer() {
        const { toSignUp, toResetPassword	 } = useAuthenticator();
  
        return (
          <View textAlign="center">
            <Button
              fontWeight="normal"
              onClick={toSignUp}
              size="small"
              variation="link"
            >
              New User?
            </Button>
            <Button
              fontWeight="normal"
              onClick={toResetPassword}
              size="small"
              variation="link"
            >
              Forgot Password?
            </Button>
          </View>
          
        );
      },
    },
    SignUp: {
      FormFields(){
        const { validationErrors } = useAuthenticator();
        return(
          <>
            
            <TextField
              isRequired={true}
              errorMessage={validationErrors.lname}
              hasError={!!validationErrors.lname}
              key="lastname"
              name="lastname"
              placeholder="Last Name"
              onChange = {(e)=>{fname = e.target.value}} />
            <TextField
              isRequired={true}
              errorMessage={validationErrors.fname}
              hasError={!!validationErrors.fname}
              key="firstname"
              name="firstname"
              placeholder="First Name"
              onChange = {(e)=>{lname = e.target.value}}/>
            <SelectField
              isRequired={true}
              errorMessage={validationErrors.institution}
              hasError={!!validationErrors.institution}
              key='institution'
              name='institution'
              placeholder="Institution"
              onChange = {(e)=>{institution = e.target.value}}>
              <option value="1">Akron Children’s Hospital</option>
              <option value="2">Ann and Robert H. Lurie Children’s Hospital of Chicago</option>
              <option value="3">Arkansas Children’s Hospital</option>
              <option value="4">Buffalo Children’s Hospital</option>
              <option value="5">Cardinal Glennon Children’s Hospital, St. Louis, MO</option>
              <option value="6">Children’s Hospital Boston</option>
              <option value="7">Children’s Hospital Los Angeles</option>
              <option value="8">Children’s Hospitals and Clinics of Minnesota</option>
              <option value="9">Children’s Hospital of Omaha</option>
              <option value="10">The Children’s Hospital of Philadelphia</option>
              <option value="11">Children’s Hospital of Pittsburgh</option>
              <option value="12">Children’s Medical Center, Dallas, TX</option>
              <option value="13">Children’s National Medical Center, Washington DC</option>
              <option value="14">Cleveland Clinic Children’s Hospital</option>
              <option value="15">Cincinnati Children’s Hospital Medical Center</option>
              <option value="16">Colorado Children’s Hospital</option>
              <option value="17">Cook Children’s Hospital</option>
              <option value="18">Dayton Children’s Hospital</option>
              <option value="19">Dell Children’s Medical Center</option>
              <option value="20">Emory Children’s Center</option>
              <option value="21">Johns Hopkins All Children’s Hospital</option>
              <option value="22">Johns Hopkins Children’s Center</option>
              <option value="23">Kaiser Oakland Medical Center</option>
              <option value="24">Lucile Salter Packard Children’s Hospital at Stanford</option>
              <option value="25">Medical University of South Carolina</option>
              <option value="26">Montefiore Children’s Hospital</option>
              <option value="27">Monroe Carell Jr Children’s Hospital at Vanderbilt</option>
              <option value="28">Morgan Stanley Children’s Hospital of Columbia University Medical Center</option>
              <option value="29">Nationwide Children’s Hospital</option>
              <option value="30">Nemours/Alfred I DuPont Hospital for Children</option>
              <option value="31">Penn State Hershey Children’s Center</option>
              <option value="32">Phoenix Children’s Hospital</option>
              <option value="33">Riley Children’s Hospital</option>
              <option value="34">Seattle Children’s Hospital</option>
              <option value="35">St. Jude Children’s Research Hospital</option>
              <option value="36">Texas Children’s Hospital</option>
              <option value="37">University of Iowa Stead Family Children’s Hospital</option>
              <option value="38">University of Michigan C. S. Mott Children’s Hospital</option>
              <option value="39">US Anesthesia Partners</option>
            </SelectField>
            <SelectField
              isRequired={true}
              errorMessage={validationErrors.role}
              hasError={!!validationErrors.role}
              key='role'
              name='role'
              placeholder="Role"
              onChange = {(e)=>{role = e.target.value}}>
              <option value="1">Administrator</option>
              <option value="2">IT</option>
              <option value="3">Provider</option>
            </SelectField>

            <Authenticator.SignUp.FormFields />
          </>
        )
      },
      Footer() {
        const { toSignIn } = useAuthenticator();
  
        return (
          <View textAlign="center">
            <Button
              fontWeight="normal"
              onClick={toSignIn}
              size="small"
              variation="link"
            >
              Back to Sign In
            </Button>
          </View>
        );
      },
    }
  }
  return (
    <Authenticator
      initialState="signIn"
      // services={services}
      components={components}
    >
      {({ signOut, user }) => (
        <main>
          <center>
          <h2>Hello {user.username}</h2>
          <button className="br3 pa2" onClick={signOut}>Sign out</button><br></br><br></br><br></br><br></br>
          <a className="blue underline b f3" onClick={()=>{
            // console.log(user["attributes"]["sub"])
            let user_id = user["attributes"]["sub"]
            let username = user["username"]
            window.location = FRONTEND_URL+"/?userID="+user_id+"&username="+username
            }
          }
          >
            Go to Wake Up Safe
          </a>
          </center>
          
        </main>
      )}
    </Authenticator>
  );
}
