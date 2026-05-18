export type ToastMessage = {
  id: string;
  type: "success" | "error";
  text: string;
};

export const toastSuccess = (message: string) => {
  const id = Math.random().toString(36).substring(2, 9);
  const event = new CustomEvent("bunkie-toast", {
    detail: { id, type: "success", text: message },
  });
  window.dispatchEvent(event);
};

export const toastError = (err: any, defaultMsg: string) => {
  const text = err?.message || (typeof err === "string" ? err : defaultMsg);
  const id = Math.random().toString(36).substring(2, 9);
  const event = new CustomEvent("bunkie-toast", {
    detail: { id, type: "error", text },
  });
  window.dispatchEvent(event);
};
