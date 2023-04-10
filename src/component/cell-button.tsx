import React from 'react';
import { Button } from 'antd';
import { SearchOutlined, MinusCircleOutlined } from '@ant-design/icons';

export function CellButton({ state } : { state?: boolean}) {
  return <Button 
  icon={state!==undefined&&state===true?<MinusCircleOutlined/>:<SearchOutlined/>} 
  danger={state as boolean} 
  type={state === false ? 'primary' :'default'}></Button>
}
