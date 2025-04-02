import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { sendEmail, saveRegisterInfor } from '@/store/slices/authSlice';

export function useAuth() {
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.authentication);

  const handleSendEmail = (email: string) => {
    dispatch(sendEmail(email));
  };

  const handleSaveRegisterInfo = (data: any) => {
    dispatch(saveRegisterInfor(data));
  };

  return {
    ...auth,
    sendEmail: handleSendEmail,
    saveRegisterInfo: handleSaveRegisterInfo,
  };
}
