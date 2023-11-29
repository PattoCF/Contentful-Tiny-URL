import React, {
  useState
} from 'react';
import {
  SidebarAppSDK
} from '@contentful/app-sdk';
import {
  useSDK
} from '@contentful/react-apps-toolkit';
import {
  Button,
  Select,
  TextInput,
  CopyButton,
  Flex,
  Paragraph
} from "@contentful/f36-components";
const Sidebar = () => {
      const [fieldValue, setFieldValue] = useState(String);
      const [selectedField, setSelectedField] = useState(String)
      const sdk = useSDK < SidebarAppSDK > ();
      let updateFields = (data: any) => {

          let newData = JSON.parse(data)
          setFieldValue(newData.data.tiny_url)
      }
      let handleChange = (event: any) => {
          debugger
          setSelectedField(event.target.value)
          return true
      
        }
      let generateTinyUrl = () => {
          var myHeaders = new Headers();
          myHeaders.append("accept", "application/json");
          myHeaders.append("Content-Type", "application/json");
          let url = '';
          let selectedFieldValue = sdk.entry.fields[selectedField].getValue()

          sdk.parameters.installation.baseURL.endsWith("/") && selectedField ? url = sdk.parameters.installation.baseURL + selectedFieldValue : url = sdk.parameters.installation.baseURL + "/" + selectedFieldValue

          var raw = JSON.stringify({
              "url": url,
              "domain": "tinyurl.com",
              "description": "string"
          });
          var requestOptions: any = {
              method: 'POST',
              headers: myHeaders,
              body: raw,
              redirect: 'follow'
          };
          fetch("https://api.tinyurl.com/create?api_token=" + sdk.parameters.installation.apiKey, requestOptions).then(response => response.text()).then(result => updateFields(result))
          .catch(error => console.log('error', error));
      }
      

return (
    <div>
      <Paragraph>Select the field for creating the URL</Paragraph>
      <Flex flexDirection="row" gap="spacingS"
          justifyContent="center" marginBottom="spacingS"> 
        <Select id='slctField' onChange={(event) => handleChange (event)}> 
        {
          sdk.contentType.fields.map( (contentType) => 
          contentType.type === 'Symbol' ? <option key={contentType.id} value={contentType.id}>{contentType.name}</option> : ''
          
          )
        }
        </Select>
        <Button id='sbmtBtn' variant='primary' onClick={generateTinyUrl}>Create tiny URL</Button> 
      </Flex>
      <Flex flexDirection="row">
        <TextInput.Group>
          <TextInput isDisabled id='urlOutput' value={fieldValue}/>
          <CopyButton
            value={fieldValue}
            tooltipProps={{ placement: 'right', usePortal: true }}
          />
        </TextInput.Group>
      </Flex>
    </div>

)};

export default Sidebar;
