import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept, X-Requested-With",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

// Real application registry for public admissions - no fake data
let applicationsMemory: any[] = [];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const status = searchParams.get("status") || "ALL";

    let result = [...applicationsMemory];

    if (status !== "ALL") {
      result = result.filter((a) => a.trangThai === status);
    }

    if (q.trim()) {
      const query = q.trim().toLowerCase();
      result = result.filter(
        (a) =>
          a.tenTre?.toLowerCase().includes(query) ||
          a.tenCha?.toLowerCase().includes(query) ||
          a.tenMe?.toLowerCase().includes(query) ||
          a.dienThoaiLienHe?.includes(query),
      );
    }

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const id = crypto.randomUUID();
    const newApp = {
      ...body,
      id,
      trangThai: "CHO_DUYET",
      ngayDangKy: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    applicationsMemory.unshift(newApp);

    return NextResponse.json({
      success: true,
      id,
      message: "Nộp đơn xin nhập học thành công",
    });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { ids, action, targetStatus, classId } = body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { message: "Danh sách ID không hợp lệ" },
        { status: 400 },
      );
    }

    const idSet = new Set(ids);

    if (action === "DELETE") {
      applicationsMemory = applicationsMemory.filter((a) => !idSet.has(a.id));
      return NextResponse.json({
        success: true,
        count: ids.length,
        message: "Đã xóa hồ sơ tuyển sinh",
      });
    }

    applicationsMemory = applicationsMemory.map((a) => {
      if (idSet.has(a.id)) {
        return {
          ...a,
          trangThai:
            targetStatus || (action === "APPROVE" ? "DA_DUYET" : "TU_CHOI"),
          lopPhanCongId: classId || a.lopPhanCongId,
        };
      }
      return a;
    });

    return NextResponse.json({
      success: true,
      count: ids.length,
      message: "Cập nhật trạng thái thành công",
    });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "Thiếu ID hồ sơ" }, { status: 400 });
    }

    applicationsMemory = applicationsMemory.filter((a) => a.id !== id);
    return NextResponse.json({
      success: true,
      message: "Đã xóa hồ sơ tuyển sinh",
    });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
