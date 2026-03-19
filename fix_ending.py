import re

with open('src/screens/ReportsScreen.tsx', 'r') as f:
    text = f.read()

text = text.replace(r"\'#CEF8FF\'", "'#CEF8FF'")

with open('src/screens/ReportsScreen.tsx', 'w') as f:
    f.write(text)
