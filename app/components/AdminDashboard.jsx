import React from "react";
import {
  Text,
  Card,
  Button,
  ButtonGroup,
  Badge,
} from "@shopify/polaris";
import "./style.css";
import { useState } from "react";


const AdminDashboard = () => {
  
  const [toggle, setToggle] = useState(false);
  // const [disable, setDisable] = useState(false);
  

  const handleToggleRegistrationForm = async (value) => {
    setToggle(value)
    // setDisable(true)
    try {
      const response = await fetch("/toggle-registration-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          definition: {
            name: "Custom form",
            namespace: "custom_form",
            key: "visibility",
            value: JSON.stringify(value),
            ownerType: "SHOP",
          },
        }),
      });

      const result = await response.json();
      // setDisable(false);

      if (result.success) {
        // alert("Registration form visibility toggled!");
        console.log("Response data:", result.data);
      } else {
        // alert("Failed to toggle registration form visibility.");
        console.error("Error details:", result.error);
      }
    } catch (error) {
      alert("An unexpected error occurred.");
      console.error(error);
    }
  };

  return (
    <>
      <Card>
        <div>
      <Text as="h2" variant="bodyMd">
        Registration Form Visibility
      </Text>
      <Badge>{toggle?"ON":"OFF"}</Badge>
      </div>
      <ButtonGroup>
        <Button onClick={()=>handleToggleRegistrationForm(!toggle)}>{toggle?"Hide":"Show"}</Button>
      </ButtonGroup>
    </Card>
    </>
  );
};

export default AdminDashboard;

