import { View } from "react-native";
import Svg, { G, Path } from "react-native-svg";
import DefaultImageUser from "../../assets/images/defaultUserImage.png";
import { Image } from "expo-image";
interface StoryCircleImageProps {
  image?: string;
  size: number;
  storiesCount: number;
  viewedStories: number;
}

export function StorySVG({
  image,
  size,
  storiesCount,
  viewedStories,
}: StoryCircleImageProps) {
  const radius = size / 2; // Calcula o raio do círculo.
  const strokeWidth = 2; // Define a largura da linha.
  const center = radius + strokeWidth; // Calcula o centro do círculo.
  const circleRadius = radius + strokeWidth / 2; // Calcula o raio do círculo ajustado pela largura da linha.
  const angleStep = (2 * Math.PI) / storiesCount; // Calcula o ângulo de cada segmento do círculo.
  const gapSpace = storiesCount === 1 ? 99 : 0.9;
  const getSpace = (totalStories: number) => {
    if (totalStories === 1) return 0.99;
    if (totalStories === 2) return 0.95;
    if (totalStories === 3) return 0.85;
    return 0.8;
  };
  const renderSegments = () => {
    return Array.from({ length: storiesCount }).map((_, index) => {
      const startAngle = angleStep * index; // Calcula o ângulo de início e fim de cada segmento.
      const endAngle = startAngle + angleStep * getSpace(storiesCount); // Para dar espaço entre segmentos

      // Calcula as coordenadas x e y do início do segmento.
      const startX = center + circleRadius * Math.cos(startAngle);
      const startY = center + circleRadius * Math.sin(startAngle);

      // Calcula as coordenadas x e y do fim do segmento.
      const endX = center + circleRadius * Math.cos(endAngle);
      const endY = center + circleRadius * Math.sin(endAngle);

      // Define se o arco será grande ou pequeno.
      const largeArcFlag = endAngle - startAngle <= Math.PI ? "0" : "1";

      // Define os dados do caminho do SVG.
      const pathData = `
        M ${startX} ${startY}
        A ${circleRadius} ${circleRadius} 0 ${largeArcFlag} 1 ${endX} ${endY}
      `;

      return (
        <Path
          key={index}
          d={pathData}
          fill="none"
          stroke={index < viewedStories ? "#D8DFE3" : "#1A851A"}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      );
    });
  };
  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <Svg height={size + strokeWidth * 2} width={size + strokeWidth * 2}>
        <G rotation="-90" origin={`${center}, ${center}`}>
          {renderSegments()}
        </G>
      </Svg>
      <Image
        source={image ? { uri: image } : DefaultImageUser}
        style={{
          width: size - 6,
          height: size - 6,
          borderRadius: 999,
          position: "absolute",
        }}
      />
    </View>
  );
}
