import React from "react"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"

const ConfirmDeleteModal = (props: {
  itemId: string
  onHide: () => void
  onDelete: (id: string) => void
}) => {
  const { itemId, onDelete } = props

  return (
    <Modal
      show={true}
      onHide={props.onHide}
      size="sm"
      aria-labelledby="contained-modal-title-vcenter"
      centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Task ID: <strong>{itemId}</strong>
        </Modal.Title>
      </Modal.Header>
      <Modal.Footer>
        <Button variant="danger" onClick={() => onDelete(itemId)}>
          Delete this task?
        </Button>
        <Button variant="secondary" onClick={() => props.onHide()}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
export default ConfirmDeleteModal
