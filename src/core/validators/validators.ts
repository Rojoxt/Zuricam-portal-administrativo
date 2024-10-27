// src/utils/validationUtils.ts
export function validate(
  service: any,
  item: any,
  itemResource: any, // ahora se pasa itemResource como parámetro
  setErrors: any,
  addToast: (title: string, message: string, color: string) => void,
  closeDialog: () => void,
  getAllItems: () => void
) {
  if (Object.values(item.value).every((field) => field !== undefined && field !== '')) {
    if (item.value.id) {
      // Actualización de item existente
      return service
        .update(item.value.id, itemResource.value)
        .then((response: any) => {
          addToast('Success', `${response.data.detail}`, 'success');
          getAllItems();
          closeDialog();
        })
        .catch(handleErrors(setErrors));
    } else {
      // Creación de un nuevo item
      return service
        .create(itemResource.value)
        .then((response: any) => {
          addToast('Success', `${response.data.detail}`, 'success');
          getAllItems();
          closeDialog();
        })
        .catch(handleErrors(setErrors));
    }
  } else {
    setErrors({ apiError: 'Error: faltan datos' });
  }
}

function handleErrors(setErrors: any) {
  return (error: any) => {
    if (error.response) {
      setErrors({ apiError: error.response.data.detail });
    } else {
      console.error('Error sin respuesta de servidor:', error);
      setErrors({ apiError: 'Error de conexión con el servidor' });
    }
  };
}
