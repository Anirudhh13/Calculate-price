import React, { useEffect, useState } from 'react';
import { getVisibility } from '../routes/toggle-registration-form';

const AccountPage = () => {
  const [isRegistrationFormVisible, setIsRegistrationFormVisible] = useState(true);

  useEffect(() => {
    const fetchVisibility = async () => {
      const response = await fetch('/toggle-registration-form');
      const data = await response.json();
      setIsRegistrationFormVisible(data.isRegistrationFormVisible);
    };

    fetchVisibility();
  }, []);

  return (
    <div>
      <h1>Account Page</h1>
      {isRegistrationFormVisible && (
        <form>
          <h2>Register</h2>
          <input type="text" placeholder="Username" required />
          <input type="password" placeholder="Password" required />
          <button type="submit">Register</button>
        </form>
      )}
    </div>
  );
};

export default AccountPage;