import { React, useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService } from "fbInstance";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const updateUserDisplayName = (newDisplayName) => {
    setUserInfo({
      displayName: newDisplayName,
      uid: userInfo.uid,
      updateProfile: (args) => userInfo.updateProfile(args),
    });
  }

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      // console.log(user);
      if (user) {
        setIsLoggedIn(true);
        setUserInfo({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (args) => user.updateProfile(args),
        });
      } else {
        setIsLoggedIn(false);
        setUserInfo(null);
      }
      setInit(true);
    });
  }, []);
  return <>
    {init ? <AppRouter isLoggedIn={isLoggedIn} userInfo={userInfo} updateUserDisplayName={updateUserDisplayName} /> : "Initializing..."}
    <footer>&copy; {new Date().getFullYear()} Nwitter</footer>
  </>;
}

export default App;
