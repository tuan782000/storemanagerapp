import {createSlice} from '@reduxjs/toolkit';

interface AuthState {
  id: string;
  accesstoken: string;
  email: string;
}

const initialState: AuthState = {
  id: '',
  accesstoken: '',
  email: '',
};

const authSlice = createSlice({
  name: 'auth', // tên reduce
  initialState: {
    authData: initialState,
  }, // các giá trị - trạng thái ban đầu
  reducers: {
    // state trạng thái hiện tại - action mang theo các thông tin
    addAuth: (state, action) => {
      state.authData = action.payload; // action mang các thông tin - các thông tin nằm trong payload, nhiệm vụ của state.authData là giúp cập nhật state bằng cách mang các thông tin đó di cập nhật
    },
  },
  // chứa các hàm - hay còn gọi là các action
});

export const authReducer = authSlice.reducer;
export const {addAuth} = authSlice.actions;

export const authSelector = (state: any) => state.authReducer.authData;
