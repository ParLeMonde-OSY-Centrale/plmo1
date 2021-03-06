import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Route, Switch, withRouter } from "react-router";
import { useTranslation } from "react-i18next";

import { Breadcrumbs, Hidden, Link } from "@material-ui/core";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";

import { ProjectServiceContext } from "../../../services/ProjectService";
import { getQuestions } from "../../../util";
import Steps from "../../components/Steps";
import AllPlans from "./AllPlans";
import EditPlan from "./EditPlan";
import DrawPlan from "./DrawPlan";

function Partie3(props) {
  const { t } = useTranslation();
  const { project, updateProject } = useContext(ProjectServiceContext);
  const questions = getQuestions(project);

  const handleHome = (event) => {
    event.preventDefault();
    props.history.push("/create");
  };

  const handleBack = (event) => {
    event.preventDefault();
    props.history.push("/create/1-scenario-choice");
  };

  const updateQuestion = (index, newQuestion) => {
    const questions = [...project.questions];
    const prevQuestion = project.questions[index];
    questions[index] = { ...prevQuestion, ...newQuestion };
    updateProject({ questions });
  };

  return (
    <div>
      {project.themeId !== null && project.scenarioId !== null && (
        <React.Fragment>
          <Hidden smDown>
            <Breadcrumbs
              separator={<NavigateNextIcon fontSize="small" />}
              aria-label="breadcrumb"
            >
              <Link color="inherit" href="/create" onClick={handleHome}>
                {t("all_themes")}
              </Link>
              <Link
                color="inherit"
                href={`/create/1-scenario-choice`}
                onClick={handleBack}
              >
                {project.themeName}
              </Link>
            </Breadcrumbs>
          </Hidden>

          <Steps activeStep={2} />

          <Switch>
            <Route
              path="/create/3-storyboard-and-filming-schedule/edit"
              render={() => (
                <EditPlan
                  questions={questions}
                  updateProject={updateProject}
                  updateQuestion={updateQuestion}
                  project={project}
                />
              )}
            />
            <Route
              path="/create/3-storyboard-and-filming-schedule/draw"
              render={() => (
                <DrawPlan
                  questions={questions}
                  updateProject={updateProject}
                  project={project}
                />
              )}
            />
            <Route
              path="/create/3-storyboard-and-filming-schedule"
              render={() => (
                <AllPlans
                  questions={questions}
                  updateProject={updateProject}
                  project={project}
                />
              )}
            />
          </Switch>
        </React.Fragment>
      )}
    </div>
  );
}

Partie3.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(Partie3);
