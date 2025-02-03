import { json } from "@remix-run/node";
import exp from "constants";


export const action = async ({ request }) => {
  const body = await request.json();
  if (body.target == "form_data"){
    form_data(body);
  }
  if (body.target == "create_product"){
    // create_product(body);
    return await create_product(body);
  }
  return {};
};

export async function form_data(body) {
  try {
    console.log("Received body:", body);

    const customerId = body.customerID;
    console.log("Extracted customerId:", customerId);

    const accessToken = 'shpua_b844a162a07c0c1f4a0aadf43cc3411e';
    const shop = 'my-public-app.myshopify.com';

    if (!accessToken || !shop) {
      return json({ success: false, error: "Missing Shopify credentials" }, { status: 500 });
    }

    // Convert body to a JSON string for metafield storage
    const metafieldValue = JSON.stringify(body);

    const response = await fetch(`https://${shop}/admin/api/2024-01/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken,
      },
      body: JSON.stringify({
        query: `
          mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
            metafieldsSet(metafields: $metafields) {
              metafields {
                id
                namespace
                key
                value
                type
              }
              userErrors {
                field
                message
              }
            }
          }
        `,
        variables: {
          metafields: [
            {
              namespace: "custom_namespace",
              key: "form_data",
              type: "json",
              value: metafieldValue,
              ownerId: `gid://shopify/Customer/${customerId}`,
            },
          ],
        },
      }),
    });

    const result = await response.json();
    console.log("GraphQL Response:", result);

    if (result.errors) {
      return json({ success: false, errors: result.errors }, { status: 400 });
    }

    if (result.data?.metafieldsSet?.userErrors?.length > 0) {
      return json({ success: false, errors: result.data.metafieldsSet.userErrors }, { status: 400 });
    }

    return json({ success: true, result });
    
  } catch (error) {
    console.error("Error:", error);
    return json({ success: false, error: error.message }, { status: 500 });
  }
}

// for creating product 
export async function create_product(body) {
  const shopifyAdminToken = 'shpua_b844a162a07c0c1f4a0aadf43cc3411e';
  const shopifyStoreDomain = 'my-public-app.myshopify.com';

  console.log("create product:", body);
  const { title, newprice, variantId } = body;

  try {
      const sanitizedPrice = parseFloat(newprice); 
      if (isNaN(sanitizedPrice)) {
          throw new Error("Invalid price format");
      }

      console.log(typeof sanitizedPrice); 

      const createProductResponse = await fetch(`https://${shopifyStoreDomain}/admin/api/2024-04/graphql.json`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "X-Shopify-Access-Token": shopifyAdminToken,
          },
          body: JSON.stringify({
              query: `
                  mutation {
                      productCreate(input: {
                          title: "${title}",
                          variants: [{ price: ${sanitizedPrice} }]
                      }) {
                          product {
                              id
                              variants(first: 1) {
                                  edges {
                                      node {
                                          id
                                      }
                                  }
                              }
                          }
                          userErrors {
                              field
                              message
                          }
                      }
                  }
              `,
          }),
      });

      const data = await createProductResponse.json();
      console.log("created product:", data);

      // Check for errors in response
      if (data.errors || data.data.productCreate.userErrors.length > 0) {
          throw new Error(JSON.stringify(data.errors || data.data.productCreate.userErrors));
      }

      const newProductId = data.data.productCreate.product.id;
      const newVariantId = data.data.productCreate.product.variants.edges[0].node.id;

      return ({ productId: newProductId, variantId: newVariantId });

  } catch (error) {
      console.error("Error creating product:", error.message);
      return json({ error: error.message }, { status: 400 });
  }
}



// adding product in the cart 
// async function processCartRequest(body) {
//   const shopifyStorefrontToken = 'shpua_b844a162a07c0c1f4a0aadf43cc3411e';
//   const shopifyStoreDomain = 'my-public-app.myshopify.com';

//   console.log(body, "bodydata");

//   try {
//       const { variantId } = body;

//       const addToCartResponse = await fetch(`https://${shopifyStoreDomain}/api/2024-04/graphql.json`, {
//           method: "POST",
//           headers: {
//               "Content-Type": "application/json",
//               "X-Shopify-Storefront-Access-Token": shopifyStorefrontToken,
//           },
//           body: JSON.stringify({
//               query: `
//                   mutation {
//                       cartCreate(input: {
//                           lines: [
//                               {
//                                   quantity: 1
//                                   merchandiseId: "${variantId}"
//                               }
//                           ]
//                       }) {
//                           cart {
//                               id
//                           }
//                           userErrors {
//                               field
//                               message
//                           }
//                       }
//                   }
//               `,
//           }),
//       });

//       const data = await addToCartResponse.json();
//       console.log("Full addToCartResponse:", JSON.stringify(data, null, 2));

//       // Ensure the response has the expected structure
//       if (!data || !data.data || !data.data.cartCreate) {
//           console.error("Unexpected API response:", data);
//           throw new Error("Invalid response from Shopify API");
//       }

//       // Check for user errors in the response
//       if (data.data.cartCreate.userErrors.length > 0) {
//           console.error("Shopify API User Errors:", data.data.cartCreate.userErrors);
//           throw new Error(JSON.stringify(data.data.cartCreate.userErrors));
//       }

//       return json({
//           cartId: data.data.cartCreate.cart.id,
//           productId: body.productId,
//           variantId: body.variantId
//       });

//   } catch (error) {
//       console.error("Error processing cart request:", error.message);
//       return json({ error: error.message, details: error.stack }, { status: 400 });
//   }
// }














// import { json } from "@remix-run/node";


// export const action = async ({ request }) => {
//   try {
//     const body = await request.json();
//     console.log("body1", body);

//     const customerId = body.customerID;
//     console.log("customerId1", customerId);

//     const accessToken = 'shpua_b844a162a07c0c1f4a0aadf43cc3411e';
//     const shop = 'my-public-app.myshopify.com';

//     if (!accessToken || !shop) {
//       return json({ success: false, error: "Missing Shopify credentials" }, { status: 500 });
//     }

//     const metafieldValue = JSON.stringify(body); 

//     const response = await fetch(`https://${shop}/admin/api/2024-01/graphql.json`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "X-Shopify-Access-Token": accessToken,
//       },
//       body: JSON.stringify({
//         query: `
//           mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
//             metafieldsSet(metafields: $metafields) {
//               metafields {
//                 id
//                 namespace
//                 key
//                 value
//                 type
//               }
//               userErrors {
//                 field
//                 message
//               }
//             }
//           }
//         `,
//         variables: {
//           metafields: [
//             {
//               namespace: "custom_namespace",
//               key: "form_data",
//               type: "json",
//               value: metafieldValue,
//               ownerId: `gid://shopify/Customer/${customerId}`,
//             },
//           ],
//         },
//       }),
//     });

//     const result = await response.json();
//     console.log("result1", result);

//     if (result.errors) {
//       return json({ success: false, errors: result.errors }, { status: 400 });
//     }

//     if (result.data?.customerUpdate?.userErrors?.length > 0) {
//       return json({ success: false, errors: result.data.customerUpdate.userErrors }, { status: 400 });
//     }

//     return json({ success: true , result});
//   } catch (error) {
//     console.error("Error:", error);
//     return json({ success: false, error: error.message }, { status: 500 });
//   }
// };

