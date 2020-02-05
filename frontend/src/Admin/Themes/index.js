import React, { useContext } from "react";

import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

import AddButton from "../components/Buttons/AddButton";
import TableCard from "../components/TableCard";
import { ThemesServiceContext } from "../../services/ThemesService";

function Themes() {
  let themes = [];

  // eslint-disable-next-line
  const themesRequest = useContext(ThemesServiceContext).getThemes;
  if (themesRequest.complete && !themesRequest.error) {
    themes = themesRequest.data;
  }

  return (
    <React.Fragment>
      <TableCard
        type="THEME"
        title="Liste des thèmes"
        elements={themes.filter(theme => theme.isPublished === true)}
        validIcon={<EditIcon />}
        invalidIcon={<DeleteIcon />}
      >
        <AddButton
          buttonTitle="Ajouter un thème"
          type="THEME"
          link="/admin/themes/new"
          modalTitle="Creation d'un nouveau theme"
        />
      </TableCard>

      <TableCard
        type="THEME"
        title={"Thèmes en attente de validation"}
        elements={themes.filter(theme => theme.isPublished === false)}
        validIcon={<CheckIcon />}
        invalidIcon={<ClearIcon />}
      />
    </React.Fragment>
  );
}

Themes.propTypes = {};

export default Themes;
