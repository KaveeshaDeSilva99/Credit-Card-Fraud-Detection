import React, { useState, useEffect } from 'react';
import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';

// styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4',
    padding: 10,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  heading: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  content: {
    fontSize: 12,
  },
  table: {
    display: 'table',
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderCollapse: 'collapse',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCell1: {
    margin: 'auto',
    marginVertical: 5,
    padding: 5,
    borderStyle: 'solid',
    borderWidth: 0,
    textAlign: 'center',
    fontSize: 8, 
    marginRight: "47px"
  },
  tableCell: {
    margin: 'auto',
    marginVertical: 8,
    padding: 5,
    borderStyle: 'solid',
    borderWidth: 0,
    textAlign: 'center',
    fontSize: 7, 
  },
});

//PDF
const ReportDetails = () => {
  const [predictionData, setPredictionData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/prediction_data');
        const data = await response.json();
        setPredictionData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const renderTable = () => {
    if (!predictionData) return null;

    return (
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell1}>Bank Account Number</Text>
          <Text style={styles.tableCell1}>Credit Card Number</Text>
          <Text style={styles.tableCell1}>NIC</Text>
          <Text style={styles.tableCell1}>Card Holder Name</Text>
          <Text style={styles.tableCell1}>Email</Text>
          <Text style={styles.tableCell1}>Payment Status</Text>
        </View>
        {predictionData.map((item, index) => (
          <View key={index} style={styles.tableRow}>
          <Text style={styles.tableCell}>{item["Bank account number"] || "Not Bank account numbe"}</Text>
          <Text style={styles.tableCell}>{item["Credit card number"] || "Not Credit card number"}</Text>
          <Text style={styles.tableCell}>{item["NIC"] || "Not NIC"}</Text>
          <Text style={styles.tableCell}>{(item["Additional Data"] && item["Additional Data"]["Card holder name"]) || "Not Card holder name"}</Text>
          <Text style={styles.tableCell}>{(item["Additional Data"] && item["Additional Data"]["Email Address"]) || "Not Email Address"}</Text>
          <Text style={styles.tableCell}>{item["Prediction"] || "Not Prediction"}</Text>
        </View>
        ))}
      </View>
    );
  };

  return (
    <div>
      <PDFViewer style={{ width: '60%', height: '570px', marginTop: "38px", marginBottom: "38px" }}>
        <Document>
          <Page size="A4" style={styles.page}>
            <View style={styles.section}>
              <Text style={styles.heading} className='open-sans-header'>Payment Details Report</Text>
              {renderTable()}
            </View>
          </Page>
        </Document>
      </PDFViewer>
    </div>
  );
};

export default ReportDetails;