import React, { useState, useRef, useEffect } from 'react';

function MTurkComponent({ defaultTaskData, children }) {
    const taskData = window.taskData !== undefined ? window.taskData : defaultTaskData;

    const childrenWithMturkProps = React.cloneElement(children, { taskData: taskData, onSubmit: onSubmit })
    const assignmentId = window.turkGetParam('assignmentId', "");
    const workerId = window.turkGetParam('workerId', "");
    const turkSubmitTo = decodeURIComponent(window.turkGetParam('turkSubmitTo', ""));
    const isPreview = assignmentId === "ASSIGNMENT_ID_NOT_AVAILABLE"

    function onSubmit(data) {
        if (isPreview) {
            alert("ERROR - you need to accept the hit before you submit it")
        } else {
            const form = document.createElement("form")
            form.method = "POST";
            form.action = `${turkSubmitTo}/mturk/externalSubmit`
            data['workerId'] = workerId
            data['assignmentId'] = assignmentId
            for (const key in data) {
                // Based on https://stackoverflow.com/questions/133925/javascript-post-request-like-a-form-submit
                const hiddenField = document.createElement("input")
                hiddenField.type = "hidden";
                hiddenField.id = key;                
                hiddenField.name = key;
                let value = data[key];

                // Stringify complicated javascript objects
                if (value != null && (Array.isArray(value) || value.constructor == Object)) {
                    value = JSON.stringify(value);
                }
                hiddenField.value = value;
                form.appendChild(hiddenField);
            }
            document.body.appendChild(form);
            HTMLFormElement.prototype.submit.call(form);
            document.body.removeChild(form);

            console.log(`Submitting ${JSON.stringify(data)}`);
        }
    }

    return (
        <section>{childrenWithMturkProps}</section>
    )
}

export default MTurkComponent;