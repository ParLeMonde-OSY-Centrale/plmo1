import React from "react";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core/styles";
import ChooseDescription from "../../../components/FormComponents/ChooseDescription";

const useStyles = makeStyles(() => ({
  title: {
    fontSize: 16
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end"
  }
}));

function ScenarioForm(props) {
  const classes = useStyles();

  return (
    <React.Fragment>
      <span className={classes.title}>Titre</span>
      <ChooseDescription
        scenario={props.scenario}
        handleChange={props.handleChange}
      />
    </React.Fragment>
  );
}

ScenarioForm.propTypes = {
  scenario: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired
};

export default ScenarioForm;
