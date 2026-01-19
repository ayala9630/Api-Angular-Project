export interface EmailSettings {
  smtpServer: string;
  smtpPort: number;
  senderName: string;
  senderEmail: string;
  password: string;
}

export interface EmailRequest {
  to: string;
  subject: string;
  body: string;
}
