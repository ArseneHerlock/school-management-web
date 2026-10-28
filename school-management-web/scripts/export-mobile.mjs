import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const rootDir = 'F:/Final-Test/V1/school-management-web';
const nextConfigPath = path.join(rootDir, 'next.config.ts');
const backendRoutePath = path.join(rootDir, 'app/api/backend/[service]/[...path]/route.ts');
const parentRoutePath = path.join(rootDir, 'app/api/parent/profile/route.ts');
const enrollRoutePath = path.join(rootDir, 'app/api/enrollment/route.ts');

const origNextConfig = fs.readFileSync(nextConfigPath, 'utf8');
const origBackendRoute = fs.readFileSync(backendRoutePath, 'utf8');
const origParentRoute = fs.readFileSync(parentRoutePath, 'utf8');
const origEnrollRoute = fs.readFileSync(enrollRoutePath, 'utf8');

try {
  console.log('Preparing configs for static export...');
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

  const staticBackendRoute = `export const dynamic = "force-static";\nexport function generateStaticParams() {\n  return [{ service: "auth", path: ["ping"] }];\n}\n` + origBackendRoute;
  fs.writeFileSync(backendRoutePath, staticBackendRoute, 'utf8');

  fs.writeFileSync(parentRoutePath, `export const dynamic = "force-static";\n` + origParentRoute, 'utf8');
  fs.writeFileSync(enrollRoutePath, `export const dynamic = "force-static";\n` + origEnrollRoute, 'utf8');

  console.log('Building static export (npm run build)...');
  execSync('npm run build', { cwd: rootDir, stdio: 'inherit' });

  console.log('Copying fresh out to Mobile/www...');
  const mobileWww = path.resolve('F:/Final-Test/V1/Mobile/www');
  if (fs.existsSync(mobileWww)) {
    fs.rmSync(mobileWww, { recursive: true, force: true });
  }
  fs.cpSync(path.join(rootDir, 'out'), mobileWww, { recursive: true });

  // Also ensure pdfjs is copied if available
  const pdfjsSrc = path.join(rootDir, 'public/pdfjs');
  if (fs.existsSync(pdfjsSrc)) {
    fs.cpSync(pdfjsSrc, path.join(mobileWww, 'pdfjs'), { recursive: true });
  }

  console.log('Static export and copy completed successfully!');
} catch (e) {
  console.error('Build/Export failed:', e);
  process.exitCode = 1;
} finally {
  console.log('Restoring original Next.js dynamic files for dev server...');
  fs.writeFileSync(nextConfigPath, origNextConfig, 'utf8');
  fs.writeFileSync(backendRoutePath, origBackendRoute, 'utf8');
  fs.writeFileSync(parentRoutePath, origParentRoute, 'utf8');
  fs.writeFileSync(enrollRoutePath, origEnrollRoute, 'utf8');
  console.log('Original dynamic files restored.');
}
