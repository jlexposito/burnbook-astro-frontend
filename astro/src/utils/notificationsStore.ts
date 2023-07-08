import { atom } from 'nanostores'
import { createLocalStore } from '@utils/stores';

import { NotificationType, type Notification } from '@utils/interfaces';

const [storedNotifications, setNotifications] = createLocalStore<Notification[]>("notifications", []);

export const activeNotificatons: Notification[] = atom(storedNotifications as Notification[]);

function Notification(type: NotificationType, message: string) {
    this.type = type
    this.message = message
}

function addNewAutoDestroyNotification(notification: Notification) {
    let index = storedNotifications.length
    setNotifications([
        ...activeNotificatons.get(), 
        notification
    ])
    setTimeout(() => {
        let newNotifications : Notification[] = [...activeNotificatons.get()]
      // remove element
      newNotifications.splice(index, 1);
        setNotifications(newNotifications)
    }, '4000');
}

export function successNotification (message: string) {
    addNewAutoDestroyNotification(new Notification(NotificationType.success, message))
}
export function errorNotification (message: string) {
    addNewAutoDestroyNotification(new Notification(NotificationType.error, message))
}
export function warningNotification (message: string) {
    addNewAutoDestroyNotification(new Notification(NotificationType.warning, message))
}