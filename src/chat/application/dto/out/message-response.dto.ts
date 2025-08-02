export class ReadReceiptDto {
  userId: string;
  readAt: Date;
  deliveredAt?: Date;
  sentAt?: Date;
  seenAt?: Date;
  deletedAt?: Date;
  createdAt: Date;
}

export class FileAttachmentResponseDto {
  filename: string;
  mimetype: string;
  size: number;
  storageType: 'buffer' | 'gridfs' | 's3';
  fileId?: string;
  url?: string;
  duration?: number;
  thumbnail?: string;
}

export class AudioMessageResponseDto {
  duration: number;
  sampleRate: number;
  channels: number;
  format: 'mp3' | 'wav' | 'ogg' | 'm4a';
  isRecording: boolean;
}

export class MessageResponseDto {
  id: string;
  sender: string;
  content?: string;
  chatId: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'seen' | 'deleted';
  messageType: 'text' | 'file' | 'audio' | 'image' | 'video';
  replyTo?: string;
  editedAt?: Date;
  deletedAt?: Date;
  readReceipts: ReadReceiptDto[];
  file?: FileAttachmentResponseDto;
  audio?: AudioMessageResponseDto;
}

export class MessageStatusUpdateDto {
  messageId: string;
  status: 'delivered' | 'seen' | 'deleted';
  userId: string;
  timestamp: Date;
} 