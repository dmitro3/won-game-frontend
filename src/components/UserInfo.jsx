import React from 'react';

const UserInfo = ({ user }) => {
  // Default image URL
  const defaultImage = '/assets/img/user/male-2.webp'; // Replace with your default image URL

  const styles = {
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      padding: '10px',
      width: '100%',
      backgroundColor: '#212121',
    },
    userImage: {
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      marginRight: '15px',
    },
    userName: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#ddd',
    },
  };

  return (
    <div style={styles.userInfo}>
      <img 
        src={user?.image || defaultImage} 
        alt={user?.name || 'Default User'} 
        style={styles.userImage} 
      />
      <div style={styles.userName}>{user?.name || 'Unknown User'}</div>
    </div>
  );
};

export default UserInfo;
