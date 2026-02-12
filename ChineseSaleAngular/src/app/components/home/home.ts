import { AfterViewInit, Component } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [
    NzCardModule,
    NzButtonModule,
    NzIconModule,
    NzStatisticModule,
    NzGridModule,
    RouterLink
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home implements AfterViewInit {
  featuredLottery = { id: 1, title: 'חבילת פרסים פברואר', entries: 210 };

  statsList: any[] = [
    { icon: 'user', value: 124, animatedValue: 0, label: 'תורמים', bg: 'linear-gradient(135deg,#ffd7c2,#ffd9a6)' },
    { icon: 'gift', value: 28, animatedValue: 0, label: 'מתנות', bg: 'linear-gradient(135deg,#ffe0f0,#ffd1ff)' },
    { icon: 'like', value: 4520, animatedValue: 0, label: 'כניסות', bg: 'linear-gradient(135deg,#dfe9ff,#cfe0ff)' }
  ];

  actions = [
    { icon: 'user-add', title: 'הוסף תורם', sub: 'טופס מהיר לניהול תורמים', route: '/donors/add', bg: '#fff0e6' },
    { icon: 'shopping', title: 'הצעת מתנות', sub: 'הוסף חבילות ומתנות', route: '/packages', bg: '#f0fff6' },
    { icon: 'bar-chart', title: 'דו"חות', sub: 'ניתוח פעילות', route: '/reports', bg: '#f0f7ff' }
  ];

  recentWinners = [
    { name: 'דוד כהן', details: 'זכה ב-חבילת פרסים', date: '12/02/2026', avatar: '' },
    { name: 'שרה לוי', details: 'זכתה בפרס מיוחד', date: '05/02/2026', avatar: '' },
    { name: 'יוסי לוי', details: 'זכה ב-2 כניסות', date: '27/01/2026', avatar: '' }
  ];

  testimonials = [
    { name: 'יעל מ.', text: 'פשוט, נוח ויעיל — מתחילים הגרלות בכמה לחיצות', avatar: '' },
    { name: 'אבי ר.', text: 'כלי נהדר לניהול קמפיינים קהילתיים', avatar: '' }
  ];

  insights = [
    'שבוע זה: עלייה בכניסות ב-12%',
    'מתנה חדשה נוספה: חבילת פינוקים',
    'דו"ח חדש זמין להורדה'
  ];

  constructor(private router: Router) {}

  ngAfterViewInit(): void {
    // animate stat counters
    this.statsList.forEach(s => this.animateValue(s, 900));
  }

  animateValue(item: any, duration = 900) {
    const start = 0;
    const end = item.value;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = Math.min(now - startTime, duration);
      const progress = elapsed / duration;
      item.animatedValue = Math.round(progress * end);
      if (elapsed < duration) {
        requestAnimationFrame(step);
      } else {
        item.animatedValue = end;
      }
    };
    requestAnimationFrame(step);
  }

  goTo(path: string) {
    this.router.navigate([path]);
  }

  viewWinner(w: any) {
    // placeholder: navigate to donor or show modal
    this.router.navigate(['/donors']);
  }
}