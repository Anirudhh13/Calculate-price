// import AdminDashboard from '../components/AdminDashboard';
import React from 'react';
import {
    Page,
    Layout,
    Text,
    Card,
    Button,
    BlockStack,
    Box,
    List,
    Link,
    InlineStack,
    ButtonGroup,
  } from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";

const settings = () => {
  return (
    <Page>
      <TitleBar title="Settings">
        {/* <button variant="primary" onClick={generateProduct}>
          Generate a product
        </button> */}
      </TitleBar>
    </Page>
  );
};

export default settings;