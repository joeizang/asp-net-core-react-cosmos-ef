import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"

import Badge from "react-bootstrap/Badge"
import Button from "react-bootstrap/Button"
import Card from "react-bootstrap/Card"
import Container from "react-bootstrap/Container"
import Dropdown from "react-bootstrap/Dropdown"
import DropdownButton from "react-bootstrap/DropdownButton"
import Jumbotron from "react-bootstrap/Jumbotron"
import OverlayTrigger from "react-bootstrap/OverlayTrigger"
import Spinner from "react-bootstrap/Spinner"
import Table from "react-bootstrap/Table"
import Toast from "react-bootstrap/Toast"
import Tooltip from "react-bootstrap/Tooltip"

import ShowDetailsModal from "./ShowDetailsModal"
import ConfirmDeleteModal from "./ConfirmDeleteModal"
import EditFormModal from "./EditFormModal"
import TaskName from "./TaskName"

import { getAll, saveTaskItem, updateTaskItem, deleteTaskItem, TaskItem } from "api/TaskItemApi"
import { RootState } from "app/rootReducer"

type ItemOperation = {
  itemId: string
  operation: "details" | "edit" | "delete"
}

const emptyTask: TaskItem = {
  id: "",
  name: "",
  description: "",
  completed: false,
  owner: "",
  created: new Date(),
  modified: new Date()
}

