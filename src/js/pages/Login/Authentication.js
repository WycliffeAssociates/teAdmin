import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import styled from 'styled-components';
import Loading from '../../components/Loading';
import { getUserHash, createAdminUser, identiconLogin } from '../../actions';
import adminAudio from '../../../assets/adminAudio.webm';
import axios from 'axios';

export class Authentication extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const { history } = this.props.history;
    if(localStorage.getItem('token') != null) {
      this.props.getUserHash(history); // Login by token in the localStorage
    } else {
      var $this = this;
      
      // Try to login by hash
      $this.props.identiconLogin("persistant_admin_user_hash", (success) => {
        if(!success) {
          // If not logged in, create admin user and log in
          axios.get(adminAudio, {responseType: 'arraybuffer'})
            .then(res => {
              const blob = new Blob([res.data], {
                type: 'audio/webm',
              });
              const reader = new FileReader();
              reader.onload = () => {
                $this.props.createAdminUser(reader.result, "persistant_admin_user_hash");
              };
              reader.readAsDataURL(blob);
            });
          
          
          
          // fetch(adminAudio)
          // .then(res => res.blob())
          // .then(blob => {
          //   const reader = new FileReader();
          //   reader.onload = () => {
          //     $this.props.createAdminUser(reader.result, "persistant_admin_user_hash");
          //   };
          //   reader.readAsDataURL(blob);
          // });
        }
      });
    }
  }

  componentDidMount() {
    if(this.props.loggedInUser) {
      this.props.history.push ({
        pathname: '/dashboard',
      });
    }
  }

  componentDidUpdate() {
    if(this.props.loggedInUser) {
      this.props.history.push ({
        pathname: '/dashboard',
      });
    }
  }

  render() {
    return (

      <AuthPage>

        <h2 style={{marginTop: '10vh'}}> Translation Exchange Admin </h2>

        {
          this.props.loading?
          <Loading txt={this.props.txt} height= {'auto'} marginTop='10vh'
          message={'Authentication'}/>
          : ""
        }
        

      </AuthPage>

    );
  }

}

const  AuthPage = styled.div`
  background: #F6F9FE;
  min-width: 250px;
  height: 100vh;
  text-align: center;
  `;
AuthPage.displayName='AuthPage';

const mapDispatchToProps = dispatch => {
  return bindActionCreators({getUserHash, createAdminUser, identiconLogin}, dispatch);
};

const mapStateToProps = state =>{
  const {loggedInUser, loading} = state.user;
  const {txt} = state.geolocation;

  return {loggedInUser, txt, loading};
};

export default connect(mapStateToProps, mapDispatchToProps)(Authentication);