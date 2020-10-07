import React, { useState } from "react"

import { Collapse } from "reactstrap"
import OverlayTrigger from "react-bootstrap/OverlayTrigger"
import Tooltip from "react-bootstrap/Tooltip"

import { TaskItem } from "api/TaskItemApi"

const TaskName = (props: { taskItem: TaskItem }) => {
  const [open, setOpen] = useState<boolean>(false)
  const taskItem = props.taskItem

  const spanWithName =
    (<span onClick={() => setOpen(!open)} style={{ cursor: "pointer" }}>
      {taskItem.name}
    </span>)

  return (<span>
      {open ? spanWithName
        : (<OverlayTrigger
          placement="top"
          overlay={
            <Tooltip id={`tooltip-task-name-${taskItem.id}`}>
              Click to see <strong>task description</strong>.
            </Tooltip>
          }
        >
          {spanWithName}
        </OverlayTrigger>)}
    <Collapse isOpen={open}>
        <div id={`props-collapse-${taskItem.id}`}>{taskItem.description}</div>
      </Collapse>
    </span>)
}
export default TaskName
