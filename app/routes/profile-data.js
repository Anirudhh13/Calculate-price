import { json } from '@remix-run/node';
import { authenticate } from '../shopify.server';

export async function action({request}) {
  try {
    const body = await request.json(); 
    console.log("body:---", body.value); 
    // console.log(typeof body); 

    const { admin } = await authenticate.admin(request);
    console.log("admin",admin);
    const response = await admin.graphql(
      `#graphql
      mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          metafields {
            key
            namespace
            value
            createdAt
            updatedAt
          }
          userErrors {
            field
            message
            code
          }
        }
      }`,
      {
        variables: {
          "metafields": [
            {
              "key": body.key,
              "namespace": "custom_form",
              "ownerId": "gid://shopify/Shop/57383223459",
              "type": "single_line_text_field",
              "value": body.value
            }
          ]
        },
      },
    );
    

    const data = await response.json();
    console.log("data",data);
    return { success: true, data };
  } catch (error) {
    console.error("Error updating metafield:", error);
    return { success: false, error };
  }
}

export async function loader({ request }) {
  const { admin } = await authenticate.admin(request);

  const response = await admin.graphql(
    `#graphql
    query {
      metafields(first: 2, owner: "gid://shopify/Shop/57383223459") {
        edges {
          node {
            namespace
            key
            value
          }
        }
      }
    }`
  );

  const data = await response.json();
  console.log("all meta:", data);
  return data; 
}


