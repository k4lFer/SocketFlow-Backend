
export class FileAttachmentDto {
  filename: string;

  mimetype: string;

  size: number;

  storageType: 'buffer' | 'gridfs' | 's3';

  fileId?: string;

  url?: string;

  duration?: number;

  thumbnail?: string;
}

export class AudioMessageDto {
  duration: number;

  sampleRate: number;

  channels: number;

  format: 'mp3' | 'wav' | 'ogg' | 'm4a';

  isRecording: boolean;
}

export class SendMessageDto {
  chatId: string;

  content?: string;

  messageType: 'text' | 'file' | 'audio' | 'image' | 'video' = 'text';

  file?: FileAttachmentDto;

  audio?: AudioMessageDto;

  replyTo?: string;
} 