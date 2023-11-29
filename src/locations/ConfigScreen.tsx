import React, { useCallback, useState, useEffect } from "react";
import { ConfigAppSDK } from "@contentful/app-sdk";
import {
  FormControl,
  Heading,
  Card,
  Tabs,
  Stack,
  TextInput,
} from "@contentful/f36-components";
import { Paragraph } from "@contentful/f36-typography";
//import tokens from '@contentful/f36-tokens';

//import { css } from 'emotion';
import { /* useCMA, */ useSDK } from "@contentful/react-apps-toolkit";

export interface AppInstallationParameters {
    apiKey?: string;
    baseURL?: string;
}

const ConfigScreen = () => {
  const [parameters, setParameters] = useState<AppInstallationParameters>({
      apiKey: ""
  });
  const sdk = useSDK<ConfigAppSDK>();
  /*
     To use the cma, inject it as follows.
     If it is not needed, you can remove the next line.
  */
  // const cma = useCMA();

  const onConfigure = useCallback(async () => {
    // This method will be called when a user clicks on "Install"
    // or "Save" in the configuration screen.
    // for more details see https://www.contentful.com/developers/docs/extensibility/ui-extensions/sdk-reference/#register-an-app-configuration-hook

    // Get current the state of EditorInterface and other entities
    // related to this app installation
    const currentState = await sdk.app.getCurrentState();

    //check field values
    
    return {
      // Parameters to be persisted as the app configuration.
      parameters,
      // In case you don't want to submit any update to app
      // locations, you can just pass the currentState as is
      targetState: currentState,
    };
  }, [parameters, sdk]);

  useEffect(() => {
    // `onConfigure` allows to configure a callback to be
    // invoked when a user attempts to install the app or update
    // its configuration.
    sdk.app.onConfigure(() => onConfigure());
  }, [sdk, onConfigure]);

  useEffect(() => {
    (async () => {
      // Get current parameters of the app.
      // If the app is not installed yet, `parameters` will be `null`.
      const currentParameters: AppInstallationParameters | null =
        await sdk.app.getParameters();

      if (currentParameters) {
        setParameters(currentParameters);
      }

      // Once preparation has finished, call `setReady` to hide
      // the loading screen and present the app to a user.
      sdk.app.setReady();
    })();
  }, [sdk]);

  return (
    <Card style={{ maxWidth: "50em", margin: "3em auto" }}>
      <img
        src="https://tinyurl.com/images/icons/favicon-128.png"
        alt="Tiny URL"
        style={{ height: "5em", display: "block" }}
    />

      <Tabs defaultTab="first">
        <Tabs.List>
          <Tabs.Tab panelId="first">Configuration</Tabs.Tab>
          <Tabs.Tab panelId="second">Feedback</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel id="first">
          <Heading marginTop="spacingS" as="h3">
            Configuration
          </Heading>

          <Stack flexDirection="column" alignItems="left">
            <FormControl isRequired isInvalid={!parameters.apiKey}>
              <FormControl.Label>API Key</FormControl.Label>
              <TextInput
                value={parameters.apiKey}
                name="apikey"
                type="password"
                placeholder="Your tiny URL API Key"
                onChange={(e) => setParameters({...parameters, apiKey : e.target.value })}
              />
              <FormControl.HelpText>
                Provide your tiny URL API Key
              </FormControl.HelpText>
              {!parameters.apiKey && (
                <FormControl.ValidationMessage>
                  Please, provide your API Key
                </FormControl.ValidationMessage>
              )}
            </FormControl>
            <FormControl isRequired isInvalid={!parameters.baseURL}>
              <FormControl.Label>Base URL</FormControl.Label>
              <TextInput
                value={parameters.baseURL}
                name="baseUrl"
                type="text"
                placeholder="Your base URL"
                onChange={(e) => setParameters({...parameters, baseURL : e.target.value })}
              />
              <FormControl.HelpText>
                Provide your base URL
              </FormControl.HelpText>
              {!parameters.baseURL && (
                <FormControl.ValidationMessage>
                  Please, provide your base URL
                </FormControl.ValidationMessage>
              )}
            </FormControl>

          </Stack>
        </Tabs.Panel>
        <Tabs.Panel id="second">
          <Heading marginTop="spacingS" as="h3">
            Questions or comments?
          </Heading>
          <Paragraph>
            Please reach out to{" "}
            <a href="mailto:patrick.geers@contentful.com">Patrick Geers</a>.
          </Paragraph>
        </Tabs.Panel>
      </Tabs>
    </Card>
  );
};

export default ConfigScreen;
