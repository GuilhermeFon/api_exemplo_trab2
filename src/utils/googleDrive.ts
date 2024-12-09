// src/utils/googleDrive.ts
import { google } from 'googleapis';
import { Readable } from 'stream';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({
  version: 'v3',
  auth: oauth2Client,
});

export const uploadToDrive = async (file: Express.Multer.File): Promise<string> => {
  const fileMetadata = {
    name: file.originalname,
    parents: ['1sp_nrtIr1QZm6Inh4S6iI_DcBmJagM8B'], // Substitua pelo ID da pasta desejada
  };

  const media = {
    mimeType: file.mimetype,
    body: Readable.from(file.buffer),
  };

  const response = await drive.files.create({
    requestBody: fileMetadata,
    media: media,
    fields: 'id',
  });

  const fileId = response.data.id;

  // Definir permissões para obter o link compartilhável
  await drive.permissions.create({
    fileId: fileId!,
    requestBody: {
      role: 'reader',
      type: 'anyone',
    },
  });

  const result = await drive.files.get({
    fileId: fileId!,
    fields: 'webViewLink, webContentLink',
  });

  return result.data.webViewLink || result.data.webContentLink || '';
};