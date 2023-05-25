import React, { useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';


function HighlightTooltip({text, tooltipText, tooltipStart = 250}) {
    /*
    Tooltip class wrapper for highlighting needs
    */

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
          {Array.isArray(tooltipText) ? tooltipText.map(tooltipMsg => <span>* {tooltipMsg}<br/></span>) : tooltipText}
        </Tooltip>
      );

    return <OverlayTrigger
                placement="top"
                delay={{ show: tooltipStart, hide: 400 }}
                overlay={renderTooltip}
            >
        <span className="tooltip-available">{text}</span>
    </OverlayTrigger>
    
}

export { HighlightTooltip };
