with open(r'd:\INVITACIONES_DIGITALES\giovis-app\src\lib\template-injector.ts', 'r', encoding='utf-8') as f:
    content = f.read()

lines = content.split('\n')
for i in range(395, 410):
    if i < len(lines):
        print(f"[{i+1}]", repr(lines[i]))
