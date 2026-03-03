import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Button>
        <Text>Click Me</Text>
      </Button>
    </View>
  );
}
