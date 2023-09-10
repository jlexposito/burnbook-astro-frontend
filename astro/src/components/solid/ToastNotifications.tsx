import { Component } from "solid-js";
import { Toast, toaster } from "@kobalte/core";

import "@solidcomponents/ToastNotifications.css";

const ToastNotifications: Component<{}> = () => {
  let id: number;
  return (
    <>
      <Portal>
        <Toast.Region>
          <Toast.List class="toast__list" />
        </Toast.Region>
      </Portal>
    </>
  );
};
export default ToastNotifications;
