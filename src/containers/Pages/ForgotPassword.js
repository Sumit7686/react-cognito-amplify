import React from "react";

// @mui
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import { useNavigate } from "react-router";
import CircularProgress from "@mui/material/CircularProgress";
import { green } from "@mui/material/colors";

// formik
import { Formik, Form } from "formik";
import * as Yup from "yup";

import { Auth } from "aws-amplify";

// styles
import { makeStyles } from "@mui/styles";
import { toast } from "react-toastify";

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

function ForgotPassword() {
  let navigate = useNavigate();

  const classes = useStyles();

  const [isLoader, setIsLoader] = React.useState(false);
  const [userName, setUserName] = React.useState("");
  const [isForgot, setIsForgot] = React.useState(true);

  const forgotPasswordCheckEmailvalidation = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
  });

  const otpValidation = Yup.object().shape({
    otp: Yup.string()
      .matches(
        /^(0*[1-9][0-9]*(\.[0-9]*)?|0*\.[0-9]*[1-9][0-9]*)$/,
        "Must be only digits"
      )
      .required("Required"),
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

  const forgotPassword = (username) => {
    setIsLoader(true);
    Auth.forgotPassword(username)
      .then((data) => {
        setIsLoader(false);
        console.log(data);
        setUserName(username);
        setIsForgot(false);
        toast.success("Send OTP");
      })
      .catch((err) => {
        setIsLoader(false);
        console.log(err);
        toast.error(err.message);
      });
  };

  const forgotPasswordOTP = (code, new_password) => {
    setIsLoader(true);
    Auth.forgotPasswordSubmit(userName, code, new_password)
      .then((data) => {
        setIsLoader(false);
        console.log(data);
        toast.success("Success");
        navigate("/sign-in");
      })
      .catch((err) => {
        setIsLoader(false);
        console.log(err);
        toast.error(err.message);
      });
  };

  const forgotPasswordData = () => {
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
              Forgot Password
            </Typography>

            <Formik
              initialValues={{
                email: "",
              }}
              validationSchema={forgotPasswordCheckEmailvalidation}
              onSubmit={(values) => {
                console.log("value forgot password data :::", values);
                forgotPassword(values.email);
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
                        <Divider style={{ color: "red" }}>
                          {errors.email}
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
              onClick={() => navigate("/sign-up")}
              className={classes.link}
            >
              Create New Account
            </Typography>
          </Grid>
        </Container>
      </>
    );
  };

  const forgotPasswordOtp = () => {
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
              password: "",
              confirmPassword: "",
            }}
            validationSchema={otpValidation}
            onSubmit={async (values) => {
              console.log("values forgot :::", values);
              forgotPasswordOTP(values.otp, values.password);
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
                      <Divider style={{ color: "red" }}>{errors.otp}</Divider>
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
                        Submit
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

  return <>{isForgot ? forgotPasswordData() : forgotPasswordOtp()}</>;
}

export default ForgotPassword;
