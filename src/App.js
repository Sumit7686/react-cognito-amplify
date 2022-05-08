import "./App.css";
import React from "react";
import Routers from "./Routers";

import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

import { AppContext } from "./Lib/ContextLib";
import { useNavigate } from "react-router";
import { Auth } from "aws-amplify";

toast.configure();

function App() {
  let navigate = useNavigate();

  const [isAuthenticated, userHasAuthenticated] = React.useState(false);

  React.useEffect(() => {
    Auth.currentSession()
      .then((data) => {
        // console.log(data);
        userHasAuthenticated(true);
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        navigate("/sign-in");
      });
  }, [navigate]);

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        userHasAuthenticated,
      }}
    >
      <Routers />
    </AppContext.Provider>
  );
}

export default App;
