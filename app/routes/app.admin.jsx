import AdminDashboard from '../components/AdminDashboard';
import {
  Page,
} from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";

const AdminPage = () => {
  return (
    <Page>
      <TitleBar title="Registration Form">
      </TitleBar>
      <AdminDashboard />
    </Page>
  );
};

export default AdminPage;