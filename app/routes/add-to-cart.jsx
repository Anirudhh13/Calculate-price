import { json } from "@remix-run/node";

export async function action({ request }) {
    const shopifyStorefrontToken = 'shpua_b844a162a07c0c1f4a0aadf43cc3411e';
    const shopifyStoreDomain = 'my-public-app.myshopify.com';

    const body = await request.json();
    const { variantId } = body; 

    const addToCartResponse = await fetch(`https://${shopifyStoreDomain}/api/2024-04/graphql.json`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Shopify-Storefront-Access-Token": shopifyStorefrontToken,
        },
        body: JSON.stringify({
            query: `
                mutation {
                    cartCreate(input: {
                        lines: [
                            {
                                quantity: 1
                                merchandiseId: "${variantId}"
                            }
                        ]
                    }) {
                        cart {
                            id
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

    const data = await addToCartResponse.json();
    if (data.data.cartCreate.userErrors.length > 0) {
        return json({ error: data.data.cartCreate.userErrors }, { status: 400 });
    }

    return json({ cartId: data.data.cartCreate.cart.id });
}
