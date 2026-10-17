# Link every src/content/nNN.html into the matching chapter line of src/curriculum.ts (by position).
import os, re
p = 'src/curriculum.ts'; s = open(p).read()
a = s.index('const RAW = `') + len('const RAW = `'); b = s.index('`;', a)
out, n = [], 0
for line in s[a:b].split('\n'):
    if line and not line.startswith('#'):
        title, lvl, content, topics = line.split('|', 3)
        key = f'n{n:02d}'
        if not content and os.path.exists(f'src/content/{key}.html'):
            line = f'{title}|{lvl}|{key}|{topics}'
        n += 1
    out.append(line)
open(p, 'w').write(s[:a] + '\n'.join(out) + s[b:])
