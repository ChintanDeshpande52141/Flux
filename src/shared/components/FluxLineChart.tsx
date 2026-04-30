import { useTheme } from "@/shared/theme";
import React, { useState } from "react";
import { View } from "react-native";
import { LineChart } from "react-native-gifted-charts";

type DataPoint = {
  value: number;
  label?: string;
};

type Props = {
  data: DataPoint[];
  height?: number;
  color?: string;
  showRules?: boolean;
  showYAxis?: boolean;
  curved?: boolean;
  noOfSections?: number;
  initialSpacing?: number;
  endSpacing?: number;
};

export const FluxLineChart = ({
  data,
  height = 120,
  color,
  showRules = false,
  showYAxis = false,
  curved = true,
  noOfSections = 3,
  initialSpacing = 10,
  endSpacing = 3,
}: Props) => {
  const theme = useTheme();
  const chartColor = color ?? theme.veloBlue;
  const [chartWidth, setChartWidth] = useState(0);

  // gifted-charts always reserves a fixed dp strip for the y-axis to the
  // left of the chart viewport. Subtract it so the visible area matches
  // our spacing calculation on every device.
  const Y_AXIS_RESERVED = showYAxis ? 40 : 35;
  const chartAreaWidth = chartWidth > 0 ? chartWidth - Y_AXIS_RESERVED : 0;

  // (N points) = (N-1) gaps → last point lands at the right edge.
  const spacing =
    chartAreaWidth > 0 && data.length > 1
      ? Math.floor(
          (chartAreaWidth - initialSpacing - endSpacing) / (data.length - 1),
        )
      : 40;

  return (
    <View
      onLayout={(e) => setChartWidth(e.nativeEvent.layout.width)}
      style={{ overflow: "hidden" }}
    >
      {chartAreaWidth > 0 && (
        <LineChart
          data={data}
          width={chartAreaWidth}
          spacing={spacing}
          disableScroll
          height={height}
          curved={curved}
          color={chartColor}
          thickness={2.5}
          startFillColor={chartColor}
          endFillColor={`${chartColor}00`}
          startOpacity={0.15}
          endOpacity={0}
          areaChart
          dataPointsColor={chartColor}
          dataPointsRadius={5}
          hideRules={!showRules}
          rulesColor={theme.border}
          rulesType="solid"
          hideYAxisText={!showYAxis}
          yAxisColor="transparent"
          xAxisColor="transparent"
          yAxisTextStyle={{
            fontSize: 10,
            fontFamily: "Inter-Regular",
            color: theme.subtext,
          }}
          xAxisLabelTextStyle={{
            fontSize: 10,
            fontFamily: "Inter-Regular",
            color: theme.subtext,
          }}
          initialSpacing={initialSpacing}
          endSpacing={endSpacing}
          noOfSections={noOfSections}
          backgroundColor="transparent"
        />
      )}
    </View>
  );
};
