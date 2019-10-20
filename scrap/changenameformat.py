out = open("list_of_people2.txt", "w")

with open("list_of_people.txt", "r") as f:
    i = 0
    for line in f:
        line = line.split(",")
        if len(line) > 1:
            line = line[1][1:-1] + " " + line[0] + '\n'
        elif len(line) == 1:
            line = line[0]
        if len(line) == 3:
            print("yo")

        out.write(line)

out.close()


# with open("list_of_people2.txt", "r") as f:
#     i = 0
#     for line in f:
#         line = line.split(",")
#         if len(line) > 1:
#             line = line[1][1:-1] + " " + line[0] + '\n'
#         elif len(line) == 1:
#             line = line[0]
#         if len(line) == 3:
#             print("yo")

#         out.write(line)

