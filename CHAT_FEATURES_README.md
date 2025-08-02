# Funcionalidades Avanzadas de Chat

Este documento describe las nuevas funcionalidades implementadas para el sistema de chat, incluyendo read receipts, manejo de archivos y grabación de audio.

## 🚀 Nuevas Funcionalidades

### 1. Sistema de Read Receipts (Vistos)

El sistema ahora incluye un completo sistema de read receipts que permite:

- **Estados de mensaje**: `sent`, `delivered`, `seen`, `deleted`
- **Tracking detallado**: Cada usuario tiene su propio registro de lectura
- **Tiempo real**: Los estados se actualizan en tiempo real via WebSocket

#### Endpoints para Read Receipts:

```http
PUT /api/chat/messages/:messageId/seen
Content-Type: application/json
Authorization: Bearer <token>

{
  "chatId": "chat-id-here"
}
```

### 2. Manejo Avanzado de Archivos

Soporte completo para diferentes tipos de archivos:

- **Imágenes**: JPEG, PNG, GIF, WebP
- **Videos**: MP4, WebM, OGG
- **Documentos**: PDF, DOC, DOCX
- **Audio**: MP3, WAV, OGG, M4A

#### Endpoints para Archivos:

```http
POST /api/chat/messages/upload
Content-Type: multipart/form-data
Authorization: Bearer <token>

Form Data:
- file: <archivo>
- chatId: "chat-id-here"
- messageType: "file|image|video"
- replyTo: "message-id" (opcional)
```

### 3. Grabación de Audio

Sistema completo para grabación de audio desde el frontend:

#### Características:
- **Grabación en tiempo real** con Web Audio API
- **Visualización de nivel de audio**
- **Conversión automática** a formatos optimizados
- **Metadatos completos** (duración, sample rate, canales)

#### Endpoints para Audio:

```http
POST /api/chat/messages/audio
Content-Type: multipart/form-data
Authorization: Bearer <token>

Form Data:
- audio: <archivo-de-audio>
- chatId: "chat-id-here"
- duration: 30.5
- sampleRate: 44100
- channels: 1
- format: "mp3"
- isRecording: true
- replyTo: "message-id" (opcional)
```

## 📡 WebSocket Events

### Eventos de Conexión:
```javascript
// Conectar a un chat
socket.emit('join-chat', { chatId: 'chat-id' });

// Salir de un chat
socket.emit('leave-chat', { chatId: 'chat-id' });
```

### Eventos de Mensajes:
```javascript
// Recibir nuevo mensaje
socket.on('message-sent', (message) => {
  console.log('Nuevo mensaje:', message);
});

// Mensaje marcado como entregado
socket.on('message-delivered', (data) => {
  console.log('Mensaje entregado:', data);
});

// Mensaje marcado como visto
socket.on('message-seen', (data) => {
  console.log('Mensaje visto:', data);
});

// Mensaje eliminado
socket.on('message-deleted', (data) => {
  console.log('Mensaje eliminado:', data);
});
```

### Eventos de Usuario:
```javascript
// Usuario escribiendo
socket.on('user-typing', (data) => {
  console.log('Usuario escribiendo:', data);
});

// Usuario dejó de escribir
socket.on('user-stopped-typing', (data) => {
  console.log('Usuario dejó de escribir:', data);
});

// Usuario en línea
socket.on('user-online', (data) => {
  console.log('Usuario en línea:', data);
});

// Usuario desconectado
socket.on('user-offline', (data) => {
  console.log('Usuario desconectado:', data);
});
```

## 🎤 Implementación de Grabación de Audio

### Frontend JavaScript:

```javascript
// Inicializar grabador
const recorder = new AudioRecorder();

// Iniciar grabación
await recorder.startRecording();

// Detener grabación
recorder.stopRecording();

// Escuchar nivel de audio
window.addEventListener('audio-level', (event) => {
  const level = event.detail.level;
  // Actualizar visualizador
});
```

### HTML para Audio Recorder:

```html
<div class="audio-recorder">
  <button id="record-button">🎤 Grabar</button>
  <div id="audio-visualizer" class="visualizer"></div>
  <div class="recording-time" id="recording-time">00:00</div>
</div>
```

### CSS para Visualización:

```css
.audio-recorder {
  display: flex;
  align-items: center;
  gap: 10px;
}

.visualizer {
  width: 20px;
  height: 50px;
  background: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  transition: height 0.1s ease;
}

.recording .visualizer {
  background: #ff4444;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

## 🔧 Configuración del Servidor

### Dependencias Necesarias:

```bash
npm install @nestjs/websockets socket.io multer uuid
npm install --save-dev @types/multer @types/uuid
```

### Configuración en main.ts:

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configurar WebSocket
  app.useWebSocketAdapter(new IoAdapter(app));
  
  // Configurar CORS para WebSocket
  app.enableCors({
    origin: true,
    credentials: true
  });
  
  await app.listen(3000);
}
bootstrap();
```

## 📊 Estructura de Datos

### Mensaje con Read Receipts:

```typescript
interface Message {
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
  readReceipts: ReadReceipt[];
  file?: FileAttachment;
  audio?: AudioMessage;
}

interface ReadReceipt {
  userId: string;
  readAt: Date;
  deliveredAt?: Date;
  sentAt?: Date;
  seenAt?: Date;
  deletedAt?: Date;
  createdAt: Date;
}
```

### Archivo Adjunto:

```typescript
interface FileAttachment {
  filename: string;
  mimetype: string;
  size: number;
  storageType: 'buffer' | 'gridfs' | 's3';
  fileId?: string;
  url?: string;
  duration?: number;
  thumbnail?: string;
}
```

### Mensaje de Audio:

```typescript
interface AudioMessage {
  duration: number;
  sampleRate: number;
  channels: number;
  format: 'mp3' | 'wav' | 'ogg' | 'm4a';
  isRecording: boolean;
}
```

## 🚀 Uso Rápido

### 1. Enviar Mensaje de Texto:

```javascript
const response = await fetch('/api/chat/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    chatId: 'chat-id',
    content: 'Hola mundo!',
    messageType: 'text'
  })
});
```

### 2. Subir Archivo:

```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('chatId', 'chat-id');
formData.append('messageType', 'image');

const response = await fetch('/api/chat/messages/upload', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

### 3. Grabar y Enviar Audio:

```javascript
// Ver ejemplo completo en frontend-audio-example.js
const recorder = new AudioRecorder();
await recorder.startRecording();
// ... grabar ...
recorder.stopRecording(); // Se envía automáticamente
```

## 🔒 Seguridad

- **Autenticación**: Todos los endpoints requieren token JWT
- **Validación**: Tipos de archivo y tamaños limitados
- **Permisos**: Usuarios solo pueden ver mensajes de chats donde son miembros
- **WebSocket**: Autenticación via token en handshake

## 📈 Próximas Mejoras

- [ ] Soporte para mensajes de voz en tiempo real
- [ ] Compresión automática de archivos
- [ ] Thumbnails automáticos para videos
- [ ] Encriptación de archivos
- [ ] Soporte para mensajes temporales
- [ ] Reacciones a mensajes
- [ ] Mensajes editables
- [ ] Búsqueda en mensajes
- [ ] Exportación de chats 