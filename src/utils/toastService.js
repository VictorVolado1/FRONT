let toast;

export const setToast = (toastRef) => {
  toast = toastRef;
};

export const showToast = (severity, summary, detail) => {
  if (toast) {
    toast.current.show({
      severity,
      summary,
      detail,
    });
  }
};