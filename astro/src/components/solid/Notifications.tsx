import { Component } from "solid-js";
import { useStore } from '@nanostores/solid';

import { NotificationType, type Notification } from "@utils/interfaces";

import { activeNotificatons } from '@utils/notificationsStore';
import ToastNotification from "@solidcomponents/ToastNotification";

import { 
    For
} from "solid-js";

const $notifications = useStore(activeNotificatons);

const Notifications: Component<{}> = () => {
  return <div class="fixed p-4 bottom-5 right-5">
    <div class="grid grid-rows-1">
        <For each={$notifications()}>
            {(notification: Notification) => 
                <ToastNotification type={notification.type} message={notification.message} />
            }
            </For>
        </div>            
    </div>
};

export default Notifications;