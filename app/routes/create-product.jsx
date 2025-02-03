import { json } from "@remix-run/node";

export async function loader({ request }) {
    const bodyy = await request.json();

    console.log("bodyy:", bodyy);
    return null;
}

export async function action({ request }) {
    const shopifyAdminToken = 'shpua_b844a162a07c0c1f4a0aadf43cc3411e';
    const shopifyStoreDomain = 'my-public-app.myshopify.com';

    const body = await request.json();
    console.log("create product:", body);
    const { title, price, variantId } = body;

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
                        variants: [{ price: "${price}" }]
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

    if (data.data.productCreate.userErrors.length > 0) {
        return json({ error: data.data.productCreate.userErrors }, { status: 400 });
    }

    const newProductId = data.data.productCreate.product.id;
    const newVariantId = data.data.productCreate.product.variants.edges[0].node.id;

    return json({ productId: newProductId, variantId: newVariantId });      
}
