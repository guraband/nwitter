import { React, useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService } from "fbInstance";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      // console.log(user);
      if (user) {
        setIsLoggedIn(true);
        setUserInfo(user);
      } else {
        setIsLoggedIn(false);
        setUserInfo(null);
      }
      setInit(true);
    });
  }, []);
  return <>
    {init ? <AppRouter isLoggedIn={isLoggedIn} userInfo={userInfo} /> : "Initializing..."}
    <footer>&copy; {new Date().getFullYear()} Nwitter</footer>
  </>;
}

export default App;
