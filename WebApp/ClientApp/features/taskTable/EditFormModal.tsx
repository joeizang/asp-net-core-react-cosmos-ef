import React from "react"
import Modal from "react-bootstrap/Modal"
import { useForm } from "react-hook-form"
import { TaskItem } from "api/TaskItemApi"

const EditFormModal = (props: {
  show: boolean
  onHide: () => void
  itemToEdit: TaskItem
  onFormSubmit: (editedItem: TaskItem) => void
}) => {
  const { itemToEdit, onFormSubmit } = props
  const { register, handleSubmit, errors } = useForm()

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {props.itemToEdit.id ? "Edit Item" : "Create New Item"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <input
            type="hidden"
            name="id"
            defaultValue={itemToEdit.id}
            ref={register()}
          />
          <input
            type="hidden"
            name="owner"
            defaultValue={itemToEdit.owner}
            ref={register()}
          />

          <div className="form-group">
            <label className="col-md-2">Name</label>
            <div className="col-md-10">
              <input
                type="text"
                name="name"
                defaultValue={itemToEdit.name}
                className="form-control"
                ref={register({ required: true, maxLength: 80 })}
              />
              {errors.name && (
                <span className="text-danger">This field is required</span>
              )}
            </div>
          </div>
          <div className="form-group">
            <label className="col-md-2">Description</label>
            <div className="col-md-10">
              <input
                type="text"
                name="description"
                defaultValue={itemToEdit.description}
                className="form-control"
                ref={register({ required: true, maxLength: 100 })}
              />
              {errors.description && (
                <span className="text-danger">This field is required</span>
              )}
            </div>
          </div>
          <div className="form-group">
            <div className="col-md-10">
              <input
                type="checkbox"
                name="completed"
                id="edit_completed"
                defaultChecked={itemToEdit.completed}
                ref={register()}
              />
              <label htmlFor="edit_completed" className="col-md-2">
                Completed
              </label>
            </div>
          </div>

          <div className="form-group">
            <div className="col-md-10">
              {itemToEdit.id ? null : (
                <button type="reset" className="btn btn-secondary">
                  Reset Form
                </button>
              )}{" "}
              <button type="submit" className="btn btn-primary">
                {itemToEdit.id ? "Save changes" : "Create new item"}
              </button>
            </div>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  )
}
export default EditFormModal
