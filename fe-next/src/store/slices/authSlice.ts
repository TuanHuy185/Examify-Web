import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

interface UserDTO {
    username: string;
    password: string;
    role?: 'STUDENT' | 'TEACHER';
}

interface AuthState {
    isLoading: boolean;
    email: string | null;
    studentDTO: any[]; // TODO: Define proper type for studentDTO
    error: string | null;
}

const initialState: AuthState = {
    isLoading: true,
    email: null,
    studentDTO: [],
    error: null,
};

export const addUser = async (userDTO: UserDTO) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BE_API_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include",
            body: JSON.stringify({
                username: userDTO.username,
                password: userDTO.password,
                role: userDTO.role || 'STUDENT'
            })
        });
        
        const data = await response.json().catch(() => ({}));
        
        if (!response.ok) {
            throw new Error(`Failed to add user. HTTP status: ${response.status}. ${data.message || ''}`);
        }
        
        toast.success("Tạo tài khoản thành công");
        localStorage.removeItem('email');
        return { success: true };
    } catch (error) {
        console.error('Error adding user:', error instanceof Error ? error.message : 'Unknown error');
        toast.error(`Đăng ký không thành công: ${error instanceof Error ? error.message : 'Unknown error'}`);
        localStorage.removeItem('email');
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

const authSlice = createSlice({
    name: 'authentication',
    initialState,
    reducers: {
        sendEmail: (state, action: PayloadAction<string>) => {
            const email = action.payload;
            state.email = email;
            localStorage.setItem('email', email);
            // TODO: Implement sendOTPByEmail function
        },
        saveRegisterInfor: (state, action: PayloadAction<any[]>) => {
            state.studentDTO = action.payload;
        },
    }
});

export const { sendEmail, saveRegisterInfor } = authSlice.actions;
export const selectAuth = (state: { authentication: AuthState }) => state.authentication;
export default authSlice.reducer; 