import React from "react"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"

const ConfirmLogout = (props: {
  show: boolean
  onHide: () => void
  onLogout: () => void
}) => {
  const { show, onHide, onLogout } = props

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="sm"
      aria-labelledby="logout-modal-title-sm">
      <Modal.Header closeButton>
        <Modal.Title id="logout-modal-title-sm">Confirm logout</Modal.Title>
      </Modal.Header>
      <Modal.Footer>
        <Button variant="danger" onClick={() => onLogout()}>
          Log out
        </Button>
        <Button variant="secondary" onClick={() => props.onHide()}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
export default ConfirmLogout
