import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import './dashboardStyles.css';

const DashboardView = () => {
  const [imageCount, setImageCount] = useState(0);
  const [userCount, setUserCount] = useState(null);
  const [totalItemsDonated, setTotalItemsDonated] = useState(0);
//*setting some const, imagecount with use state predefined as 0/null same goes for usercount, and total items donated */}
  useEffect(() => {
    const fetchImageCount = async () => {
		//*attempting to fetch the image count using an api call */}
      try {
        const response = await fetch('http://localhost:5000/imageCount');
        //*awaiting fetch */}
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
		  //*error handling */}
        }
        //*countData is set to await the response.json data */}
        const countData = await response.json();
		{/* setImage count with count Data.image count */}
        setImageCount(countData.imageCount);
      } catch (error) { 
	    //*catch  the error */}
        console.error('Error fetching image count:', error);
		//*log error and setImageCount usestate to error to show it is an issue with the image count */}
        setImageCount('Error');
      }
    };
    //* fetchuser count declaration */}
    const fetchUserCount = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/user-count');
        //*await fetch to api call user count */}
        if (!response.ok) {
			//*if response is not okay throw a new error with the status code */}
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        //*data = await response.json */}
        const data = await response.json();
		//*set user count to data.user count */}
        setUserCount(data.userCount);
      } catch (error) {
		  //*catch the error */}
        console.error('Error fetching user count:', error);
		//*log the error */}
        setUserCount('Error');
		//*set user count to error to show it is an issue with the usercount */}
      }
    };
     //* total items  donated*/}
    const fetchTotalItemsDonated = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/userData');
        //*let response data await fetch from the api call */}
        if (!response.ok) {
			//*if response is not okay throw a new error */}
          throw new Error('Failed to fetch user data');
        }
        //* user data set to await reponse json*/}
        const { userData } = await response.json();
		//*total donated reduce acc, to user ==> acc + user total items donated */}
        const totalDonated = userData.reduce((acc, user) => acc + user.itemsdonated, 0);
        setTotalItemsDonated(totalDonated);
		//*set total items donated to total donated value */}
      } catch (error) {
		  //*catch the error  */}
        console.error('Error fetching user data:', error);
		{//*log the error  */}
        setTotalItemsDonated('Error');
		//*set total items donated to error so that it can visually display */}
      }
    };
    //*call fetch image coutn fetch user count and fetcch total items donated,  */
    fetchImageCount();
    fetchUserCount();
    fetchTotalItemsDonated();
  }, []);

  return (
  
    <div className="dashboard-container">
	{/*dashboard container, outermost div, to contain all of the typography */}
      <Paper elevation={4} className="dashboard-paper dashboard-paper-first">
		  {/*first with elavation of 4, elevation is used to control how hard the indent goes on the typography, which is from the material UI class/package */}
        <Typography variant="h6" component="div" className="dashboard-typography" gutterBottom>
          User Count
        </Typography>
		{/*user for usercount to display visually */}
        <Typography variant="h4"className="dashboard-typography">{userCount !== null ? userCount : 'Loading...'}</Typography>
      </Paper>
      {/*same as above but with post count */}
      <Paper elevation={4} className="dashboard-paper">
        <Typography variant="h6" component="div" className="dashboard-typography" gutterBottom>
          Post Count
        </Typography>
        <Typography variant="h4" className="dashboard-typography">{imageCount}</Typography>
      </Paper>
	  {/*same as the above two but with total items donated */}
      <Paper elevation={4} className="dashboard-paper">
        <Typography variant="h4" component="div" className="dashboard-typography" gutterBottom>
          Total Items Donated
        </Typography>
        <Typography variant="h4" className="dashboard-typography">{totalItemsDonated}</Typography>
      </Paper>
    </div>
  );
};

export default DashboardView;
