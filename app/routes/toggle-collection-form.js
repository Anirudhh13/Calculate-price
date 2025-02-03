import { json } from '@remix-run/node';
import { authenticate } from '../shopify.server';


export async function action({request}) {
  try {
    const body = await request.json(); 
    console.log(body.definition.value);
    console.log(typeof body.definition.value); 

    const { admin } = await authenticate.admin(request);

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
              "key": "visibilityOnCollection",
              "namespace": "custom_form",
              "ownerId": "gid://shopify/Shop/57383223459",
              "type": "boolean",
              "value": body.definition.value
            }
          ]
        },
      },
    );
    

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error updating metafield:", error);
    return { success: false, error };
  }
}

export async function loader() {
  return json(await fakeGetTodos());
}
