import React from "react";

// @mui
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import { green } from "@mui/material/colors";

// styles
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

// formik
import { Formik, Form } from "formik";
import * as Yup from "yup";

import { Auth } from "aws-amplify";
import { useAppContext } from "../../Lib/ContextLib";

// Components
import Header from "./Header";

const useStyles = makeStyles({
  link: {
    cursor: "pointer",
    "&:hover": {
      color: "#2e7d32",
    },
  },
});

function SignIn() {
  let navigate = useNavigate();
  const [isLoader, setIsLoader] = React.useState(false);
  const { userHasAuthenticated } = useAppContext();

  const classes = useStyles();

  const signInvalidation = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string()
      .required("Required")
      .matches(
        /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
        "Password must contain at least 8 characters, one uppercase, one number and one special case character"
      ),
  });

  const signInData = async (authUserName, authpassword) => {
    setIsLoader(true);
    await Auth.signIn(authUserName, authpassword)
      .then((result) => {
        // console.log("result :::", result);
        setIsLoader(false);
        toast.success("Login");
        userHasAuthenticated(true);
        navigate("/");
      })
      .catch((err) => {
        setIsLoader(false);
        console.log("err sign in :::", err);
        toast.error(err.message);
      });
  };

  return (
    <>
      <Header />
      <Container maxWidth="sm" sx={{ my: 3 }}>
        <Grid
          sx={{
            borderRadius: "25px",
            p: 2,
            boxShadow: 5,
          }}
        >
          <Typography variant="h4" align="center" sx={{ m: 1 }}>
            Sign-In
          </Typography>

          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validationSchema={signInvalidation}
            onSubmit={(values) => {
              // console.log("values :::", values);
              signInData(values.email, values.password);
            }}
          >
            {({ values, handleChange, errors, touched }) => (
              <Form>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      id="email"
                      name="email"
                      label="E-mail"
                      value={values.email}
                      onChange={handleChange}
                      fullWidth
                      variant="standard"
                    />
                    {errors.email && touched.email && (
                      <Divider style={{ color: "red" }}>{errors.email}</Divider>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      type="password"
                      id="password"
                      name="password"
                      label="password"
                      value={values.password}
                      onChange={handleChange}
                      fullWidth
                      variant="standard"
                    />
                    {errors.password && touched.password && (
                      <Divider style={{ color: "red" }}>
                        {errors.password}
                      </Divider>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={12} align="center">
                    {isLoader ? (
                      <div className="customLoader">
                        <CircularProgress
                          sx={{
                            color: green[500],
                          }}
                        />
                      </div>
                    ) : (
                      <Button
                        type="submit"
                        sx={{ width: 200, m: 3 }}
                        variant="contained"
                        color="success"
                      >
                        Submit
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>

          <Typography
            align="center"
            sx={{ m: 1 }}
            onClick={() => navigate("/sign-up")}
            className={classes.link}
          >
            Create New Account
          </Typography>
          <Typography
            align="center"
            sx={{ m: 1 }}
            onClick={() => navigate("/forgot-password")}
            className={classes.link}
          >
            Forgot Password
          </Typography>
        </Grid>
      </Container>
    </>
  );
}

export default SignIn;
