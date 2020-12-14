// //  material ui
// import Avatar from "@material-ui/core/Avatar";
// import Button from "@material-ui/core/Button";
// import CssBaseline from "@material-ui/core/CssBaseline";
// import TextField from "@material-ui/core/TextField";
// import FormControlLabel from "@material-ui/core/FormControlLabel";
// import Checkbox from "@material-ui/core/Checkbox";
// import Link from "@material-ui/core/Link";
// import Grid from "@material-ui/core/Grid";
// import Box from "@material-ui/core/Box";
// import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
// import Typography from "@material-ui/core/Typography";
// import { makeStyles } from "@material-ui/core/styles";
// import Container from "@material-ui/core/Container";
// // material ui

// // material ui

// function Copyright() {
//   return (
//     <Typography variant="body2" color="textSecondary" align="center">
//       {"Copyright © "}
//       <Link color="inherit" href="https://material-ui.com/">
//         Your Website
//       </Link>{" "}
//       {new Date().getFullYear()}
//       {"."}
//     </Typography>
//   );
// }

// const useStyles = makeStyles((theme) => ({
//   paper: {
//     marginTop: theme.spacing(8),
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//   },
//   avatar: {
//     margin: theme.spacing(1),
//     backgroundColor: theme.palette.secondary.main,
//   },
//   form: {
//     width: "100%", // Fix IE 11 issue.
//     marginTop: theme.spacing(1),
//   },
//   submit: {
//     margin: theme.spacing(3, 0, 2),
//   },
// }));
// // material ui

import React from "react";
import { reduxForm } from "redux-form";
import { Input, createField } from "../../FormsControls/FormsControls";
import { requiredField } from "../../FormsControls/validators";
import { connect } from "react-redux";
import { signin } from "../../../redux/auth-reducer";
import { Redirect } from "react-router-dom";
import styles from "../../FormsControls/FormsControls.module.scss";

// can show the summary error
// form-level validation
const SigninForm = (props) => {
  const { handleSubmit, pristine, reset, submitting, error } = props;
  return (
    <form onSubmit={handleSubmit} className={styles.wholeForm}>
      {createField("Email", "email", Input, [requiredField])}
      {createField("Password", "password", Input, [requiredField], {
        type: "password",
      })}
      {error && <div className={styles.formSummaryError}>{error}</div>}
      <div className="">
        <button type="submit" disabled={pristine || submitting}>
          Войти
        </button>
      </div>
      <div className="">
        <button type="button" disabled={pristine || submitting} onClick={reset}>
          Очистить значения
        </button>
      </div>
    </form>
  );
};

const SigninReduxForm = reduxForm({ form: "signin" })(SigninForm);

const Signin = (props) => {
  const onSubmit = (formData) => {
    props.signin(formData.email, formData.password);
  };
  if (props.isAuth) return <Redirect to="/catalog" />;

  return (
    <>
      <div className={styles.operationContainer}>
        <h1 className={styles.operationHeader}>Войти в аккаунт</h1>
        <SigninReduxForm onSubmit={onSubmit} />
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  isAuth: state.auth.isAuth,
});

export default connect(mapStateToProps, { signin })(Signin);

// export default class SignIn extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       email: "",
//       password: "",
//       hasAccout: false,
//       name: "",
//     };
//   }
//   componentDidMount() {
//     const db = firebase.database();
//     const name = db.ref("name");
//     name.on("value", (elem) => this.setState({ name: elem.val() }));
//   }

//   handleChange = ({ target: { value, id } }) => {
//     this.setState({ [id]: value });
//   };

//   signInAcc = () => {
//     const { email, password } = this.state;
//     // signup
//     // firebase
//     //   .auth()
//     //   .createUserWithEmailAndPassword(email, password)
//     //   .catch((error) => console.log(error));

//     // login (signin)
//     firebase
//       .auth()
//       .signInWithEmailAndPassword(email, password)
//       .then((response) => {
//         console.log(response);
//         this.setState({ hasAccout: true });
//       })
//       .catch((error) => console.log(error));
//   };

//   render() {
//     // console.log(this.state);
//     return (
//       <>
//         {this.state.hasAccout ? (
//           <div className="className">hello</div>
//         ) : (
//           <div className="login_block">
//             <input
//               type="text"
//               placeholder="email"
//               id="email"
//               onChange={this.handleChange}
//             />
//             <input
//               type="password"
//               placeholder="password"
//               id="password"
//               onChange={this.handleChange}
//             />
//             <input type="submit" onClick={this.signInAcc} />
//           </div>
//         )}
//       </>
//     );
//   }
// }
