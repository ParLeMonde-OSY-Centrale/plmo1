import React, {useContext, useState} from "react";
import PropTypes from "prop-types";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Link,
  InputAdornment,
  IconButton, Button
} from "@material-ui/core";
import Autocomplete from '@material-ui/lab/Autocomplete';
import {LanguagesServiceContext} from "../../services/LanguagesService";
import {Visibility, VisibilityOff} from "@material-ui/icons";

const frenchClasses = [
  "CP",
  "CE1",
  "CE2",
  "CM1",
  "CM2"
];

export const DEFAULT_USER = {
  managerFirstName: "",
  managerLastName: "",
  mail: "",
  pseudo: "",
  schoolId: "",
  level: "",
  languageCode: "fr",
  password: "",
  passwordConfirm: "",
};

function CreateAccountForm({user, setUser, noAutoComplete, hideCreatePassword, submit}) {
  const { getLanguages } = useContext(LanguagesServiceContext);
  const [showPassword, setShowPassword] = useState(false);
  const languages = (getLanguages.complete && !getLanguages.error) ? getLanguages.data : [];

  const handleInputChange = userKey => (event) => {
    event.preventDefault();
    if (userKey === "schoolId") {
      const schoolId = parseInt(event.target.value, 10);
      setUser({ ...user, schoolId: Number.isNaN(schoolId) ? "" : schoolId });
      return;
    }
    setUser({ ...user, [userKey]: event.target.value })
  };

  const handleToggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await submit();
  };

  return (
    <form className="signup-form" noValidate autoComplete={noAutoComplete ? "off" : ""}>
      <TextField
        id="firstname"
        name="firstname"
        type="text"
        color="secondary"
        label="Prénom du professeur"
        value={user.managerFirstName || ""}
        onChange={handleInputChange("managerFirstName")}
        variant="outlined"
        fullWidth
      />
      <TextField
        id="lastname"
        name="lastname"
        type="text"
        color="secondary"
        label="Nom du professeur"
        value={user.managerLastName || ""}
        onChange={handleInputChange("managerLastName")}
        variant="outlined"
        fullWidth
      />
      <TextField
        id="email"
        name="email"
        type="email"
        color="secondary"
        label="E-mail du professeur"
        value={user.mail || ""}
        onChange={handleInputChange("mail")}
        variant="outlined"
        fullWidth
      />
      <TextField
        id="username"
        name="username"
        type="text"
        color="secondary"
        label="Pseudo de la classe"
        value={user.pseudo || ""}
        onChange={handleInputChange("pseudo")}
        variant="outlined"
        fullWidth
        helperText="Utilisé pour la connection par les élèves"
      />
      <FormControl variant="outlined" color="secondary">
        <InputLabel htmlFor="outlined-age-native-simple">École</InputLabel>
        <Select
          native
          value={user.schoolId === undefined ? "" : user.schoolId}
          onChange={handleInputChange("schoolId")}
          label="École"
          inputProps={{
            name: 'school',
            id: 'school',
          }}
        >
          <option aria-label="None" value="" />
          <option value={0}>Mon école n&apos;apparait pas dans la liste</option>
        </Select>
        {
          user.schoolId === 0 && (
            <FormHelperText>
              <Link href="#" target="_blank">
                Ajouter mon école ?
              </Link>
            </FormHelperText>
          )
        }
      </FormControl>
      <Autocomplete
        id="classe"
        freeSolo
        options={frenchClasses}
        renderInput={params => (
          <TextField
            {...params}
            label="Niveau de la classe"
            value={user.level || ""}
            onChange={handleInputChange("level")}
            variant="outlined"
            color="secondary" />
        )}
      />
      <FormControl variant="outlined" color="secondary">
        <InputLabel htmlFor="outlined-age-native-simple">Langue de préférence</InputLabel>
        <Select
          native
          value={user.languageCode || ""}
          onChange={handleInputChange("languageCode")}
          label="Langue de préférence"
          inputProps={{
            name: 'languageCode',
            id: 'languageCode',
          }}
        >
          <option aria-label="None" value="" />
          {
            languages.map(l => (
              <option value={l.value} key={l.id}>{l.label}</option>
            ))
          }
        </Select>
      </FormControl>

      {hideCreatePassword || (
        <React.Fragment>
          <TextField
            type={showPassword ? 'text' : 'password'}
            color="secondary"
            id="password"
            name="password"
            label="Mot de passe"
            value={user.password || ""}
            onChange={handleInputChange("password")}
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleToggleShowPassword}
                    edge="end"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            fullWidth
          />
          <TextField
            type={showPassword ? 'text' : 'password'}
            color="secondary"
            id="passwordComfirm"
            name="passwordComfirm"
            label="Confirmer le mot de passe"
            value={user.passwordConfirm || ""}
            onChange={handleInputChange("passwordConfirm")}
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleToggleShowPassword}
                    edge="end"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            fullWidth
          />
        </React.Fragment>
      )}
      <Button variant="contained" color="secondary" type="submit" value="Submit" onClick={handleSubmit}>
        S&apos;inscrire !
      </Button>
    </form>
  );
}

CreateAccountForm.propTypes = {
  user: PropTypes.object,
  setUser: PropTypes.func,
  submit: PropTypes.func,
  noAutoComplete: PropTypes.bool,
  hideCreatePassword: PropTypes.bool,
};

CreateAccountForm.defaultProps = {
  user: DEFAULT_USER,
  setUser: () => {},
  submit: () => {},
  noAutoComplete: false,
  hideCreatePassword: false,
};

export default CreateAccountForm;
