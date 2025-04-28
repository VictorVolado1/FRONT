import { useDispatch } from 'react-redux';
import { addToast } from '../slices/toast';

export const useToast = () => {
  const dispatch = useDispatch();

  const showToast = (message, type = 'info') => {
    dispatch(addToast({ message, type }));
  };

  return { showToast };
};
