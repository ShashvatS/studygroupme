out = open("emailsfinal.txt", "w")

with open("emailsv2.txt", "r") as f:
    lines = []
    for line in f:
        if line == "\n":
            out.write(line)
        elif line not in lines:
            out.write(line)
            lines.append(line)

out.close()