import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    count:0
}


export const counterSlice = createSlice({
    name:'counter',
    initialState,
    reducers:{
        // Actions
        increment:(state)=>{
            state.count += 1;
        },
        decrement:(state)=>{
            state.count -= 1;
        },
        reset:(state)=>{
            return {...initialState}
        },
        incrementByAmount:(state,action)=>{
            state.count += action.payload;
        }
    }
});


export const { increment, decrement, reset, incrementByAmount } = counterSlice.actions;

export default counterSlice.reducer;