import React, {useEffect, useRef, useState} from "react";
// import PropTypes from "prop-types";

import {
  IconButton, withStyles, Button, ButtonBase, Tooltip,
  Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText,
} from "@material-ui/core";
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';
import ClearIcon from '@material-ui/icons/Clear';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import AdjustIcon from '@material-ui/icons/Adjust';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

import "./canvas.css";

const ActionButton = withStyles( {
  root: {
    border: "1px solid",
    borderBottom: "none",
    borderRadius: 0,
  },
})(IconButton);

const colors = [
  "#444",
  "#eda000",
  "#79c3a5",
  "#6065fc",
  "#c36561",
];
const sizes = [2, 4, 8];

function Canvas() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [paths, setPaths] = useState([]);
  const [redoPaths, setRedoPaths] = useState([]);
  const [clear, setClear] = useState(false);
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  });
  const [color, setColor] = useState("#444");
  const [size, setSize] = useState(0);
  const [showModalColor, setShowModalColor] = useState(false);
  const [showModalSize, setShowModalSize] = useState(false);
  const [showModalClear, setShowModalClear] = useState(false);
  const ctx = canvasRef.current ? canvasRef.current.getContext("2d") : null;

  // Listen for resize events
  useEffect(() => {
    const resize = () => {
      setClear(true);
    };
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
    }
  }, []);

  // Resize canvas
  useEffect(() => {
    setClear(false);
    if (canvasRef.current && ctx !== null) {
      canvasRef.current.width = canvasRef.current.clientWidth;
      canvasRef.current.height = canvasRef.current.clientHeight;
      drawAllPaths();
    } // eslint-disable-next-line
  }, [canvasRef, ctx, clear]);

  const getXY = (event) => {
    if (ctx === null) return;
    return {
      x: event.clientX - canvasRef.current.getBoundingClientRect().left,
      y: event.clientY - canvasRef.current.getBoundingClientRect().top,
    };
  };

  const drawPath = (x1, y1, x2, y2, isNew, save, specificColor, specificSize) => {
    if (ctx === null) return;
    const delta = (specificSize !== undefined ? sizes[specificSize] : sizes[size]) / 4;
    ctx.beginPath();
    ctx.strokeStyle = specificColor || color;
    ctx.lineWidth = specificSize !== undefined ? sizes[specificSize] : sizes[size];
    ctx.lineCap = "round";
    ctx.moveTo(x1 - delta, y1 - delta);
    ctx.lineTo(x2 - delta, y2 - delta);
    ctx.stroke();
    ctx.closePath();

    if (!save) return;
    const allPaths = [ ...paths ];
    if (isNew) {
      allPaths.push({ color, size, lines: [[x1, y1, x2, y2]]});
    } else {
      (allPaths[paths.length - 1] || { lines: [] }).lines.push([x1, y1, x2, y2]);
    }
    setPaths(allPaths);
  };

  const onMouseDown = (event) => {
    if (ctx === null) return;
    const { x, y } = getXY(event);
    drawPath(x, y, x, y, true, true);
    setIsDrawing(true);
    setPosition({ x, y });
    setRedoPaths([]);
  };

  const onMouseMove = (event) => {
    if (ctx === null || !isDrawing) return;
    const { x, y } = getXY(event);
    const { x: prevX, y: prevY } = position;
    drawPath(prevX, prevY, x, y, false, true);
    setPosition({ x, y });
  };

  const onMouseUpOrOut = () => {
    if (ctx === null || !isDrawing) return;
    setIsDrawing(false);
    setPosition({ x: 0, y: 0 });
  };

  const drawAllPaths = () => {
    for (const path of paths) {
      for (const line of path.lines) {
        const [x1, y1, x2, y2] = line;
        drawPath(x1, y1, x2, y2, false, false, path.color, path.size);
      }
    }
  };

  const handleUndo = () => {
    if (paths.length === 0) return;
    setRedoPaths([...redoPaths, ...paths.splice(paths.length - 1, 1)]);
    setPaths(paths);
    setClear(true);
  };

  const handleRedo = () => {
    if (redoPaths.length === 0) return;
    setPaths([...paths, ...redoPaths.splice(redoPaths.length - 1, 1)]);
    setRedoPaths(redoPaths);
    setClear(true);
  };

  const handleOpenModalColor = () => {
    setShowModalColor(true);
  };

  const handleCloseModalColor = color => () => {
    setShowModalColor(false);
    if (color !== undefined) {
      setColor(color);
    }
  };

  const handleOpenModalSize = () => {
    setShowModalSize(true);
  };

  const handleCloseModalSize = size => () => {
    setShowModalSize(false);
    if (size !== undefined) {
      setSize(size);
    }
  };

  const handleOpenModalClear = () => {
    setShowModalClear(true);
  };

  const handleCloseModalClear = confirm => () => {
    setShowModalClear(false);
    if (confirm) {
      setPaths([]);
      setRedoPaths([]);
      setClear(true);
    }
  };

  return (
    <div>
      <div className="draw-canvas-container-max-width">
        <div>
          <div role="group"
               className="actions-buttons-container"
               aria-label="outlined primary button group">
            <Tooltip title="Couleur">
              <ActionButton aria-label="select color" onClick={handleOpenModalColor}>
                <BorderColorIcon style={{ color, stroke: `${color === 'white' ? '#444' : 'none'}` }}/>
              </ActionButton>
            </Tooltip>
            <Tooltip title="Éppaiseur">
              <ActionButton aria-label="select size" onClick={handleOpenModalSize}>
                <AdjustIcon />
              </ActionButton>
            </Tooltip>
            <Tooltip title="Revenir en arrière">
              <ActionButton aria-label="undo" onClick={handleUndo}>
                <UndoIcon color="secondary"/>
              </ActionButton>
            </Tooltip>
            <Tooltip title="Revenir en avant">
              <ActionButton aria-label="redo" style={{ borderRight: "1px solid" }} onClick={handleRedo}>
                <RedoIcon color="secondary"/>
              </ActionButton>
            </Tooltip>
            <div style={{ flex: 1 }} />
            <Tooltip title="Tout effacer">
              <ActionButton aria-label="clear canvas" onClick={handleOpenModalClear}>
                <ClearIcon color="error"/>
              </ActionButton>
            </Tooltip>
          </div>
        </div>
        <div className="draw-canvas-container">
          <canvas
            ref={canvasRef}
            className="draw-canvas"
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUpOrOut}
            onMouseOut={onMouseUpOrOut}
          />
        </div>
      </div>

      {/*Color dialog*/}
      <Dialog
        open={showModalColor}
        onClose={handleCloseModalColor()}
        aria-labelledby="color-dialog-title"
        aria-describedby="color-dialog-description"
      >
        <DialogTitle id="color-dialog-title">{"Choisissez la couleur du trait"}</DialogTitle>
        <DialogContent>
          <div className="canvas-colors-container" id="color-dialog-description">
            {
              colors.map(c => <ButtonBase
                key={c}
                style={{ backgroundColor: c }}
                onClick={handleCloseModalColor(c)}
              />)
            }
            <ButtonBase
              onClick={handleCloseModalColor("white")}
              style={{ backgroundColor: "white", border: "1px solid #444" }}/>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModalColor()} color="secondary" variant="outlined">
            Annuler
          </Button>
        </DialogActions>
      </Dialog>

      {/*Size dialog*/}
      <Dialog
        open={showModalSize}
        onClose={handleCloseModalSize()}
        aria-labelledby="size-dialog-title"
        aria-describedby="size-dialog-description"
      >
        <DialogTitle id="size-dialog-title">{"Choisissez l'éppaiseur du trait"}</DialogTitle>
        <DialogContent>
          <div className="canvas-colors-container" id="size-dialog-description">
            <ButtonBase style={{ backgroundColor: "white", border: "1px solid #444" }}
                        onClick={handleCloseModalSize(0)}>
              <FiberManualRecordIcon fontSize="small"/>
            </ButtonBase>
            <ButtonBase style={{ backgroundColor: "white", border: "1px solid #444" }}
                        onClick={handleCloseModalSize(1)}>
              <FiberManualRecordIcon />
            </ButtonBase>
            <ButtonBase style={{ backgroundColor: "white", border: "1px solid #444" }}
                        onClick={handleCloseModalSize(2)}>
              <FiberManualRecordIcon fontSize="large"/>
            </ButtonBase>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModalSize()} color="secondary" variant="outlined">
            Annuler
          </Button>
        </DialogActions>
      </Dialog>

      {/*Clear dialog*/}
      <Dialog
        open={showModalClear}
        onClose={handleCloseModalClear(false)}
        aria-labelledby="clear-dialog-title"
        aria-describedby="clear-dialog-description"
      >
        <DialogTitle id="size-dialog-title">{"Effacer le canvas ?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="size-dialog-description">
            Êtes-vous sûr de vouloir effacer totalement le plan ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModalClear(false)} color="secondary" variant="outlined">
            Annuler
          </Button>
          <Button onClick={handleCloseModalClear(true)} color="secondary" variant="contained">
            Oui
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Canvas;
