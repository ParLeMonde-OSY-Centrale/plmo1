import React, { useContext, useState } from "react";
import PropTypes from "prop-types";

import ModalContainer from "../../../components/FormComponents/ModalContainer";
import { ScenariosServiceContext } from "../../../../services/ScenariosService";
import { postAdminScenario, putAdminScenario } from "../scenarioRequest";
import { UserServiceContext } from "../../../../services/UserService";

const DEFAULT_SCENARIO = {
  id: null,
  names: {
    fr: null,
  },
  descriptions: {
    fr: null,
  },
  themeId: null,
  isDefault: true,
};

function ScenarioModal(props) {
  const { axiosLoggedRequest } = useContext(UserServiceContext);
  const [newScenario, setNewScenario] = useState(
    props.scenario || DEFAULT_SCENARIO
  );
  const updateScenarios = useContext(ScenariosServiceContext).updateScenarios;

  const [res, setRes] = useState({
    error: false,
    complete: false,
    message: "",
  });

  function handleChange(enumCase, event) {
    switch (enumCase) {
      default:
        break;
      case "NAME":
        setNewScenario({
          ...newScenario,
          names: {
            ...newScenario.names,
            [event.target.id]: event.target.value,
          },
        });
        break;
      case "DESCRIPTION":
        setNewScenario({
          ...newScenario,
          descriptions: {
            ...newScenario.descriptions,
            [event.target.id]: event.target.value,
          },
        });
        break;
      case "THEMEID":
        setNewScenario({
          ...newScenario,
          themeId: event.target.value,
        });
        break;
    }
  }

  async function handleConfirmation(event) {
    event.preventDefault();

    if (props.scenario) {
      await putAdminScenario(
        axiosLoggedRequest,
        newScenario,
        setRes,
        "Succès lors dans la modification du scenario",
        "Erreur lors de la modification du scenario",
        props.history,
        updateScenarios
      );
    } else {
      await postAdminScenario(
        axiosLoggedRequest,
        newScenario,
        setRes,
        "Succès lors dans la creation du scenario",
        "Erreur lors de la creation du scenario",
        props.history,
        updateScenarios
      );
    }

    handleCloseModal();
  }

  function handleCloseModal() {
    props.setIsOpen(false);
    setNewScenario(props.scenario || DEFAULT_SCENARIO);
    props.history.push("/admin/scenarios");
  }

  return (
    <ModalContainer
      newElement={newScenario}
      handleChange={handleChange}
      isOpen={props.isOpen}
      modalTitle={props.modalTitle}
      formDescription={"SCENARIO"}
      handleCloseModal={handleCloseModal}
      handleConfirmation={handleConfirmation}
      res={res}
    />
  );
}

ScenarioModal.propTypes = {
  scenario: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  modalTitle: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
};

export default ScenarioModal;
