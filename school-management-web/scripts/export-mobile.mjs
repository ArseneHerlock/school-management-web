import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const rootDir = 'F:/Final-Test/V1/school-management-web';
const mobileDir = 'F:/Final-Test/V1/Mobile';
const nextConfigPath = path.join(rootDir, 'next.config.ts');
const apiDirPath = path.join(rootDir, 'app/api');
const tempApiDirPath = path.join(rootDir, 'app/_api_temp_export');

const origNextConfig = fs.readFileSync(nextConfigPath, 'utf8');
let apiRenamed = false;

try {
  console.log('1. Cấu hình Next.js cho Static Export (Mobile)...');
  const exportNextConfig = `import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
`;
  fs.writeFileSync(nextConfigPath, exportNextConfig, 'utf8');

  // Xóa cache .next cũ để Next.js tạo mới validator types cho Static Export
  const dotNextPath = path.join(rootDir, '.next');
  if (fs.existsSync(dotNextPath)) {
    console.log('2. Làm sạch bộ nhớ đệm .next...');
    fs.rmSync(dotNextPath, { recursive: true, force: true });
  }

  // Tạm thời di dời app/api để Next.js không bị chặn bởi các server API route
  if (fs.existsSync(apiDirPath)) {
    console.log('3. Tạm thời đóng gói các endpoint server backend proxy...');
    fs.renameSync(apiDirPath, tempApiDirPath);
    apiRenamed = true;
  }

  console.log('4. Đang thực thi build Static Export (npm run build)...');
  execSync('npm run build', { cwd: rootDir, stdio: 'inherit' });

  console.log('5. Sao chép bản build mới nhất sang thư mục Mobile/www...');
  const mobileWww = path.resolve(mobileDir, 'www');
  if (fs.existsSync(mobileWww)) {
    fs.rmSync(mobileWww, { recursive: true, force: true });
  }
  fs.cpSync(path.join(rootDir, 'out'), mobileWww, { recursive: true });

  // Sao chép pdfjs nếu có
  const pdfjsSrc = path.join(rootDir, 'public/pdfjs');
  if (fs.existsSync(pdfjsSrc)) {
    fs.cpSync(pdfjsSrc, path.join(mobileWww, 'pdfjs'), { recursive: true });
  }

  console.log('6. Đồng bộ mã nguồn với Capacitor Android...');
  execSync('npx cap sync android', { cwd: mobileDir, stdio: 'inherit' });

  console.log('=> XUẤT BẢN VÀ ĐỒNG BỘ MOBILE THÀNH CÔNG RỰC RỠ!');
} catch (e) {
  console.error('Lỗi khi xuất bản Mobile:', e);
  process.exitCode = 1;
} finally {
  console.log('7. Khôi phục lại cấu hình và API server cho chế độ Web dev server...');
  if (apiRenamed && fs.existsSync(tempApiDirPath)) {
    fs.renameSync(tempApiDirPath, apiDirPath);
    console.log('   - Đã khôi phục thư mục app/api.');
  }
  fs.writeFileSync(nextConfigPath, origNextConfig, 'utf8');
  console.log('   - Đã khôi phục next.config.ts.');
}
