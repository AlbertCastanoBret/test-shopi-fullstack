import { SaveBar, useAppBridge } from "@shopify/app-bridge-react";
import { Button, Card, FormLayout, Icon, Page, TextField } from "@shopify/polaris";
import {HideIcon, ViewIcon} from '@shopify/polaris-icons';
import { useCallback, useEffect, useState } from "react";
import { useQuery } from "react-query";

export default function ERPSettings() {

  const shopify = useAppBridge();
  const [formData, setFormData] = useState({
    ip: "",
    port: "",
    user: "",
    password: ""
  });
  const [errorData, setError] = useState({
    ip: false,
    port: false,
    user: false,
    password: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {data, isLoading} = useQuery({
    queryFn: async () => {
      const response = await fetch("/api/erp");
      return await response.json();
    }
  })

  useEffect(() => {
    if (!isLoading && data) {
      setFormData(data);
    }
  }, [isLoading, data]);

  useEffect(() => {
    shopify.loading(isLoading || isSaving);
  }, [isLoading, isSaving]);

  const handleChangeForm = useCallback((newValue, name) => {
    setFormData((prevState) => ({...prevState, [name]: newValue}));
    if (errorData[name]) {
      setError((prevState) => ({...prevState, [name]: false}));
    }
    shopify.saveBar.show('my-save-bar')
  }, [errorData]);
  
  const handleShowPassword = () => setShowPassword((prevState) => !prevState);

  const handleSave = () => {
    shopify.saveBar.hide('my-save-bar');

    const errors = {
      ip: !formData.ip.match(/^([0-9]{1,3}\.){3}[0-9]{1,3}$/) || formData.ip === "",
      port: formData.port < 0 || formData.port > 65535 || formData.port === "",
      user: formData.user === "",
      password: formData.password === ""
    };

    setError(errors);

    if (Object.values(errors).some((error) => error)) {
      shopify.toast.show('Please, fix the errors');
      return;
    }

    saveErpCredentials();
  };

  const handleDiscard = () => {
    shopify.saveBar.hide('my-save-bar');
    setFormData(data);
  };

  const saveErpCredentials = async () => {
    try {
      setIsSaving(true);
      await fetch("/api/erp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
    } catch (error) {
      setIsSaving(false);
      console.log(error);
      shopify.toast.show('Oops! Some error occurred');
    } finally {
      setIsSaving(false);
      shopify.toast.show('ERP credentials updated');
    }
  }

  return <Page title="ERP settings" narrowWidth>
    <Card>
      <FormLayout>
        <FormLayout.Group>
          <TextField 
            label="IP" 
            type="text"
            value={formData.ip}
            disabled={isLoading || isSaving}
            error={errorData.ip ? "IP must be in the format xxx.xxx.xxx.xxx" : ""}
            autoComplete="off"
            onChange={(newValue) => handleChangeForm(newValue, "ip")}/>
          <TextField 
            label="Port" 
            type="number"
            value={formData.port}
            disabled={isLoading || isSaving}
            error={errorData.port ? "Port must be between 0 and 65535" : ""}
            autoComplete="off"
            onChange={(newValue) => handleChangeForm(newValue, "port")}/>
        </FormLayout.Group>
        <FormLayout.Group>
          <TextField 
            label="User"
            type="text"
            value={formData.user}
            disabled={isLoading || isSaving}
            error={errorData.user ? "User cannot be empty" : ""}
            autoComplete="off"
            onChange={(newValue) => handleChangeForm(newValue, "user")}/>
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            disabled={isLoading || isSaving}
            error={errorData.password ? "Password cannot be empty" : ""}
            autoComplete="off"
            onChange={(newValue) => handleChangeForm(newValue, "password")}
            connectedRight={
              <Button 
                icon={showPassword ? HideIcon : ViewIcon}
                accessibilityLabel="Toggle password visibility"
                disabled={isLoading}
                onClick={handleShowPassword}/>
            }
          />
        </FormLayout.Group>
      </FormLayout>
    </Card>
    <SaveBar id="my-save-bar">
      <button 
        variant="primary" 
        onClick={handleSave}>
      </button>
      <button 
        onClick={handleDiscard}>
      </button>
    </SaveBar>
  </Page>;
}
