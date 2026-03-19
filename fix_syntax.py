import re

with open('src/screens/ReportsScreen.tsx', 'r') as f:
    text = f.read()

# Fix the dangling closing brace
text = re.sub(r'          \}\);\s*\n          setPreviewHtml', r'          setPreviewHtml', text)

with open('src/screens/ReportsScreen.tsx', 'w') as f:
    f.write(text)
