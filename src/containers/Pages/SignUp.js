import React from "react";

// @mui
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
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

const SignUp = () => {
  let navigate = useNavigate();

  // const { userHasAuthenticated, setIsAuthToken } = useAppContext();

  const [isLoader, setIsLoader] = React.useState(false);
  const [isSignUp, setIsSignUp] = React.useState(false);
  const [authUserName, setAuthUserName] = React.useState("");

  const classes = useStyles();

  const signUpvalidation = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string()
      .required("Required")
      .matches(
        /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
        "Password must contain at least 8 characters, one uppercase, one number and one special case character"
      ),
    confirmPassword: Yup.string()
      .test("passwords-match", "Passwords must match", function (value) {
        return this.parent.password === value;
      })
      .required("Required"),
  });

  const otpValidation = Yup.object().shape({
    otp: Yup.string()
      .matches(
        /^(0*[1-9][0-9]*(\.[0-9]*)?|0*\.[0-9]*[1-9][0-9]*)$/,
        "Must be only digits"
      )
      .required("Required"),
  });

  const signUpAuth = async (email, password) => {
    setIsLoader(true);
    // attributes: firstName, lastname, phoneNumber, ID or Passport
    await Auth.signUp({
      username: email,
      password,
    })
      .then((result) => {
        setIsLoader(false);
        setAuthUserName(email);
        toast.success("Send OTP");
        setIsSignUp(true);
        // console.log("result sign up :::", result);
      })
      .catch((error) => {
        setIsLoader(false);
        toast.error(error.message);
        console.log("error sign up :::", error);
      });
  };

  const verifyOtp = async (code) => {
    setIsLoader(true);
    await Auth.confirmSignUp(authUserName, code)
      .then(async (result) => {
        setIsLoader(false);
        toast.success("Success");
        navigate("/sign-in");
        // console.log("result verify otp :::", result);
      })
      .catch((error) => {
        setIsLoader(false);
        toast.error(error.message);
        console.log("error verify otp :::", error);
      });
  };

  const renderForm = () => {
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
              Sign-Up
            </Typography>

            <Formik
              initialValues={{
                email: "",
                password: "",
              }}
              validationSchema={signUpvalidation}
              onSubmit={(values) => {
                signUpAuth(values.email, values.password);
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
                        <div style={{ color: "red" }}>{errors.email}</div>
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
                        <div style={{ color: "red" }}>{errors.password}</div>
                      )}
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <TextField
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        label="Confirm Password"
                        value={values.confirmPassword}
                        onChange={handleChange}
                        fullWidth
                        variant="standard"
                      />
                      {errors.confirmPassword && touched.confirmPassword && (
                        <div style={{ color: "red" }}>
                          {errors.confirmPassword}
                        </div>
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
                          Send OTP
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
              onClick={() => navigate("/sign-in")}
              className={classes.link}
            >
              Login
            </Typography>
          </Grid>
        </Container>
      </>
    );
  };

  const renderConfirmationForm = () => {
    return (
      <Container maxWidth="sm" sx={{ my: 3 }}>
        <Grid
          sx={{
            borderRadius: "25px",
            p: 2,
            boxShadow: 5,
          }}
        >
          <Typography variant="h4" align="center" sx={{ m: 1 }}>
            OTP
          </Typography>

          <Formik
            initialValues={{
              otp: "",
            }}
            validationSchema={otpValidation}
            onSubmit={async (values) => {
              verifyOtp(values.otp);
            }}
          >
            {({ values, handleChange, errors, touched }) => (
              <Form>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      id="otp"
                      name="otp"
                      label="Otp"
                      value={values.otp}
                      onChange={handleChange}
                      fullWidth
                      variant="standard"
                    />
                    {errors.otp && touched.otp && (
                      <div style={{ color: "red" }}>{errors.otp}</div>
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
                        Verify
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </Grid>
      </Container>
    );
  };

  return <>{isSignUp ? renderConfirmationForm() : renderForm()}</>;
};

export default SignUp;
