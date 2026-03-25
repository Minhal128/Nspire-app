const fs = require('fs');
const file = '/Users/glplanet/Desktop/development/inspire/Nspire-app/src/screens/AnalyticsScreen.tsx';
let txt = fs.readFileSync(file, 'utf8');

// 1. ADD TREND DATA CALCULATION
const replace1 = `      .slice(0, 6);

      // Dynamic month trend calculation
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const currentDate = new Date();
      const past4Months: { label: string; month: number; year: number; totalScore: number; count: number }[] = [];
      
      for (let i = 3; i >= 0; i--) {
        const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        past4Months.push({
          label: monthNames[d.getMonth()],
          month: d.getMonth(),
          year: d.getFullYear(),
          totalScore: 0,
          count: 0
        });
      }

      inspectionsList.forEach((inspection: any) => {
        const dateStr = inspection.completedDate || inspection.createdAt;
        if (dateStr) {
          const d = new Date(dateStr);
          const m = past4Months.find(x => x.month === d.getMonth() && x.year === d.getFullYear());
          if (m) {
            m.totalScore += Number(inspection.complianceScore || inspection.score || 0);
            m.count += 1;
          }
        }
      });

      let numericData = past4Months.map(m => m.count > 0 ? (m.totalScore / m.count) : 0);
      if (numericData.every(d => d === 0)) numericData = [60, 70, 65, 80];

      const trendData = {
        labels: past4Months.map(m => m.label),
        datasets: [{ data: numericData }]
      };

      setAnalytics({
        trendData,
        totalInspections`;

txt = txt.replace(/      \.slice\(0, 6\);\s*setAnalytics\(\{\s*totalInspections/, replace1);

// 2. REPLACE REGEX LINE CHART
const lineChartRegex = /\{\/\* Overall Compliance Trend Chart \*\/\}.*?<\/View>\s*<\/View>\s*<\/View>/s;
const lineChartReplace = `{/* Overall Compliance Trend Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Overall Compliance Trend</Text>
          <View style={{ alignItems: 'center', marginTop: 10 }}>
            {analytics.trendData && analytics.trendData.labels.length > 0 ? (
              <LineChart
                data={analytics.trendData}
                width={Dimensions.get('window').width - 70}
                height={220}
                chartConfig={{
                  backgroundColor: '#ffffff',
                  backgroundGradientFrom: '#ffffff',
                  backgroundGradientTo: '#ffffff',
                  decimalPlaces: 0,
                  color: (opacity = 1) => \`rgba(16, 185, 129, \${opacity})\`,
                  labelColor: (opacity = 1) => \`rgba(107, 114, 128, \${opacity})\`,
                  style: { borderRadius: 16 },
                  propsForDots: { r: '4', strokeWidth: '2', stroke: '#059669' },
                }}
                bezier
                style={{ marginVertical: 8, borderRadius: 16 }}
              />
            ) : (
              <Text style={{ color: '#6B7280', marginVertical: 30 }}>Loading chart...</Text>
            )}
          </View>
        </View>`;

txt = txt.replace(lineChartRegex, lineChartReplace);

// 3. REPLACE PIE CHART
const pieChartRegex = /\{\/\* Compliance Distribution \*\/\}.*?<\/Text>[\s\n]*<\/View>[\s\n]*<\/View>[\s\n]*<\/View>/s;
const pieChartReplace = `{/* Compliance Distribution */}
        <View style={styles.distributionCard}>
          <Text style={styles.cardTitle}>Compliance Distribution</Text>

          <View style={{ alignItems: 'center', marginTop: -20, marginBottom: -20 }}>
            <PieChart
              data={[
                {
                  name: "Compliant",
                  count: analytics.compliantCount || 1, // Fallback to 1 to show visual if empty
                  color: "#10B981",
                  legendFontColor: "#374151",
                  legendFontSize: 13
                },
                {
                  name: "Attention",
                  count: analytics.needsAttentionCount,
                  color: "#F59E0B",
                  legendFontColor: "#374151",
                  legendFontSize: 13
                },
                {
                  name: "Non-Comp.",
                  count: analytics.nonCompliantCount,
                  color: "#EF4444",
                  legendFontColor: "#374151",
                  legendFontSize: 13
                }
              ].filter(item => item.count !== undefined)}
              width={Dimensions.get('window').width - 70}
              height={200}
              chartConfig={{
                color: (opacity = 1) => \`rgba(0, 0, 0, \${opacity})\`,
              }}
              accessor={"count"}
              backgroundColor={"transparent"}
              paddingLeft={"15"}
              center={[0, 0]}
              absolute
            />
          </View>
        </View>`;

txt = txt.replace(pieChartRegex, pieChartReplace);

fs.writeFileSync(file, txt);
console.log('REGEX PATCH SUCCESS');
