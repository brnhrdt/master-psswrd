import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import * as Clipboard from "expo-clipboard";
import React, { useState } from "react";
import { mdmapping } from "./src/core/english";
import { SeedGenerator } from "./src/core/shaSeedGenerator";
import { MarkovHumanizer } from "./src/core/humanizer";
import { PasswordGenerator } from "./src/core/passwordGenerator";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

const h = new MarkovHumanizer(mdmapping);
const sg = new SeedGenerator();
const gp = new PasswordGenerator(sg, h);

let clipboardNotificationTimer = null;

export default function App() {
  const [master1, onChangeMaster1] = useState("");
  const [master2, onChangeMaster2] = useState("");
  const [ressource, onChangeRessource] = useState("");
  const [result, onChangeResult] = useState("");
  const [error, setError] = useState("");
  const [copyNotification, setCopyNotification] = useState(false);

  const validateInput = () => {
    let valid = false;
    if (master1 === "") {
      setError("Missing master password");
    } else {
      if (ressource === "") {
        setError("Missing ressource");
      } else {
        if (master2 !== "" && master1 !== master2) {
          setError("Master passwords don't match");
        } else {
          valid = true;
          setError("");
        }
      }
    }

    return valid;
  };

  const displayCopyNotification = () => {
    if (clipboardNotificationTimer) {
      clearTimeout(clipboardNotificationTimer);
      setCopyNotification(false);
    }
    setCopyNotification(true);
    clipboardNotificationTimer = setTimeout(() => {
      setCopyNotification(false);
    }, 1000);
  };

  const generatePassword = (generateFunction) => {
    let valid = validateInput();

    if (valid) {
      let pass = generateFunction();
      onChangeResult(pass);
      Clipboard.setStringAsync(pass).then(() => {
        displayCopyNotification();
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text
        style={{
          paddingBottom: 20,
        }}
      >
        Master Password
      </Text>
      <StatusBar style="auto" />
      <TextInput
        style={styles.input}
        value={master1}
        onChangeText={onChangeMaster1}
        placeholder="Master 1"
        secureTextEntry={true}
        autoComplete={"off"}
      />
      <TextInput
        style={styles.input}
        value={master2}
        onChangeText={onChangeMaster2}
        placeholder="Master 2"
        secureTextEntry={true}
        autoComplete={"off"}
      />
      <TextInput
        style={styles.input}
        value={ressource}
        onChangeText={onChangeRessource}
        placeholder="Ressource"
      />
      <View style={styles.buttonView}>
        <Button
          title="generate"
          onPress={() => {
            generatePassword(() => gp.generatePassword(master1, ressource));
          }}
        />
        <Button
          title="Generate"
          onPress={() => {
            generatePassword(() => {
              let pass = gp.generatePassword(master1, ressource);
              return pass.charAt(0).toUpperCase() + pass.slice(1);
            });
          }}
        />
      </View>

      <View style={styles.resultView}>
        {result && !error && <Text style={styles.result}>{result}</Text>}
        {error && <Text style={styles.error}>{error}</Text>}
        {copyNotification && (
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            <Text style={styles.clipboardNotification}>
              Copied to clipboard.
            </Text>
          </Animated.View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 55,
    gap: 15,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonView: {
    flexDirection: "row",
    gap: 40,
  },
  resultView: {
    minHeight: 200,
    gap: 40,
    alignItems: "center",
  },
  input: {
    width: "70%",
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
  },
  result: {
    fontSize: 20,
  },
  error: {
    fontSize: 20,
    color: "red",
  },
  clipboardNotification: {
    color: "#737373",
  },
});
