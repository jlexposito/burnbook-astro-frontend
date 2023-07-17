import { Component } from "solid-js";
import { Toast } from "@kobalte/core";
import { startServer } from "dist/server/entry.mjs";

const ToastNotification: Component<{
  message: string,
  title: string,
  toastId: number,
}> = (props) => {
    const today = new Date();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const message = `[${time}] ${props.message}`
  return (
    <>
      <Toast.Root toastId={ props.toastId } class="toast">
        <div class="toast__content">
          <div>
            <Toast.Title class="toast__title">
              { props.title }
            </Toast.Title>
            <Toast.Description class="toast__description">
              { message }
            </Toast.Description>
          </div>
          <Toast.CloseButton class="toast__close-button">
          <span class="sr-only">Close</span>
          <svg
            class="w-3 h-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
          </Toast.CloseButton>
        </div>
        <Toast.ProgressTrack class="toast__progress-track">
          <Toast.ProgressFill class="toast__progress-fill" />
        </Toast.ProgressTrack>
      </Toast.Root>
    </>
  );
};

export default ToastNotification;
