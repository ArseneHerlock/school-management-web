import os
import sys

app_dir = r"f:\Final-Test\V1\school-management-web\app"
corrupted = []

for root, dirs, files in os.walk(app_dir):
    for f in files:
        if f.endswith(('.tsx', '.ts')):
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8', errors='ignore') as fp:
                txt = fp.read()
            # check for common mojibake patterns
            if any(p in txt for p in ['A', '`', '?', '~', 'T', '1', 'u', 'c', '-']):
                corrupted.append(os.path.relpath(path, app_dir))

sys.stdout.reconfigure(encoding='utf-8')
print(f"Total files with mojibake: {len(corrupted)}")
for c in sorted(corrupted):
    print(c)
