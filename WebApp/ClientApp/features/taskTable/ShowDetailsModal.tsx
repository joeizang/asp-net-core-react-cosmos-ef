import React from "react"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"

import { TaskItem } from "api/TaskItemApi"

const ShowDetailsModel = (props: {
  taskItem: TaskItem
  onHide: () => void
}) => {
  const { onHide, taskItem } = props

  return (
    <Modal
      show={true}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Task ID: <strong>{taskItem.id}</strong>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <dl>
          <dt>Name</dt>
          <dd>{taskItem.name}</dd>

          <dt>Description</dt>
          <dd>{taskItem.description}</dd>

          <dt>Status</dt>
          <dd>{taskItem.completed ? "Done" : "Open"}</dd>

          <dt>Owner</dt>
          <dd>{taskItem.owner}</dd>

          <dt>Created</dt>
          <dd>{taskItem.created.toLocaleString()}</dd>

          <dt>Modified</dt>
          <dd>{taskItem.modified.toLocaleString()}</dd>
        </dl>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => props.onHide()}>Close</Button>
      </Modal.Footer>
    </Modal>
  )
}
export default ShowDetailsModel
