with open(r'd:\INVITACIONES_DIGITALES\giovis-app\src\lib\template-injector.ts', 'r', encoding='utf-8') as f:
    content = f.read()

index = content.find('document.querySelectorAll(\'[data-field="whatsapp_url"]\')')
with open('lookup_output.txt', 'w', encoding='utf-8') as f:
    if index != -1:
         f.write("MATCH FOUND AT: " + str(index) + "\n")
         f.write(content[index-20:index+300])
    else:
         f.write("NOT FOUND")
