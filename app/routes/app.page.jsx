// import AdminDashboard from '../components/AdminDashboard';
import React, { useEffect, useState, useCallback } from 'react';
import {
    Page,
    Text,
    Layout,
    Card,
    Button,
    DataTable,
    Badge,
    TextField,
    ButtonGroup,
    BlockStack,
    Box,
    Toast,
    Frame,
  } from "@shopify/polaris";
  import {PlusIcon} from '@shopify/polaris-icons';
  import {Spinner} from '@shopify/polaris';
  import { authenticate } from '../shopify.server';
import { useLoaderData } from '@remix-run/react';

// get metafield values 
export const loader = async ({request}) => {
    try {
        const { admin, session } = await authenticate.admin(request);
        const response = await admin.graphql(
            `#graphql
            query {
            shop {
                name
                metafields(first: 10, namespace:"custom_form") {
                edges {
                    node {
                    key
                    namespace
                    value
                    }
                }
                }
            }
            }`,
          );

          const data = await response.json();
          return data;

    } catch (error) {
        return error;
    }
  };

const page = () => {
    const loaderData = useLoaderData();
    // console.log("loaderData",loaderData)
    const [fields, setFields] = useState([{ id: Date.now(), label: "", value: "" }]); 
    const [profileData, setProfileData] = useState([]);
    const [metafields, setMetafields] = useState(loaderData.data.shop.metafields.edges);

    const [toggle, setToggle] = useState('');
    const [isLoadingT, setIsLoadingT] = useState(false);

    const showFormCollection = async (value) => {
        setToggle(value);
        setIsLoadingT(true);
        try {
          const response = await fetch("/toggle-collection-form", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              definition: {
                name: "Custom form",
                namespace: "custom_form",
                key: "visibilityOnCollection",
                value: JSON.stringify(value),
                ownerType: "SHOP",
              },
            }),
          });
    
          const result = await response.json();
    
          if (result.success) {
            console.log("Response data:", result.data);
          } else {
            console.error("Error details:", result.error);
          }
        } catch (error) {
          alert("An unexpected error occurred.");
          console.error(error);
        } finally {
          setIsLoadingT(false); 
        }
      };

    const handleFieldChange = (id, field, value) => {
        setFields((prevFields) =>
            prevFields.map((fieldObj) => 
                fieldObj.id === id ? { ...fieldObj, [field]: value } : fieldObj
            )
        );
    };

    const handleAddFields = () => {
        setFields((prevFields) => [...prevFields, { id: Date.now(), value: "" }]); 
    };

    const handleSubmit = () => {
        setProfileData([...profileData, ...fields])
        customerProfileData([...profileData, ...fields]);
    };

    const [isLoading, setIsLoading] = useState(false);
    const [active, setActive] = useState(false);

    const toggleActive = useCallback(() => setActive((active) => !active), []);
  
    const toastMarkup = active ? (
      <Toast content="saved" onDismiss={toggleActive} />
    ) : null;
    const customerProfileData = async (arr) => {
      setIsLoading(true);
        try {
              const response = await fetch("/profile-data", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    key: "Input_types", 
                    value: JSON.stringify(arr), 
                  
                }),
              });
      
              const result = await response.json();
      // console.log("result:", result);
              if (result.success) {
                console.log(`Success for ID :`, result.data);
              } else {
                console.error(`Error for ID ${id}:`, result.error);
              }
          console.log("All customer profile data requests have been completed.");
        } catch (error) {
          console.error("An unexpected error occurred:", error);
        } finally {
          setIsLoading(false);
          toggleActive();
          setFields([{ id: Date.now(), label: "", value: "" }]); 
      }
      };
      

      useEffect(() => {
        const newArray = metafields.filter((currentElement) =>  currentElement.node.key === 'Input_types');
        const newArrayValues = (newArray[0].node.value );
        const newArrayValue = JSON.parse(newArrayValues);
        setProfileData(newArrayValue)
       
        const visibility_Meta = metafields.filter((currentElement) =>  currentElement.node.key === 'visibilityOnCollection');
        const visibilityValue = (visibility_Meta[0].node.value );
        console.log(visibilityValue);
        setToggle(visibilityValue);
    }, [fields]);

    return (
        <Page>
            <Layout>
                <Layout.Section>
                        {fields.map((field) => (
                            <>
                                <TextField
                                    label={`Label`}
                                    value={field.label}
                                    onChange={(value) => handleFieldChange(field.id, 'label', value)}
                                    autoComplete="off"
                                />
                                <TextField
                                    label={`Value`}
                                    value={field.value}
                                    onChange={(value) => handleFieldChange(field.id, 'value', value)}
                                    autoComplete="off"
                                />
                                </>
                        ))}
                </Layout.Section>
                <Layout.Section>
                        <Box>
                    <ButtonGroup>
                            <Button icon={PlusIcon} onClick={handleAddFields}>
                                Add Field
                            </Button>
                            <Button
                              variant="primary"
                              disabled={isLoading} 
                              loading={isLoading} 
                              onClick={handleSubmit}
                              style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '8px' }} 
                            >
                             Submit
                          </Button>
                    </ButtonGroup>
                    </Box>
                </Layout.Section>
                <Layout.Section>
                    <Card title="Submitted Data" sectioned>
                        <DataTable
                            columnContentTypes={[
                                'text',
                                'text',
                            ]}
                            headings={[
                                'Label',
                                'Value',
                            ]}
                            rows={profileData.map(field => [field.label, field.value])}
                        />
                    </Card>
                </Layout.Section>
                <Layout.Section>
                      <Card>
                      <div style={{ display: "flex", width: "240px", justifyContent: "space-between" }}>
                      <Text as="h2" variant="bodyMd">
                        Show form on collection page
                      </Text>
                      <Badge>
                        {isLoadingT ? (
                          toggle ? "OFF" : "ON"
                        ) : toggle ? "ON" : "OFF"}
                      </Badge>
                      </div>
                      <ButtonGroup>
                      <Button
                        onClick={() => showFormCollection(!toggle)}
                        disabled={isLoadingT} 
                        loading={isLoadingT} 
                      >
                        {toggle ? "Hide" : "Show"}
                      </Button>
                    </ButtonGroup>
                    </Card> 
                </Layout.Section>
            </Layout>
            <Frame>
             {toastMarkup}
             </Frame>
        </Page>
    );
};


export default page;