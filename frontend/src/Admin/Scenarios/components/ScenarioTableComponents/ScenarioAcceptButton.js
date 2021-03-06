import React, { useContext, useState } from "react";
import { withRouter } from "react-router";
import PropTypes from "prop-types";

import { ScenariosServiceContext } from "../../../../services/ScenariosService";
import { UserServiceContext } from "../../../../services/UserService";
import DefaultButton from "../../../components/Buttons/DefaultButton";
import { putDefaultAdminScenario } from "../scenarioRequest";

function ScenarioAcceptButton(props) {
  const { axiosLoggedRequest } = useContext(UserServiceContext);
  const updateScenarios = useContext(ScenariosServiceContext).updateScenarios;

  const [res, setRes] = useState({
    error: false,
    complete: false,
    message: "",
  });

  async function handleAcceptation(event) {
    event.preventDefault();
    await putDefaultAdminScenario(
      axiosLoggedRequest,
      props.scenario,
      setRes,
      "Succès lors de la modification du scenario",
      "Erreur lors de la modification du scenario",
      props.history,
      updateScenarios
    );
  }

  return (
    <DefaultButton
      href={`/admin/scenarios/${props.scenario.id}`}
      handleAction={handleAcceptation}
      icon={props.icon}
      res={res}
    />
  );
}

ScenarioAcceptButton.propTypes = {
  icon: PropTypes.object.isRequired,
  scenario: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(ScenarioAcceptButton);
