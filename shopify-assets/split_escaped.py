with open('index_escaped.txt', encoding='utf-8') as f:
    s = f.read()
mid = len(s) // 2
while s[mid-1] == '\\':
    mid += 1
part1 = s[:mid]
part2 = s[mid:]
with open('index_escaped_1.txt', 'w', encoding='utf-8') as f:
    f.write(part1)
with open('index_escaped_2.txt', 'w', encoding='utf-8') as f:
    f.write(part2)
print('part1:', len(part1), 'part2:', len(part2))
