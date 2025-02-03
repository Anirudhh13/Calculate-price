import { Link, Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { NavMenu } from "@shopify/app-bridge-react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";
// import { authenticate } from "../shopify.server";
import { Links, LiveReload, Meta, Scripts } from '@remix-run/react';

import { json } from '@remix-run/node';
import { getVisibility } from './toggle-registration-form';
import AdminPage from "./app.admin";

//https://my-public-app.myshopify.com/apps/test-app
export const links = () => [{ rel: "stylesheet", href: polarisStyles }];


export async function loader({request}) {
  // await shopify.authenticate.admin(request);
  return json({
    apiKey: process.env.SHOPIFY_API_KEY,
  });
}


export const action = async ({ request }) => {
  try {
    const contentType = request.headers.get("Content-Type");
    if (contentType === "application/json") {
      const data = await request.json();

      const isRegistrationFormVisible = getVisibility();

      return json({  apiKey: process.env.SHOPIFY_API_KEY || "", success: true, message: "Data processed successfully", data });
    } else {
      return json(
        { success: false, message: `Unsupported Content-Type: ${contentType}` },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return json({ success: false, message: error.message }, { status: 500 });
  }
};


export default function App() {
  return (
    <AppProvider>
            <NavMenu>
        <Link to="/app" rel="home">
          Home
        </Link>
        <Link to="/app/admin">Registration Form</Link>
        <Link to="/app/page">Page</Link>
        <Link to="/app/settings">Settings</Link>
      </NavMenu>
        <Outlet />
        <Scripts />
        <LiveReload />
    </AppProvider>
  );
}

// Shopify needs Remix to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
