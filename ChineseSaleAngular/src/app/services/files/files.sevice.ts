import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable, map, filter } from 'rxjs';
import { environment } from '../../enviroment';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';

export interface FileUploadResponse {
  fileName?: string;
  url?: string;
  relative?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FilesService {
  // אם יש לך environment.apiUrl השתמש בו; אחרת השאר יחסית
  private readonly url = `${environment.apiUrl}/files`;

  constructor(private http: HttpClient,private msg: NzMessageService) {
    console.log('FilesService baseUrl:', this.url);
  }


  uploadFileEvents(file: File): Observable<HttpEvent<FileUploadResponse>> {
    const fd = new FormData();
    fd.append('file', file, file.name);
    return this.http.post<FileUploadResponse>(`${this.url}/upload`, fd, {
      reportProgress: true,
      observe: 'events'
    });
  }

  // נוחות: מחזיר Observable שמירותר את ה-URL המלא לאחר שה־upload הסתיים
  uploadFileAndGetUrl(file: File): Observable<string> {
    return this.uploadFileEvents(file).pipe(
      // רק אירועי ResponseInterest
      filter(ev => ev.type === HttpEventType.Response),
      map(ev => {
        const body = (ev as any).body as FileUploadResponse | null;
        return (body?.url ?? body?.relative ?? '') as string;
      })
    );
  }
  uploadProgress = 0;
  uploadToServer(file: File) {
    const fd = new FormData();
    fd.append('file', file, file.name);

    const uploadUrl = '/api/files/upload';

    return new Observable<string>((observer) => {
      this.http.post<any>(uploadUrl, fd, {
        reportProgress: true,
        observe: 'events'
      }).subscribe({
        next: (ev) => {
          if (ev.type === HttpEventType.UploadProgress && ev.total) {
            this.uploadProgress = Math.round(100 * ev.loaded / ev.total);
          } else if (ev.type === HttpEventType.Response) {
            const body = ev.body;
            const url = body?.url ?? body?.relative ?? null;
            if (url) {
              observer.next(url);
              observer.complete();
            } else {
              observer.error(new Error('No url in response'));
            }
          }
        },
        error: (err) => observer.error(err)
      });
    });
  }
}