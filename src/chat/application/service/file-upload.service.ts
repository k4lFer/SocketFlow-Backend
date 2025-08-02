import { Injectable } from '@nestjs/common';
import { FileAttachment, AudioMessage } from '../../domain/entity/message.model';
import { v4 as uuidv4 } from 'uuid';
import { Connection, Types } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { GridFSBucket } from 'mongodb';
import { Readable } from 'stream';
import { Result } from 'src/shared/response/result.impl';
import { SendMessageDto, FileAttachmentDto, AudioMessageDto } from '../dto/out/send-message.dto';

@Injectable()
export class FileUploadService {
  private bucket: GridFSBucket;
  private readonly BUFFER_LIMIT = 16 * 1024 * 1024; // 16 MB
  private readonly MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

  constructor(@InjectConnection() private readonly connection: Connection) {
    this.bucket = new GridFSBucket(this.connection.db!, { bucketName: 'uploads' });
  }

  async buildFileMessageDto(userId: string, dto: SendMessageDto, file: Express.Multer.File): Promise<Result<SendMessageDto>> {
    const result = await this.saveFile(file);
    if (!result.isSuccess || !result.data) return Result.error<SendMessageDto>(null, result.messageDto?.toString());
  
    const fileDto: FileAttachmentDto = {
      filename: result.data.filename,
      mimetype: result.data.mimetype,
      size: result.data.size,
      storageType: result.data.storageType,
      fileId: result.data.fileId,
      url: result.data.url,
      duration: result.data.duration,
      thumbnail: result.data.thumbnail,
    };

    return Result.ok(
      {
        ...dto,
        messageType: dto.messageType || 'file',
        file: fileDto,
      },
      'Archivo procesado'
    );
  }
  
  async buildAudioMessageDto(userId: string, dto: SendMessageDto, file: Express.Multer.File): Promise<Result<SendMessageDto>> {
    if (!dto.audio) return Result.error<SendMessageDto>(null, 'Metadata de audio faltante');
  
    const result = await this.saveAudioFile(file, dto.audio);
    if (!result.isSuccess || !result.data) return Result.error<SendMessageDto>(null, result.messageDto?.toString());
  
    const fileDto: FileAttachmentDto = {
      filename: result.data.file.filename,
      mimetype: result.data.file.mimetype,
      size: result.data.file.size,
      storageType: result.data.file.storageType,
      fileId: result.data.file.fileId,
      url: result.data.file.url,
      duration: result.data.file.duration,
      thumbnail: result.data.file.thumbnail,
    };

    const audioDto: AudioMessageDto = {
      duration: result.data.audio.duration,
      sampleRate: result.data.audio.sampleRate,
      channels: result.data.audio.channels,
      format: result.data.audio.format,
      isRecording: result.data.audio.isRecording,
    };

    return Result.ok(
      {
        ...dto,
        messageType: 'audio',
        file: fileDto,
        audio: audioDto
      },
      'Audio procesado'
    );
  }
  

  async saveFile(file: Express.Multer.File): Promise<Result<FileAttachment>> {
    const fileId = uuidv4();

    if (file.size > this.MAX_FILE_SIZE) {
      return Result.error<any>(null, 'El archivo excede el tamaño máximo permitido (50 MB).');
    }

    // 🔹 BUFFER MODE
    if (file.size <= this.BUFFER_LIMIT) {
      const fileAttachment: FileAttachment = {
        filename: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        storageType: 'buffer',
        fileId,
        data: file.buffer,
      };
      return Result.ok(fileAttachment, 'Archivo guardado como buffer.');
    }

    // 🔹 GRIDFS MODE
    try {
      const readable = new Readable();
      readable.push(file.buffer);
      readable.push(null);

      const uploadStream = this.bucket.openUploadStream(file.originalname, {
        metadata: {
          mimetype: file.mimetype,
          originalname: file.originalname,
          size: file.size,
        },
      });

      await new Promise<void>((resolve, reject) => {
        readable.pipe(uploadStream)
          .on('finish', resolve)
          .on('error', reject);
      });

      const fileAttachment: FileAttachment = {
        filename: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        storageType: 'gridfs',
        fileId: uploadStream.id.toString(),
      };

      return Result.ok(fileAttachment, 'Archivo guardado en GridFS.');
    } catch (error) {
      console.error('Error al guardar en GridFS:', error);
      return Result.error<any>(null, 'Ocurrió un error al guardar el archivo en GridFS.');
    }
  }

  async saveAudioFile(
    file: Express.Multer.File,
    audioData: {
      duration: number;
      sampleRate: number;
      channels: number;
      format: 'mp3' | 'wav' | 'ogg' | 'm4a';
      isRecording: boolean;
    }
  ): Promise<Result<{ file: FileAttachment; audio: AudioMessage }>> {
    const result = await this.saveFile(file);

    if (!result.isSuccess || !result.data) {
      return Result.error<{ file: FileAttachment; audio: AudioMessage }>(null, result.messageDto?.toString() || 'Error al guardar archivo');
    }

    const audioMessage: AudioMessage = {
      duration: audioData.duration,
      sampleRate: audioData.sampleRate,
      channels: audioData.channels,
      format: audioData.format,
      isRecording: audioData.isRecording,
    };

    return Result.ok({ file: result.data, audio: audioMessage }, 'Archivo de audio guardado correctamente.');
  }

  async deleteFile(fileId: string, storageType: 'buffer' | 'gridfs'): Promise<Result<void>> {
    if (storageType === 'gridfs') {
      try {
        await this.bucket.delete(new Types.ObjectId(fileId));
        return Result.ok(null, 'Archivo eliminado de GridFS.');
      } catch (error) {
        console.error('Error al eliminar archivo de GridFS:', error);
        return Result.error(null, 'No se pudo eliminar el archivo de GridFS.');
      }
    }

    // Para buffer, no se hace nada porque está embebido en el documento principal.
    return Result.ok(null, 'Archivo buffer eliminado con el documento principal.');
  }

  getFileStream(fileId: string): NodeJS.ReadableStream {
    return this.bucket.openDownloadStream(new Types.ObjectId(fileId));
  }
}
