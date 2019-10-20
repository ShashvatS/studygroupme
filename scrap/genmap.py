import json

emails = open("emailfinalmanualedit.txt", "r")
names = open("list_of_people2.txt", "r")

email_lines = emails.readlines()

m = {}
n = {}

idx = 0
for name in names:
    email = email_lines[idx][:-1]
    name = name[:-1]

    if name in m.keys():
        continue

    if email == "":
        email = "president@harvard.edu"

    m[name] = email
    n[email] = name

    m[name] = email
    idx += 1

emails.close()
names.close()

outm = open("name_to_email.json", "w")
outn = open("email_to_name.json", "w")

outm.write(json.dumps(m))
outn.write(json.dumps(n))

outm.close()
outn.close()