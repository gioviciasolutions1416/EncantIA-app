with open(r'd:\INVITACIONES_DIGITALES\giovis-app\src\lib\template-injector.ts', 'r', encoding='utf-8') as f:
    content = f.read()

start_index = content.find(r"document.querySelectorAll('[data-field=\"whatsapp_url\"]').forEach")
end_index = content.find("});", start_index) + 3

if start_index != -1 and end_index != -1:
    target_substring = content[start_index:end_index]
    
    if "RSVP_CLICK" in target_substring:
        replacement = """document.querySelectorAll('[data-field="whatsapp_url"]').forEach(el => {
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
        
        content = content.replace(target_substring, replacement)
        
        with open(r'd:\INVITACIONES_DIGITALES\giovis-app\src\lib\template-injector.ts', 'w', encoding='utf-8') as f:
            f.write(content)
        print("REPLACED SUCCESS")
    else:
        print("RSVP_CLICK NOT IN SUBSTRING")
else:
    print("NOT FOUND AT ALL")
