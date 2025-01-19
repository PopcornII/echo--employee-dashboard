
import { message } from 'antd';


export const DynamicSnackbar = ({ onSuccess, onError, onWarning }) => {
  const [messageApi, contextHolder] = message.useMessage();

  const success = (messageBody: string) => {
    messageApi.open({
      type: 'success',
      content: messageBody,
    });
    if (onSuccess) onSuccess(messageBody);
  
  };

  const error = (messageBody: string) => {
    messageApi.open({
      type: 'error',
      content: messageBody,
    });
    if (onError) onError(messageBody);
    
  };

  const warning = (messageBody: string) => {
    messageApi.open({
      type: 'warning',
      content: messageBody,
    });
    if (onWarning) onWarning(messageBody);
  }

  return (
    {contextHolder}
  )

}

