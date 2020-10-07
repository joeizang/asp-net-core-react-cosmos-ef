import { combineReducers } from "redux"
import userInfoReducer from "features/navMenu/userInfoSlice"

const rootReducer = combineReducers({
  userInfo: userInfoReducer
})

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer
