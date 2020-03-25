import React from "react";
import PropTypes from "prop-types";
import { withRouter } from 'react-router-dom';
import {Typography} from "@material-ui/core";

import Inverted from "../../../../components/Inverted";
import VideoThumbnail from "../../../../components/VideoThumbnail";
import ScenarioCard from "../components/ScenarioCard";

import "./scenarios.css";

function Scenarios(props) {
  return (
    <div>
      <div>
        <div style={{ maxWidth: "1000px", margin: "auto" }}>
          <Typography color="primary" variant="h1">
            <Inverted round>1</Inverted> Quel <Inverted>scénario</Inverted> choisir ?
          </Typography>
          <Typography color="inherit" variant="h2">
            Voici quelques vidéos qui peuvent vous inspirer
          </Typography>
          <div className="video-container">
            <VideoThumbnail
              title="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
              duration={102334}
              thumbnailLink="/thumbnail_default.png"/>
          </div>

          <Typography color="inherit" variant="h2">
            C'est à votre tour, sélectionnez un scénario à filmer
          </Typography>
          <div className="scenarios-container">
            <ScenarioCard
              stepNumber={0}
              title="Nouveau scénario"
              history={props.history}
              path={`/create/1-scenario-choice/new?themeId=${props.themeId}`}
              shortPath={`/create/1-scenario-choice/new`}
              scenarioId={0}
              description="Cliquez ici pour créer votre propre scénario !"/>
            {props.scenarios.map((scenario, index) => (
              <ScenarioCard
                key={index}
                stepNumber={0}
                title={scenario.name}
                scenarioId={scenario.id}
                path={`/create/2-questions-choice?themeId=${props.themeId}&scenarioId=${scenario.id}`}
                shortPath={`/create/2-questions-choice`}
                history={props.history}
                description={scenario.description}/>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

Scenarios.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  themeId: PropTypes.number.isRequired,
  scenarios: PropTypes.array,
};

Scenarios.defaultProps = {
  scenarios: [],
};

export default withRouter(Scenarios);
