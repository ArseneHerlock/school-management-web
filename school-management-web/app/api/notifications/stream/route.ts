import { NextRequest } from "next/server";
import { subscribeRealtimeEvents } from "@/lib/realtimeBroker";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      let closed = false;

      const sendEvent = (data: unknown) => {
        if (closed) return;
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        } catch {
          closed = true;
        }
      };

      // 1. Gửi sự kiện xác nhận kết nối SSE thành công ngay lập tức
      sendEvent({
        type: "CONNECTED",
        timestamp: new Date().toISOString(),
      });

      // 2. Đăng ký nhận sự kiện thay đổi dữ liệu thời gian thực từ tất cả các dịch vụ
      const unsubscribe = subscribeRealtimeEvents((event) => {
        sendEvent(event);
      });

      // 3. Heartbeat mỗi 15 giây để giữ kết nối SSE luôn sống
      const heartbeat = setInterval(() => {
        if (closed) return;
        try {
          controller.enqueue(encoder.encode(`: heartbeat ${Date.now()}\n\n`));
        } catch {
          closed = true;
        }
      }, 15000);

      // 4. Dọn dẹp tài nguyên khi client ngắt kết nối
      request.signal.addEventListener("abort", () => {
        closed = true;
        clearInterval(heartbeat);
        unsubscribe();
        try {
          controller.close();
        } catch {}
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
