import React, {Component} from 'react';
import styled from 'styled-components';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { getUserHash, removeUser, updateLanguage} from '../../actions';
import * as pages from '../../pageConstants';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "../../../css/react-tabs.css";
import ProjectPage from '../projects/ProjectPage';
import UserPage from '../user/UserPage';
import ConfirmDialog from '../../components/ConfirmDialog';
import MessageDialog from '../../components/MessageDialog';
import Menu, { Item as MenuItem } from 'rc-menu';
import Dropdown from 'rc-dropdown';
import 'rc-dropdown/assets/index.css';
import Languages from '../../../languages/textToDisplay.json';


export class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isConfirmDialogShown: false,
      isMessageDialogShown: false,
      dialogMessage: "",
      confirmMessage: "",
    };
    
    this.confirmCallback = null;
    this.onTabSelected = this.onTabSelected.bind(this);
    this.onConfirmed = this.onConfirmed.bind(this);
    this.onConfirmDialogShown = this.onConfirmDialogShown.bind(this);
    this.onMessageDialogShown = this.onMessageDialogShown.bind(this);
  }

  componentWillMount() {
    const {updateLanguage} = this.props;
    const language = localStorage.getItem('language');
    if (language) {
      updateLanguage(language);
    }
  }

  onConfirmed(isYes) {
    if(isYes) {
      if(this.confirmCallback != null) {
        this.confirmCallback(isYes);
      } else {
        this.setState({isConfirmDialogShown: false});
      }
    } else {
      this.setState({isConfirmDialogShown: false});
    }
  }

  onLanguageSelect({key}) {
    const language = key;
    this.props.updateLanguage(language);
    localStorage.setItem('language', language);
  }

  onConfirmDialogShown(isShown, message, callback) {
    this.confirmCallback = callback;
    this.setState({
      isConfirmDialogShown: isShown,
      confirmMessage: message
    });
  }

  onMessageDialogShown(isShown, message) {
    this.setState({
      isMessageDialogShown: isShown,
      dialogMessage: message
    });
  }

  onTabSelected(index, lastIndex) {
    
  }

  render() {

    const { txt } = this.props;
    const { isConfirmDialogShown, isMessageDialogShown, dialogMessage, confirmMessage } = this.state;
    
    if(!isConfirmDialogShown) {
      this.confirmCallback = null;
    }

    const menu = (
      <Menu onSelect={ ky => this.onLanguageSelect(ky)}>
        {Object.keys(Languages).map(lng => <MenuItem style={{cursor: 'pointer', color: '#fff', backgroundColor: '#000' }} key={lng}> {lng} </MenuItem> )}
      </Menu>
    );

    return (
      <Container>

        { isConfirmDialogShown?
            <ConfirmDialog {...this.props} message={confirmMessage} onConfirmed={this.onConfirmed} />
          : ""
        }

        { isMessageDialogShown?
            <MessageDialog {...this.props} message={dialogMessage} onClick={this.onMessageDialogShown} />
          : ""
        }

        <Tabs defaultIndex={pages.PROJECTS} onSelect={this.onTabSelected}>
            <TabList>
              <Tab>{txt.projects}</Tab>
              <Tab>{txt.users}</Tab>
            </TabList>

            <TabPanel>
              <ProjectPage {...this.props} 
                onConfirmDialogShown={this.onConfirmDialogShown}
                onMessageDialogShown={this.onMessageDialogShown} />
            </TabPanel>

            <TabPanel>
              <UserPage {...this.props} 
                onConfirmDialogShown={this.onConfirmDialogShown}
                onMessageDialogShown={this.onMessageDialogShown} />
            </TabPanel>
        </Tabs>

        <LanguageContainer>
          <Dropdown
            trigger={['click']}
            overlay={menu}
            animation="slide-up"
          >
            <Language>{this.props.txt.languages} <i className="material-icons">language</i></Language>
          </Dropdown>
        </LanguageContainer>

      </Container>
    );
  }
}

const Container = styled.div`
  position: relative;
`;
Container.displayName = 'Container';

const Language = styled.p`
  cursor:pointer;
`;
Language.displayName = 'Language';

const LanguageContainer = styled.div`
  position: absolute;
  top: 15px;
  right: 20px;
`;
LanguageContainer.displayName = 'LanguageContainer';

const mapDispatchToProps = dispatch => {
  return bindActionCreators({getUserHash, removeUser,
    updateLanguage}, dispatch);
};

const mapStateToProps = state =>{
  const {loggedInUser} = state.user;
  const {txt} = state.geolocation;

  return {loggedInUser, txt};
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