export const TodoList = () => {

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [taskItems, setTaskItems] = useState<TaskItem[]>([])
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false)
  const [showUnauthorized, setShowUnauthorized] = useState<boolean>(false)
  const [itemOperation, setItemOperation] = useState<ItemOperation>(null)
  const { username } = useSelector((state: RootState) => state.userInfo)

  useEffect(() => {

    async function fetchEverything() {
      async function fetchTasks() {
        const data = await getAll()
        setTaskItems(data)
      }

      try {
        await Promise.all([fetchTasks()])
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    setIsLoading(true)
    fetchEverything()
  }, [])

  const getTaskItemFromState = (itemId: string): TaskItem => (
    taskItems.filter((item) => item.id === itemId)[0]
  )

  const saveTaskItemLocal = async (taskItem: TaskItem) => {
    try {
      const data = await saveTaskItem(taskItem)
      setTaskItems([data, ...taskItems])
    } catch (err) {
      setShowUnauthorized(true)
    } finally {
      setShowCreateModal(false)
    }
  }

  const updateTaskItemLocal = async (taskItem: TaskItem) => {
    const data = await updateTaskItem(taskItem)
    setTaskItems(prevState => prevState.map((currentItem: TaskItem) =>
      currentItem.id === taskItem.id ? data : currentItem
    ))
    setItemOperation(null)
  }

  const deleteTaskItemLocal = async (itemId: string) => {
    await deleteTaskItem(itemId)

    setTaskItems(prevState => prevState.filter((currentItem: TaskItem) =>
      currentItem.id !== itemId
    ))
    setItemOperation(null)
  }

  const renderSubView = () => {
    if (!itemOperation) {
      return (<EditFormModal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        itemToEdit={{ ...emptyTask, owner: username }}
        onFormSubmit={(taskItem) => saveTaskItemLocal(taskItem)}
      />)
    }

    const { itemId, operation } = itemOperation
    switch (operation) {
      case "delete":
        return (
          <ConfirmDeleteModal
            onHide={() => setItemOperation(null)}
            itemId={itemId}
            onDelete={(id) => deleteTaskItemLocal(id)}
          />
        )

      case "edit":
        return (
          <EditFormModal
            show={true}
            onHide={() => setItemOperation(null)}
            itemToEdit={getTaskItemFromState(itemId)}
            onFormSubmit={(taskItem) => updateTaskItemLocal(taskItem)}
          />
        )

      default:
        return (
          <ShowDetailsModal
            onHide={() => setItemOperation(null)}
            taskItem={getTaskItemFromState(itemId)}
          />
        )
    }
  }

  const renderTodoTable = (incomingTaskItems: TaskItem[]) => {
    if (incomingTaskItems.length < 1) {
      return (
        <Jumbotron fluid>
          <Container>
            <h3>No tasks defined</h3>
            <p>Create your first task now!</p>
          </Container>
        </Jumbotron>
      )
    }

    return (
      <Table striped bordered hover variant="dark">
        <thead>
        <tr>
          <th>Id</th>
          <th style={{ width: 300 }}>Task</th>
          <th>Owner</th>
          <th>Modified</th>
          <th>Status</th>
          <th />
        </tr>
        </thead>
        <tbody>
        {incomingTaskItems.map((taskItem, index) => (
          <tr key={index}>
            <td
              title={taskItem.id}
              onClick={() => setItemOperation({
                itemId: taskItem.id,
                operation: "details"
              })}>
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip id={`tooltip-task-details-${taskItem.id}`}>
                    Click to see <strong>task details</strong>.
                  </Tooltip>
                }>
                <span style={{ cursor: "pointer" }}>{`${taskItem.id.slice(0, 7)}...`}</span>
              </OverlayTrigger>
            </td>
            <td>
              <TaskName taskItem={taskItem} />
            </td>
            <td>{taskItem.owner}</td>
            <td title={taskItem.modified.toLocaleString()}>
              {taskItem.modified.toLocaleDateString()}
            </td>
            <td>
              {taskItem.completed
                ? <Badge variant="success">Done</Badge>
                : <Badge variant="primary">Open</Badge>}
            </td>
            <td>
              <DropdownButton
                key={index}
                id={`dropdown-button-drop-${index}`}
                size="sm"
                variant="secondary"
                title="...">
                <Dropdown.Item
                  eventKey="1"
                  onClick={() => setItemOperation({
                    itemId: taskItem.id,
                    operation: "details"
                  })}>
                  Show details
                </Dropdown.Item>
                <Dropdown.Item
                  disabled={taskItem.owner !== username}
                  eventKey="2"
                  onClick={() =>
                    setItemOperation({
                      itemId: taskItem.id,
                      operation: "edit"
                    })}>
                  Edit
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item
                  disabled={taskItem.owner !== username}
                  eventKey="3"
                  onClick={() => setItemOperation({
                    itemId: taskItem.id,
                    operation: "delete"
                  })}>
                  Delete
                </Dropdown.Item>
              </DropdownButton>
            </td>
          </tr>
        ))}
        </tbody>
      </Table>
    )
  }

  const contents = isLoading ? (
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>)
    : renderTodoTable(taskItems)

  return (<div>
    <Toast
      show={showUnauthorized}
      onClose={() => setShowUnauthorized(false)}>
      <Toast.Header>
        <strong className="mr-auto">Not logged in</strong>
        <small>Right now</small>
      </Toast.Header>
      <Toast.Body>
        Sorry, I forgot to tell you that you need to{" "}
        <a href="/Login?ReturnUrl=/ReactApp">log in</a> before adding Todo
        items
      </Toast.Body>
    </Toast>

    <Card bg="info" className="mb-2" text="white">
      <Card.Header>Todo List App</Card.Header>
      <Card.Body>
        <Card.Title>Welcome to React version of Todo List!</Card.Title>
        <Card.Text>
          This application demonstrates fetching data from Cosmos Db through
          API controller.
        </Card.Text>
        {showUnauthorized ? <Button
          variant="primary"
          onClick={() => setShowCreateModal(true)}>
          Create Todo Item
        </Button> : <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip id={`tooltip-top`}>
              Don't be afraid of creating a new task :-)
            </Tooltip>
          }>
          <Button
            variant="primary"
            onClick={() => setShowCreateModal(true)}>
            Create Todo Item
          </Button>
        </OverlayTrigger>}
      </Card.Body>
    </Card>
    <br />
    {contents}
    {renderSubView()}
  </div>)
}
