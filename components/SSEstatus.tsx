// components/DownloadMonitor.tsx
'use client'; // <--- هذا السطر ضروري جداً للإشارة إلى أن هذا Client Component

import { useState, useEffect } from 'react';

// تعريف الواجهة لبيانات التنزيل (تطابق ما يُرسل من الخادم)
interface DownloadInfo {
  id: string;
  status: 'queued' | 'downloading' | 'completed' | 'failed';
  progress?: number;
  downloadedSize?: number;
  totalSize?: number;
  filename?: string;
  error?: string;
  createdAt?: string; // افترض أنها سترسل كنص
  completedAt?: string; // افترض أنها سترسل كنص
}

// نوع بيانات للحالة التي ستخزن التنزيلات، يمكن أن تكون Map أو كائن
type DownloadsState = {
  [id: string]: DownloadInfo;
};

export default function DownloadMonitor() {
  const [downloads, setDownloads] = useState<DownloadsState>({});
  const [isConnected, setIsConnected] = useState(false);

console.log(downloads,isConnected)
  useEffect(() => {
    // تأكد من أن الكود يعمل في المتصفح (وليس أثناء Server-Side Rendering)
    // EventSource موجود فقط في بيئة المتصفح
    if (typeof window === 'undefined') {
        return;
    }

    // إنشاء اتصال EventSource بالendpoint الخاص بـ SSE
    const eventSource = new EventSource('http://localhost:4000/api/events'); // <--- هنا يتم الاتصال بالباك إند

    // مستمع عند فتح الاتصال بنجاح
    eventSource.onopen = () => {
      console.log('SSE connection opened.');
      setIsConnected(true);
    };
    console.log('Frontend: EventSource instance created. Attaching listeners.');
    eventSource.onmessage = (event) => {
      console.log('Received generic message (no specific event type):', event); // هل تظهر هذه؟
      console.log('Generic message data:', event.data); // ماذا تحتوي البيانات؟
      // إذا ظهرت هذه الرسالة عند إرسال التحديثات، فهذا يعني أن سطر event: download_update\n في الخادم لا يتم تحليله بشكل صحيح من قبل المتصفح.
  };

    eventSource.addEventListener('download_update', (event) => {
        console.log('Received download_update event:', event);
        try {
            const update: DownloadInfo = JSON.parse(event.data);
            console.log('Parsed download_update event data:', update);
            // تحديث الحالة: إضافة تنزيل جديد أو تحديث تنزيل موجود
            setDownloads(prevDownloads => {
                // استخدام Functional Update للحالة لضمان العمل مع أحدث نسخة
                return {
                    ...prevDownloads,
                    [update.id]: { // تحديث أو إضافة التنزيل بناءً على ID
                        ...(prevDownloads[update.id] || {}), // احتفظ بالبيانات الموجودة إذا كان التنزيل موجوداً
                        ...update // أضف/استبدل البيانات الجديدة من التحديث
                    }
                };
            });
        } catch (e) {
            console.error("Failed to parse event data:", e);
        }
    });


    // مستمع عند حدوث خطأ في الاتصال
    eventSource.onerror = (err) => {
      console.error('SSE EventSource failed:', err);
      setIsConnected(false);
      eventSource.close(); // إغلاق الاتصال عند الخطأ لمنع محاولات إعادة الاتصال التلقائية التي قد لا تكون مرغوبة
      // يمكنك هنا إضافة منطق لإعادة الاتصال بعد فترة
    };

    // دالة cleanup التي تُعاد من useEffect
    // يتم استدعاؤها عند إلغاء تحميل المكون (Unmount) أو عند إعادة تشغيل useEffect (إذا تغيرت التبعيات)
    return () => {
      console.log('SSE connection closing.');
      eventSource.close(); // إغلاق اتصال EventSource بشكل نظيف
    };
  }, []); // <-- مصفوفة التبعيات فارغة تعني أن التأثير يعمل مرة واحدة عند تحميل المكون وإلغاء تحميله.


  return (<div></div>);
}