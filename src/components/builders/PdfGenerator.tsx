import React from 'react';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { IOrder } from '@/types';
import { IOrderDTO } from '@/services/order/types';

const styles = StyleSheet.create({
  page: {
    fontSize: 12,
    padding: 30,
    direction: 'rtl', // افزودن جهت راست به چپ برای فارسی
  },
  header: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 10,
    padding: 10,
    border: '1px solid #000',
  },
  table: {
    display: 'flex',
    flexDirection: 'column',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: 'row',
    borderStyle: 'solid',
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
  tableColHeader: {
    flex: 1,
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: '#f2f2f2',
    textAlign: 'center',
    padding: 5,
  },
  tableCol: {
    flex: 1,
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    textAlign: 'center',
    padding: 5,
  },
  tableCell: {
    margin: 'auto',
    marginTop: 5,
    fontSize: 10,
  },
});
interface Props {
 order : IOrderDTO
}

const PdfGenerator = ({ order } : Props) => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.header}>فاکتور سفارش</Text>
      <View style={styles.section}>
        <Text>فروشنده:</Text>
        <Text>نام شرکت: [نام شرکت]</Text>
        <Text>نام: [نام فروشنده]</Text>
        <Text>تلفن: [شماره تلفن فروشنده]</Text>
        <Text>کد پستی: [کد پستی فروشنده]</Text>
      </View>
      <View style={styles.section}>
        <Text>خریدار:</Text>
        <Text>نام: {order.address.fullName}</Text>
        <Text>شناسه ملی: [شناسه ملی خریدار]</Text>
        <Text>تلفن: {order.address.mobileNumber}</Text>
        <Text>کد پستی: {order.address.postalCode}</Text>
      </View>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableColHeader}><Text style={styles.tableCell}>ردیف</Text></View>
          <View style={styles.tableColHeader}><Text style={styles.tableCell}>شناسه کالا</Text></View>
          <View style={styles.tableColHeader}><Text style={styles.tableCell}>نام کالا</Text></View>
          <View style={styles.tableColHeader}><Text style={styles.tableCell}>تعداد</Text></View>
          <View style={styles.tableColHeader}><Text style={styles.tableCell}>مبلغ واحد</Text></View>
          <View style={styles.tableColHeader}><Text style={styles.tableCell}>مبلغ کل</Text></View>
          <View style={styles.tableColHeader}><Text style={styles.tableCell}>تخفیف</Text></View>
          <View style={styles.tableColHeader}><Text style={styles.tableCell}>جمع کل پس از تخفیف</Text></View>
        </View>
        {order.cart.map((item, index) => (
          <View style={styles.tableRow} key={item.itemID}>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{index + 1}</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{item.itemID}</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{item.name}</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{item.quantity}</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{item.price}</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{item.price * item.quantity}</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{item.discount}%</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{(item.price * item.quantity) * (1 - item.discount / 100)}</Text></View>
          </View>
        ))}
      </View>
      <View style={styles.section}>
        <Text>جمع کل مبلغ: {order.totalPrice}</Text>
        <Text>مجموع تخفیف: {order.totalDiscount}</Text>
        <Text>مبلغ نهایی: {order.totalPrice - order.totalDiscount}</Text>
      </View>
    </Page>
  </Document>
);

export default PdfGenerator