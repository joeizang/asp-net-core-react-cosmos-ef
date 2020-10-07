import React from "react"
import Head from "next/head"
import { TodoList } from "features/taskTable/TodoList"

const index = () =>(
    <>
      <Head>
        <title>Todo List App</title>
      </Head>
      <TodoList />
    </>
  )
export default index