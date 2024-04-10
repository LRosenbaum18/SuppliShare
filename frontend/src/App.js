import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {Header} from './components/shared/Header/Header';
import Chat from './components/Messaging/chat';
import Home from './components/Account-Settings/Home';
import ForgotPasswordEmailSubmission from './views/Login/ForgotPassword';
import DonorSignUpView from './views/Login/DonorSignup';
import TeacherSignUpView from './views/Login/DonorSignup';
import WatermarkComponent from './views/Login/watermark';
import ItemUpload from './components/shared/NavBar/itemUpload';
//import Navbar from './components/shared/NavBar/navbar';
import ProductSearchView from './components/Account-Settings/ProductSearch';
import SettingsView from './components/Account-Settings/Settings';
import MessageView from './components/Account-Settings/Messages';
import FlagsRaisedView from './components/Account-Settings/FlagsRaised';
import ReportAndAnalyticsView from './components/Account-Settings/ReportAndAnalytics';
import PostManagementView from './components/Account-Settings/PostManagement';
import UserManagementView from './components/Account-Settings/UserManagement';
import DashboardView from './components/Account-Settings/Dashboard';
import PostDetails from './components/Account-Settings/postdetails'
import { MsalProvider } from "@azure/msal-react";
import msalConfig from './utils/authConfig';
import { PublicClientApplication } from "@azure/msal-browser";
const msalInstance = new PublicClientApplication(msalConfig);
function App() {
	
	//used to handle the navbar and header state
 

  return (
   <MsalProvider instance={msalInstance}>
    <Router>
      <Header showSearch={true} user={{ firstName: 'John' }} />

      <WatermarkComponent />
     {/* other routes  <Navbar navBarState={navBarState} /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/DonorSignUp" element={<DonorSignUpView />} />
        <Route path="/TeacherSignup" element={<TeacherSignUpView />} />
        <Route path="/ForgotPassword" element={<ForgotPasswordEmailSubmission />} />
		<Route path="/itemUpload" element={<ItemUpload />} />
		<Route path="/Settings" element={<SettingsView />} />
		<Route path="/ProductSearch" element={<ProductSearchView />} />
		<Route path="/Messages" element={<MessageView />} />
		<Route path="/FlagsRaised" element={<FlagsRaisedView />} />
		<Route path="/ReportAndAnalytics" element={<ReportAndAnalyticsView />} />
		<Route path="/PostManagement" element={<PostManagementView />} />
		<Route path="/UserManagement" element={<UserManagementView />} />
		<Route path="/Dashboard" element={<DashboardView />} />
		<Route path="/Chat" element={<Chat />} />
		
    <Route path="/home/:listingname/:listingid/:username/:zipcode/:description/:itempictureurl" element={<PostDetails />} />




        {/* other routes */}
      </Routes>
    </Router>
  </MsalProvider>
  );
}

export default App;
