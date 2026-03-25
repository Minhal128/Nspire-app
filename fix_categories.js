const fs = require('fs');
const file = 'src/screens/InspectionCategoriesScreen.tsx';

let content = fs.readFileSync(file, 'utf8');

const target = `<TouchableOpacity style={styles.buildingHeader} onPress={openBuildingEditModal} activeOpacity={0.7}>
            <Ionicons name="business-outline" size={24} color="#FFFFFF" />
            <Text style={styles.buildingTitle}>BUILDING NO: {buildingName}</Text>
            <View style={styles.buildingEditBtn}>
              <Ionicons name="pencil-outline" size={16} color="#FFFFFF" />
            </View>
          </TouchableOpacity>`;

const replacement = `<View style={styles.buildingHeader}>
            <Ionicons name="business-outline" size={24} color="#FFFFFF" />
            <Text style={styles.buildingTitle}>BUILDING NO: {buildingName}</Text>
          </View>`;

content = content.replace(target, replacement);

fs.writeFileSync(file, content);
console.log("Replaced successfully!");
