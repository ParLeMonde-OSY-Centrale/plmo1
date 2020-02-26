import React, { useContext } from "react";
import PropTypes from "prop-types";

import {
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@material-ui/core";
import { ScenariosServiceContext } from "../../../../services/ScenariosService";

function ScenarioSelector(props) {
    const scenarios = useContext(ScenariosServiceContext).scenarios || [];

    function handleLanguageSelection(event) {
        props.setSelectedScenario(event.target.value);
    }

  return (
    <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={props.selectedScenario || ""}
        onChange={handleLanguageSelection}
        fullWidth
    >
        {scenarios.map((s, index) => {
        return (
            <MenuItem key={index} value={s.id}>
            {s.names.fr}
            </MenuItem>
        );
        })}
    </Select>
  );
}

ScenarioSelector.propTypes = {
    selectedScenario : PropTypes.object.isRequired,
    setSelectedScenario : PropTypes.func.isRequired,
};

export default ScenarioSelector;
