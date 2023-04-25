import React, { useState } from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import * as DocumentPicker from "expo-document-picker";

export default function App() {
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [numberOfPages, setNumberOfPages] = useState(0);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync();
      if (result.type === "success") {
        setSelectedDocument(result);
        // Update number of pages based on document type
        if (result.type === "pdf") {
          setNumberOfPages(10); // example: set number of pages for PDF
        } else if (result.type === "doc" || result.type === "docx") {
          setNumberOfPages(5); // example: set number of pages for Word
        } else if (result.type === "ppt" || result.type === "pptx") {
          setNumberOfPages(20); // example: set number of pages for PowerPoint
        }
      }
    } catch (err) {
      console.error("Error picking document:", err);
    }
  };

  const handleSendDocument = async () => {
    const formData = new FormData();
    formData.append("document", {
      uri: selectedDocument.uri,
      type: selectedDocument.type,
      name: selectedDocument.name,
    });

    try {
      const response = await fetch("http:localhost:3000/upload", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        console.log("File sent successfully!");
        setSelectedDocument(null);
      } else {
        console.error("Failed to send file:", response.statusText);
      }
    } catch (err) {
      console.error("Error sending file:", err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        <Text style={styles.navBarTitle}>Unified Xerox Interface</Text>
      </View>
      <View style={styles.contentContainer}>
        <Button title="Add Document" onPress={pickDocument} />
        {selectedDocument && (
          <View style={styles.selectedDocumentContainer}>
            <Text style={styles.selectedDocumentTitle}>
              Selected Document <Text>Number of Pages</Text>
            </Text>

            <Text style={styles.selectedDocument}>
              {selectedDocument.name} : {numberOfPages}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.sendButtonContainer}>
        <Button title="Send" onPress={handleSendDocument} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 45,
  },
  navBar: {
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  navBarTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },

  selectedDocumentContainer: {
    padding: 16,
  },
  sendButtonContainer: {
    paddingBottom: 40,
  },
});
