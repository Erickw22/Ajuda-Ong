// src/utils/toastService.js
import { toast } from 'react-toastify';

const ToastService = {
  loading: (id, message = 'Carregando...') => {
    toast.info(message, {
      toastId: id,
      autoClose: false,
      closeOnClick: false,
      draggable: false,
      closeButton: false,
      position: 'bottom-right',
      theme: 'colored',
    });
  },

  success: (message = 'Sucesso!', options = {}) => {
    toast.dismiss();
    toast.success(message, {
      autoClose: 3000,
      position: 'bottom-right',
      theme: 'colored',
      ...options,
    });
  },

  error: (message = 'Ocorreu um erro.', options = {}) => {
    toast.dismiss();
    toast.error(message, {
      autoClose: 4000,
      position: 'bottom-right',
      theme: 'colored',
      ...options,
    });
  },

  dismiss: (id) => {
    if (id) {
      toast.dismiss(id);
    } else {
      toast.dismiss();
    }
  }
};

export default ToastService;
