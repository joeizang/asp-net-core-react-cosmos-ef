import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk } from 'app/store'
import { getUsername } from 'api/UserApi'

interface UserInfoState {
  username: string | null
  error: string | null
}

const initialState: UserInfoState = {
  username: null,
  error: null
}

const userInfo = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    getUserNameSuccess(state, action: PayloadAction<string>) {
      state.username = action.payload
      state.error = null
    },
    getUserNameFailed(state, action: PayloadAction<string>) {
      state.username = null
      state.error = action.payload
    }
  }
})

export const {
  getUserNameSuccess,
  getUserNameFailed
} = userInfo.actions

export default userInfo.reducer

export const fetchUserInfo = (): AppThunk => async dispatch => {
    try {
    const username = await getUsername()
    dispatch(getUserNameSuccess(username))
  } catch (err) {
    dispatch(getUserNameFailed(err.toString()))
  }
}
