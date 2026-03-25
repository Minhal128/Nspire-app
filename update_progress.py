with open('src/screens/BuildingInspectionScreen.tsx', 'r') as f:
    content = f.read()

find_str = """        progressData: {
          outsideProgress,
          insideProgress,
          unitProgress,
          outsideTotal: OUTSIDE_ITEMS.length,
          insideTotal: INSIDE_ITEMS.length,
          unitTotal: unitTotalItems
        }"""
        
replace_str = """        progressData: {
          outsideProgress,
          insideProgress,
          unitProgress,
          outsideTotal: OUTSIDE_ITEMS.length,
          insideTotal: INSIDE_ITEMS.length,
          unitTotal: unitTotalItems,
          buildingProgressMap: buildingProgressMap || {}
        }"""

if find_str in content:
    content = content.replace(find_str, replace_str)
    with open('src/screens/BuildingInspectionScreen.tsx', 'w') as f:
        f.write(content)
    print("Updated progressData")
else:
    print("Could not find progressData block")
