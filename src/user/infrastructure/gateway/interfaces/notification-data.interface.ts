export interface NotificationData {
    type: 'friend_request_received' | 'friend_request_accepted' | 'friend_request_rejected' | 'friendship_removed';
    requestId?: string;
    senderId?: string;
    acceptedBy?: string;
    rejectedBy?: string;
    removedBy?: string;
    message: string;
}   