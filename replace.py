with open(r'd:\INVITACIONES_DIGITALES\giovis-app\src\lib\template-injector.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Intentar encontrar con varias combinaciones de indentación
import re

pattern = r"""  document\.querySelectorAll\('\[data-field="whatsapp_url"\]'\)\.forEach\(el => \{\s+// Interceptar botón RSVP si hay invitado\s+el\.addEventListener\('click', function\(e\) \{\s+if \(window\.__isGuestMode\) \{\s+e\.preventDefault\(\);\s+e\.stopPropagation\(\);\s+window\.parent\.postMessage\(\{ type: 'RSVP_CLICK' \}, '\*'\);\s+\}\s+\}\);"""

replacement = """  document.querySelectorAll('[data-field="whatsapp_url"]').forEach(el => {
    el.addEventListener('click', function(e) {
      const urlParams = new URLSearchParams(window.location.search);
      const hasGuest = urlParams.get('inv');
      if (hasGuest) {
        e.preventDefault();
        e.stopPropagation();
        window.parent.postMessage({ type: 'GUEST_CONFIRM' }, '*');
        return false;
      }
    }, true);"""

modified_content = re.sub(pattern, replacement, content, flags=re.MULTILINE)

if modified_content != content:
    with open(r'd:\INVITACIONES_DIGITALES\giovis-app\src\lib\template-injector.ts', 'w', encoding='utf-8') as f:
        f.write(modified_content)
    print("REPLACED SUCCESS")
else:
    print("NOT FOUND AGAIN")
