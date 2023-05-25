import React, { useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { questionMarkIcon } from './icons';


function QuestionMarkTooltip({tooltipText}) {
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
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltip}
            >
        <span className="tooltip-available">{questionMarkIcon}</span>
    </OverlayTrigger>
    
}

export { QuestionMarkTooltip };
